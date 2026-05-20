import React, { useState } from "react";
import { Course, Question, Choice } from "../types";
import { Database, Plus, Trash2, Code, Info, RefreshCw, Layers } from "lucide-react";

interface DjangoAdminProps {
  courses: Course[];
  questions: Question[];
  choices: Choice[];
  onAddCourse: (course: Course) => void;
  onAddQuestion: (question: Question) => void;
  onAddChoice: (choice: Choice) => void;
  onDeleteCourse: (id: string) => void;
  onDeleteQuestion: (id: string) => void;
  onDeleteChoice: (id: string) => void;
  onResetData: () => void;
}

export default function DjangoAdmin({
  courses,
  questions,
  choices,
  onAddCourse,
  onAddQuestion,
  onAddChoice,
  onDeleteCourse,
  onDeleteQuestion,
  onDeleteChoice,
  onResetData,
}: DjangoAdminProps) {
  const [activeTab, setActiveTab] = useState<"courses" | "questions" | "choices" | "code">("courses");

  // Form states
  const [newCourse, setNewCourse] = useState({
    name: "",
    description: "",
    category: "Full-Stack Development",
    difficulty: "Intermediate" as Course["difficulty"],
    modulesCount: 5,
    durationMinutes: 120,
  });

  const [newQuestion, setNewQuestion] = useState({
    courseId: courses[0]?.id || "",
    questionText: "",
    grade: 1,
  });

  const [newChoice, setNewChoice] = useState({
    questionId: questions[0]?.id || "",
    choiceText: "",
    isCorrect: false,
  });

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.name || !newCourse.description) return;
    const course: Course = {
      ...newCourse,
      id: "course_" + Date.now(),
    };
    onAddCourse(course);
    setNewCourse({
      name: "",
      description: "",
      category: "Full-Stack Development",
      difficulty: "Intermediate",
      modulesCount: 5,
      durationMinutes: 120,
    });
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.questionText || !newQuestion.courseId) return;
    const q: Question = {
      id: "q_" + Date.now(),
      courseId: newQuestion.courseId,
      questionText: newQuestion.questionText,
      grade: Number(newQuestion.grade) || 1,
    };
    onAddQuestion(q);
    setNewQuestion(prev => ({
      ...prev,
      questionText: "",
    }));
  };

  const handleCreateChoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChoice.choiceText || !newChoice.questionId) return;
    const c: Choice = {
      id: "choice_" + Date.now(),
      questionId: newChoice.questionId,
      choiceText: newChoice.choiceText,
      isCorrect: newChoice.isCorrect,
    };
    onAddChoice(c);
    setNewChoice(prev => ({
      ...prev,
      choiceText: "",
      isCorrect: false,
    }));
  };

  const djangoModelsCode = `from django.db import models
from django.contrib.auth.models import User

class Course(models.Model):
    name = models.CharField(max_length=200, help_text="Name of the course")
    description = models.TextField(help_text="Detailed syllabus and curriculum outline")
    category = models.CharField(max_length=100, default="Full-Stack Development")
    difficulty = models.CharField(max_length=50, choices=[
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced')
    ])
    modules_count = models.IntegerField(default=5)
    duration_minutes = models.IntegerField(default=120)

    def __str__(self):
        return self.name

class Question(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="questions")
    question_text = models.CharField(max_length=500)
    grade = models.IntegerField(default=1, help_text="Score weight allocated to this question")

    def __str__(self):
        return f"{self.course.name} - {self.question_text[:50]}"

class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="choices")
    choice_text = models.CharField(max_length=500)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.question.id} - {self.choice_text[:30]} ({self.is_correct})"

class Submission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    score = models.FloatField(help_text="Percentage score evaluated")
    score_achieved = models.IntegerField()
    score_total = models.IntegerField()
    passed = models.BooleanField()
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.course.name} - {self.score}%"`;

  const djangoViewsAndAuthCode = `from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.db.models import Sum
from .models import Course, Question, Choice, Submission

@login_required
def course_details(request, course_id):
    course = get_object_or_404(Course, pk=course_id)
    # Query all associated questions and choices for dynamic template display
    questions = Question.objects.filter(course=course)
    context = {
        'course': course,
        'questions': questions
    }
    return render(request, 'onlinecourse/course_details.html', context)

@login_required
def submit_exam(request, course_id):
    course = get_object_or_404(Course, pk=course_id)
    questions = Question.objects.filter(course=course)
    
    if request.method == 'POST':
        user = request.user
        score_achieved = 0
        score_total = sum(q.grade for q in questions)
        
        # Dictionary of question_id to selected_choice_id passed in parameters
        # Loop through each question to validate choices
        for question in questions:
            choice_id = request.POST.get(f"question_{question.id}")
            if choice_id:
                try:
                    selected_choice = Choice.objects.get(pk=choice_id, question=question)
                    if selected_choice.is_correct:
                        score_achieved += question.grade
                except Choice.DoesNotExist:
                    pass
                    
        # Calculate score percent
        score_percent = (score_achieved / score_total) * 100 if score_total > 0 else 0
        passed = score_percent >= 80.0
        
        # Save Python DB submission record
        submission = Submission.objects.create(
            user=user,
            course=course,
            score=score_percent,
            score_achieved=score_achieved,
            score_total=score_total,
            passed=passed
        )
        
        return redirect('exam_result', submission_id=submission.id)
        
    return redirect('course_details', course_id=course_id)

@login_required
def exam_result(request, submission_id):
    submission = get_object_or_404(Submission, pk=submission_id, user=request.user)
    context = {
        'submission': submission,
        'questions': Question.objects.filter(course=submission.course)
    }
    return render(request, 'onlinecourse/exam_result.html', context)`;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Title bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Database className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Django Administration panel</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Visual DB Schema & Object manager</h1>
            <p className="text-sm text-slate-500">
              Directly populate new Course entities, construct multiple choice Questions, and establish correct Choices.
            </p>
          </div>
          <button
            onClick={onResetData}
            id="admin-reset-btn"
            className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-slate-200 text-slate-600 rounded bg-white hover:bg-slate-50 hover:text-slate-800 transition text-sm font-semibold self-start"
          >
            <RefreshCw className="w-4 h-4" />
            Reset DB Seed
          </button>
        </div>

        {/* Django Admin-like tabs */}
        <div className="flex border-b border-slate-200 mb-6 bg-white rounded-lg p-1 shadow-sm shrink-0">
          <button
            id="tab-courses"
            onClick={() => setActiveTab("courses")}
            className={`flex-1 py-2 px-4 rounded text-sm font-semibold transition-colors ${
              activeTab === "courses"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            Courses ({courses.length})
          </button>
          <button
            id="tab-questions"
            onClick={() => setActiveTab("questions")}
            className={`flex-1 py-2 px-4 rounded text-sm font-semibold transition-colors ${
              activeTab === "questions"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            Questions ({questions.length})
          </button>
          <button
            id="tab-choices"
            onClick={() => setActiveTab("choices")}
            className={`flex-1 py-2 px-4 rounded text-sm font-semibold transition-colors ${
              activeTab === "choices"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            Choices ({choices.length})
          </button>
          <button
            id="tab-code"
            onClick={() => setActiveTab("code")}
            className={`flex-1 py-2 px-4 rounded text-sm font-semibold transition-colors ${
              activeTab === "code"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            Python Models & Views Code
          </button>
        </div>

        {/* TAB CONTENT: COURSES */}
        {activeTab === "courses" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-base font-bold text-slate-700">Course Instance Objects (SQLite)</h3>
              <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                      <th className="p-4">ID / NAME</th>
                      <th className="p-4">QTY QUESTIONS</th>
                      <th className="p-4">DIFFICULTY</th>
                      <th className="p-4 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {courses.map(course => {
                      const courseQCount = questions.filter(q => q.courseId === course.id).length;
                      return (
                        <tr key={course.id} className="hover:bg-slate-50/50">
                          <td className="p-4">
                            <div className="font-bold text-slate-800">{course.name}</div>
                            <div className="text-xs text-slate-400 font-mono mt-0.5">{course.id}</div>
                          </td>
                          <td className="p-4 text-slate-600 font-mono font-medium">
                            {courseQCount} question{courseQCount !== 1 ? "s" : ""}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${
                              course.difficulty === "Beginner" ? "bg-green-100 text-green-800" :
                              course.difficulty === "Intermediate" ? "bg-amber-100 text-amber-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {course.difficulty}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              id={`del-course-${course.id}`}
                              onClick={() => onDeleteCourse(course.id)}
                              className="text-red-500 hover:text-red-700 font-medium text-xs flex items-center gap-1 justify-end ml-auto"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CREATE FORM */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                Add Course Instance
              </h3>
              <form onSubmit={handleCreateCourse} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Course Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Django templates inside views"
                    value={newCourse.name}
                    onChange={e => setNewCourse({ ...newCourse, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Description</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide a syllabus statement..."
                    value={newCourse.description}
                    onChange={e => setNewCourse({ ...newCourse, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50 text-slate-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Difficulty</label>
                    <select
                      value={newCourse.difficulty}
                      onChange={e => setNewCourse({ ...newCourse, difficulty: e.target.value as Course["difficulty"] })}
                      className="w-full p-2 border border-slate-200 rounded text-sm bg-slate-50 text-slate-800"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Modules</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={newCourse.modulesCount}
                      onChange={e => setNewCourse({ ...newCourse, modulesCount: Number(e.target.value) || 5 })}
                      className="w-full px-3 py-2 border border-slate-200 rounded text-sm bg-slate-50 text-slate-800 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button
                  id="submit-add-course"
                  type="submit"
                  className="w-full mt-2 py-2 bg-slate-900 text-white rounded text-sm font-semibold hover:bg-slate-800 transition"
                >
                  Save Course Object
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB CONTENT: QUESTIONS */}
        {activeTab === "questions" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-base font-bold text-slate-700">Question Instances (ForeignKey to Course)</h3>
              <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                      <th className="p-4">COURSE</th>
                      <th className="p-4">QUESTION TEXT</th>
                      <th className="p-4">GRADE (POINTS)</th>
                      <th className="p-4 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {questions.map(q => {
                      const parentCourse = courses.find(c => c.id === q.courseId);
                      return (
                        <tr key={q.id} className="hover:bg-slate-50/50">
                          <td className="p-4">
                            <div className="font-semibold text-slate-800 line-clamp-1">{parentCourse?.name || "Unknown Course"}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{q.courseId}</div>
                          </td>
                          <td className="p-4">
                            <p className="text-slate-700 text-xs font-medium max-w-sm line-clamp-3">{q.questionText}</p>
                          </td>
                          <td className="p-4 font-mono font-bold text-blue-600 text-center">
                            {q.grade}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              id={`del-q-${q.id}`}
                              onClick={() => onDeleteQuestion(q.id)}
                              className="text-red-500 hover:text-red-700 font-medium text-xs flex items-center gap-1 justify-end ml-auto"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CREATE FORM */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                Add Question Object
              </h3>
              <form onSubmit={handleCreateQuestion} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Belongs to Course (ForeignKey)</label>
                  <select
                    value={newQuestion.courseId}
                    onChange={e => setNewQuestion({ ...newQuestion, courseId: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded text-sm bg-slate-50 text-slate-800"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Question Content</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Enter the assessment question text detail..."
                    value={newQuestion.questionText}
                    onChange={e => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 bg-slate-50 text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Grade Sum Value</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={newQuestion.grade}
                    onChange={e => setNewQuestion({ ...newQuestion, grade: Number(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded text-sm bg-slate-50 text-slate-850"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Weight of points earned when correct.</p>
                </div>
                <button
                  id="submit-add-question"
                  type="submit"
                  className="w-full mt-2 py-2 bg-slate-900 text-white rounded text-sm font-semibold hover:bg-slate-800 transition"
                >
                  Save Question Object
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB CONTENT: CHOICES */}
        {activeTab === "choices" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-base font-bold text-slate-700">Choice Instances (ForeignKey to Question)</h3>
              <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                      <th className="p-4">QUESTION</th>
                      <th className="p-4">CHOICE VALUE</th>
                      <th className="p-4">VERDICT</th>
                      <th className="p-4 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {choices.map(c => {
                      const parentQ = questions.find(q => q.id === c.questionId);
                      return (
                        <tr key={c.id} className="hover:bg-slate-50/50">
                          <td className="p-4">
                            <div className="font-semibold text-slate-800 line-clamp-1">{parentQ?.questionText || "Unknown Question"}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{c.questionId}</div>
                          </td>
                          <td className="p-4">
                            <p className="text-slate-600 text-xs max-w-xs line-clamp-2">{c.choiceText}</p>
                          </td>
                          <td className="p-4">
                            {c.isCorrect ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-150 text-green-700 uppercase tracking-widest">
                                Correct
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-red-50 text-red-400 uppercase tracking-widest">
                                Incorrect
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              id={`del-choice-${c.id}`}
                              onClick={() => onDeleteChoice(c.id)}
                              className="text-red-500 hover:text-red-700 font-medium text-xs flex items-center gap-1 justify-end ml-auto"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CREATE FORM */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                Add Choice Object
              </h3>
              <form onSubmit={handleCreateChoice} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Belongs to Question (ForeignKey)</label>
                  <select
                    value={newChoice.questionId}
                    onChange={e => setNewChoice({ ...newChoice, questionId: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded text-sm bg-slate-50 text-slate-800"
                  >
                    {questions.map(q => (
                      <option key={q.id} value={q.id}>{q.questionText.slice(0, 50)}...</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Choice Option Content</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter choice option description..."
                    value={newChoice.choiceText}
                    onChange={e => setNewChoice({ ...newChoice, choiceText: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 bg-slate-50 text-slate-700"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 cursor-pointer py-1">
                    <input
                      type="checkbox"
                      checked={newChoice.isCorrect}
                      onChange={e => setNewChoice({ ...newChoice, isCorrect: e.target.checked })}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                    />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">IS CORRECT ANSWER</span>
                  </label>
                </div>
                <button
                  id="submit-add-choice"
                  type="submit"
                  className="w-full mt-2 py-2 bg-slate-900 text-white rounded text-sm font-semibold hover:bg-slate-800 transition"
                >
                  Save Choice Object
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB CONTENT: PYTHON DJANGO CODE */}
        {activeTab === "code" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3 border-b border-slate-150 pb-3">
                <Code className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-800">Django models.py Schema</h3>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                Below is the standard robust Python declarative script that our application state acts upon under-the-hood. It establishes relational constraints, cascades, and data types in the Sqlite datastore.
              </p>
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg text-xs overflow-x-auto font-mono max-h-[350px] leading-relaxed">
                {djangoModelsCode}
              </pre>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3 border-b border-slate-150 pb-3">
                <Layers className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-800">Django views.py Handling Logic</h3>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                This python logic represents the exact back-end controllers executing the grade comparison loops when receiving assessment submits.
              </p>
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg text-xs overflow-x-auto font-mono max-h-[350px] leading-relaxed">
                {djangoViewsAndAuthCode}
              </pre>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
