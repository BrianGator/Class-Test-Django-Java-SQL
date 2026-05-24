import React, { useState, useEffect } from "react";
import { Course, Question, Choice, ExamSubmission } from "../types";
import {
  Database,
  Plus,
  Trash2,
  Code,
  Info,
  RefreshCw,
  Layers,
  Shield,
  Users,
  BookOpen,
  HelpCircle,
  CheckSquare,
  FileText,
  User,
  Settings,
  ArrowRight,
  Eye,
  Calendar,
  Sparkles,
  Lock,
  List,
  ExternalLink,
  CheckCircle,
  XCircle,
  Home
} from "lucide-react";

interface DjangoAdminProps {
  courses: Course[];
  questions: Question[];
  choices: Choice[];
  submissions?: ExamSubmission[];
  onAddCourse: (course: Course) => void;
  onAddQuestion: (question: Question) => void;
  onAddChoice: (choice: Choice) => void;
  onDeleteCourse: (id: string) => void;
  onDeleteQuestion: (id: string) => void;
  onDeleteChoice: (id: string) => void;
  onResetData: () => void;
  onLaunchMockPassedSimulator?: () => void;
}

export default function DjangoAdmin({
  courses,
  questions,
  choices,
  submissions = [],
  onAddCourse,
  onAddQuestion,
  onAddChoice,
  onDeleteCourse,
  onDeleteQuestion,
  onDeleteChoice,
  onResetData,
  onLaunchMockPassedSimulator,
}: DjangoAdminProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "questions" | "choices" | "code">("overview");

  // Mock Groups and Users Database state
  const [groups, setGroups] = useState<Array<{ id: string; name: string; permissionsCount: number }>>([
    { id: "grp-1", name: "Instructors", permissionsCount: 24 },
    { id: "grp-2", name: "Students", permissionsCount: 6 },
    { id: "grp-3", name: "Auditors", permissionsCount: 2 },
  ]);

  const [users, setUsers] = useState<Array<{ id: string; username: string; email: string; isStaff: boolean; dateJoined: string }>>([
    { id: "usr-1", username: "Brian_McCarthy", email: "BrianSMc@gmail.com", isStaff: true, dateJoined: "2026-05-01" },
    { id: "usr-2", username: "Jane_Doe_Student", email: "jane.doe@edu.org", isStaff: false, dateJoined: "2026-05-10" },
    { id: "usr-3", username: "Prof_Smith", email: "smith@cognitiveclass.ai", isStaff: true, dateJoined: "2026-04-15" },
  ]);

  // Simulation Logs state (Dynamic visual auditor lists)
  const [logs, setLogs] = useState<Array<{ id: string; action: "add" | "delete" | "change" | "reset"; item: string; model: string; time: string }>>([
    { id: "log-1", action: "change", item: "Exam details for course_details_bootstrap.html template", model: "Course", time: "Just now" },
    { id: "log-2", action: "add", item: "Choice: question.choice_set.all() options mapping", model: "Choice", time: "3 mins ago" },
    { id: "log-3", action: "add", item: "Question: Many-to-one ForeignKey mapping constraints", model: "Question", time: "10 mins ago" },
    { id: "log-4", action: "reset", item: "System static cache & model seed values", model: "System", time: "1 hour ago" },
  ]);

  // Dialog / Modal helper states
  const [modalType, setModalType] = useState<"none" | "groups" | "users" | "lessons" | "submissions">("none");
  const [newGroupName, setNewGroupName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserIsStaff, setNewUserIsStaff] = useState(false);

  // Form states for Courses, Questions, and Choices
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

  // Automatically keep forms in sync when lists change
  useEffect(() => {
    if (courses.length > 0 && !newQuestion.courseId) {
      setNewQuestion(prev => ({ ...prev, courseId: courses[0].id }));
    }
  }, [courses]);

  useEffect(() => {
    if (questions.length > 0 && !newChoice.questionId) {
      setNewChoice(prev => ({ ...prev, questionId: questions[0].id }));
    }
  }, [questions]);

  // Log helper
  const addAuditLog = (action: "add" | "delete" | "change", model: string, item: string) => {
    const newLog = {
      id: "log_" + Date.now(),
      action,
      model,
      item,
      time: "Just now",
    };
    setLogs(prev => [newLog, ...prev.slice(0, 15)]);
  };

  // Form submit interceptors
  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.name || !newCourse.description) return;
    const course: Course = {
      ...newCourse,
      id: "course_" + Date.now(),
    };
    onAddCourse(course);
    addAuditLog("add", "Course", course.name);
    setNewCourse({
      name: "",
      description: "",
      category: "Full-Stack Development",
      difficulty: "Intermediate",
      modulesCount: 5,
      durationMinutes: 120,
    });
    // Jump user to see it
    setActiveTab("courses");
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
    addAuditLog("add", "Question", q.questionText.slice(0, 45) + "...");
    setNewQuestion(prev => ({
      ...prev,
      questionText: "",
    }));
    setActiveTab("questions");
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
    const parentQ = questions.find(q => q.id === c.questionId);
    const qText = parentQ ? `(Q: ${parentQ.questionText.slice(0, 15)}...)` : "";
    addAuditLog("add", "Choice", `${c.choiceText.slice(0, 25)}... ${qText}`);
    setNewChoice(prev => ({
      ...prev,
      choiceText: "",
      isCorrect: false,
    }));
    setActiveTab("choices");
  };

  const handleDeleteCourseIntercept = (id: string, name: string) => {
    onDeleteCourse(id);
    addAuditLog("delete", "Course", name);
  };

  const handleDeleteQuestionIntercept = (id: string, text: string) => {
    onDeleteQuestion(id);
    addAuditLog("delete", "Question", text.slice(0, 40) + "...");
  };

  const handleDeleteChoiceIntercept = (id: string, text: string) => {
    onDeleteChoice(id);
    addAuditLog("delete", "Choice", text.slice(0, 40) + "...");
  };

  const handleResetDataIntercept = () => {
    onResetData();
    addAuditLog("change", "System", "Reset database seed & logs successfully");
  };

  // Add interactive group/user handlers for full admin fidelity
  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    const newGrp = {
      id: "grp_" + Date.now(),
      name: newGroupName,
      permissionsCount: Math.floor(Math.random() * 15) + 2,
    };
    setGroups(prev => [...prev, newGrp]);
    addAuditLog("add", "Group", newGrp.name);
    setNewGroupName("");
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newUserEmail.trim()) return;
    const newUsr = {
      id: "usr_" + Date.now(),
      username: newUsername,
      email: newUserEmail,
      isStaff: newUserIsStaff,
      dateJoined: new Date().toISOString().split("T")[0],
    };
    setUsers(prev => [...prev, newUsr]);
    addAuditLog("add", "User", newUsr.username);
    setNewUsername("");
    setNewUserEmail("");
    setNewUserIsStaff(false);
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

class Lesson(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="lessons")
    title = models.CharField(max_length=200)
    order = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.course.name} - {self.title}"

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

  // Derived calculations
  const totalLessonsCount = courses.reduce((acc, current) => acc + current.modulesCount, 0);

  return (
    <div id="django-admin-viewport" className="flex-1 overflow-y-auto bg-slate-100 p-4 md:p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Title block mimicking true Django green scheme */}
        <div className="bg-[#124f38] text-white rounded-t-lg px-6 py-4 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 text-xs text-[#a4f4d6] font-bold tracking-widest uppercase">
              <Database className="w-4 h-4 text-[#a4f4d6]" />
              Django Administration console
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Django administration</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs bg-[#24634d] text-[#e8fbf4] px-3 py-1.5 rounded font-bold uppercase tracking-wider">
              Welcome, Brian_McCarthy
            </span>
            {onLaunchMockPassedSimulator && (
              <button
                id="admin-launch-mock-btn"
                onClick={onLaunchMockPassedSimulator}
                className="flex items-center gap-1.5 bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold py-1.5 px-3 rounded shadow transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Launch Mock Exam Passed
              </button>
            )}
            <button
              id="admin-reset-data-btn"
              onClick={handleResetDataIntercept}
              className="flex items-center gap-1 bg-[#1e293b] hover:bg-slate-800 text-slate-200 text-xs font-semibold py-1.5 px-3 rounded border border-slate-700 hover:text-white transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset DB Tables
            </button>
          </div>
        </div>

        {/* Pseudo-breadcrumb navigation bar */}
        <div id="django-breadcrumbs" className="bg-[#417690] text-[#e2f0f5] text-xs font-bold px-6 py-2.5 shadow-sm rounded-b-lg flex items-center gap-1.5">
          <Home className="w-3.5 h-3.5 opacity-90" />
          <span>Home</span>
          <span>&rsaquo;</span>
          <span className="text-white">Site administration</span>
        </div>

        {/* Django Tab Selectors Navbar */}
        <div className="flex gap-2.5 border-b border-slate-200 my-6 overflow-x-auto pb-1 shrink-0">
          <button
            id="tab-btn-overview"
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-1.5 py-2 px-4 rounded text-xs font-bold uppercase tracking-wider transition ${
              activeTab === "overview"
                ? "bg-[#124f38] text-white shadow-sm"
                : "bg-white text-slate-600 hover:text-slate-900 shadow-sm border border-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Admin Overview Home
          </button>
          <button
            id="tab-btn-courses"
            onClick={() => setActiveTab("courses")}
            className={`flex items-center gap-1.5 py-2 px-4 rounded text-xs font-bold uppercase tracking-wider transition ${
              activeTab === "courses"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:text-slate-900 shadow-sm border border-slate-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Courses ({courses.length})
          </button>
          <button
            id="tab-btn-questions"
            onClick={() => setActiveTab("questions")}
            className={`flex items-center gap-1.5 py-2 px-4 rounded text-xs font-bold uppercase tracking-wider transition ${
              activeTab === "questions"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:text-slate-900 shadow-sm border border-slate-200"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Questions ({questions.length})
          </button>
          <button
            id="tab-btn-choices"
            onClick={() => setActiveTab("choices")}
            className={`flex items-center gap-1.5 py-2 px-4 rounded text-xs font-bold uppercase tracking-wider transition ${
              activeTab === "choices"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:text-slate-900 shadow-sm border border-slate-200"
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            Choices ({choices.length})
          </button>
          <button
            id="tab-btn-code"
            onClick={() => setActiveTab("code")}
            className={`flex items-center gap-1.5 py-2 px-4 rounded text-xs font-bold uppercase tracking-wider transition ${
              activeTab === "code"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:text-slate-900 shadow-sm border border-slate-200"
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            Python Source
          </button>
        </div>

        {/* OVERVIEW TAB: High Fidelity Django Admin panel with Sections */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            
            {/* Left 2 columns: Sections for Auth & OnlineCourse */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* SECTION 1: AUTHENTICATION AND AUTHORIZATION */}
              <div id="admin-section-auth" className="bg-white border border-slate-200 shadow-sm rounded-lg overflow-hidden">
                <div className="bg-[#417690] px-4 py-2.5 flex items-center justify-between text-white font-bold text-xs uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#a4f4d6]" />
                    <span>Authentication and Authorization</span>
                  </div>
                  <Lock className="w-3.5 h-3.5 text-blue-200" />
                </div>
                
                <div className="divide-y divide-slate-150">
                  {/* Groups Row */}
                  <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-blue-600 hover:underline cursor-pointer" onClick={() => setModalType("groups")}>
                          Groups
                        </span>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">{groups.length} security groups active</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setModalType("groups")}
                        className="px-2.5 py-1 text-xs font-bold text-[#417690] bg-[#eef6f9] hover:bg-[#d0e5ed] rounded border border-transparent hover:border-[#417690] transition"
                      >
                        + Add Group
                      </button>
                      <button
                        onClick={() => setModalType("groups")}
                        className="px-2.5 py-1 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded text-center transition"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  {/* Users Row */}
                  <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-blue-600 hover:underline cursor-pointer" onClick={() => setModalType("users")}>
                          Users
                        </span>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">{users.length} active login accounts</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setModalType("users")}
                        className="px-2.5 py-1 text-xs font-bold text-[#417690] bg-[#eef6f9] hover:bg-[#d0e5ed] rounded border border-transparent hover:border-[#417690] transition"
                      >
                        + Add User
                      </button>
                      <button
                        onClick={() => setModalType("users")}
                        className="px-2.5 py-1 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded transition"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: ONLINECOURSE MODELS MANAGEMENT */}
              <div id="admin-section-onlinecourse" className="bg-white border border-slate-200 shadow-sm rounded-lg overflow-hidden">
                <div className="bg-[#124f38] px-4 py-2.5 flex items-center justify-between text-white font-bold text-xs uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#a4f4d6]" />
                    <span>OnlineCourse (Application Models)</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase bg-[#24634d] text-[#e8fbf4] px-1.5 py-0.5 rounded">
                    Active Apps
                  </span>
                </div>

                <div className="divide-y divide-slate-150">
                  {/* Courses Row */}
                  <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-50 text-green-700 rounded">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-green-700 hover:underline cursor-pointer" onClick={() => setActiveTab("courses")}>
                          Courses
                        </span>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">{courses.length} educational courses logged</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveTab("courses")}
                        className="px-2.5 py-1 text-xs font-bold text-[#124f38] bg-[#e6f4ee] hover:bg-[#c9ebd9] rounded transition"
                      >
                        + Add
                      </button>
                      <button
                        onClick={() => setActiveTab("courses")}
                        className="px-2.5 py-1 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded transition"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  {/* Lessons Row (Derived/Computed Inline Model representation) */}
                  <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-50 text-green-700 rounded">
                        <List className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-green-700 hover:underline cursor-pointer" onClick={() => setModalType("lessons")}>
                          Lessons
                        </span>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">{totalLessonsCount} course modules / sections as Lesson instances</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setModalType("lessons")}
                        className="px-2.5 py-1 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded transition"
                      >
                        View Items
                      </button>
                    </div>
                  </div>

                  {/* Questions Row */}
                  <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-50 text-green-700 rounded">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-green-700 hover:underline cursor-pointer" onClick={() => setActiveTab("questions")}>
                          Questions
                        </span>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">{questions.length} inline test questions</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveTab("questions")}
                        className="px-2.5 py-1 text-xs font-bold text-[#124f38] bg-[#e6f4ee] hover:bg-[#c9ebd9] rounded transition"
                      >
                        + Add
                      </button>
                      <button
                        onClick={() => setActiveTab("questions")}
                        className="px-2.5 py-1 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded transition"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  {/* Choices Row */}
                  <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-50 text-green-700 rounded">
                        <CheckSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-green-700 hover:underline cursor-pointer" onClick={() => setActiveTab("choices")}>
                          Choices
                        </span>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">{choices.length} multiple choice options</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveTab("choices")}
                        className="px-2.5 py-1 text-xs font-bold text-[#124f38] bg-[#e6f4ee] hover:bg-[#c9ebd9] rounded transition"
                      >
                        + Add
                      </button>
                      <button
                        onClick={() => setActiveTab("choices")}
                        className="px-2.5 py-1 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded transition"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  {/* Submissions Row */}
                  <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-50 text-green-700 rounded">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-green-700 hover:underline cursor-pointer" onClick={() => setModalType("submissions")}>
                          Submissions
                        </span>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">{submissions.length} dynamic student records stored</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setModalType("submissions")}
                        className="px-2.5 py-1 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded transition"
                      >
                        View Log
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informational Guidelines Card */}
              <div className="bg-[#eff6ff] text-blue-900 border border-blue-200 p-5 rounded-lg text-xs leading-relaxed flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold uppercase tracking-wide text-blue-900 mb-1">Interactive Simulation Guidelines</h4>
                  <p className="text-blue-800">
                    Our educational backend tracks relationships according to exact Django guidelines. You can add courses, associate questions to any course, and attach multiple choices to questions. Taking an exam under the **Student Portal** evaluates answers, updates scores, and stores a new custom **Submission model record** visible inside this admin panel!
                  </p>
                </div>
              </div>
            </div>

            {/* Right sidebar: Recent Actions panel */}
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 shadow-sm rounded-lg overflow-hidden">
                <div className="bg-slate-800 text-white font-semibold text-xs tracking-wider uppercase px-4 py-3">
                  Recent Actions Logs
                </div>
                {logs.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs italic">
                    No actions logged in current runtime context.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {logs.map(log => (
                      <div key={log.id} className="p-3 text-xs hover:bg-slate-50 transition border-l-2 border-transparent">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest">{log.model}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">{log.time}</span>
                        </div>
                        <div className="text-slate-800">
                          <span className={`inline-block px-1 rounded text-[9px] font-extrabold uppercase mr-1.5 ${
                            log.action === "add" ? "bg-green-100 text-green-700" :
                            log.action === "delete" ? "bg-red-100 text-red-700" :
                            "bg-blue-100 text-blue-700"
                          }`}>
                            {log.action}
                          </span>
                          <span className="font-medium text-slate-700 line-clamp-2 inline">{log.item}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 rounded-lg shadow-sm border border-slate-800">
                <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-200 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Designer Credits
                </h4>
                <div className="text-xs text-slate-300 leading-relaxed space-y-2">
                  <p>
                    This is an enterprise-grade administrative schema management view, completely aligned with the student evaluation portal.
                  </p>
                  <p className="font-extrabold text-white uppercase tracking-wider pt-2 border-t border-indigo-950/60 font-mono text-[10px]">
                    Maintained by Brian McCarthy
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: COURSES */}
        {activeTab === "courses" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                  Select course to edit <span className="text-xs text-slate-500 font-normal">({courses.length} rows)</span>
                </h3>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-xs font-bold text-slate-600 uppercase border-b border-slate-200">
                      <th className="p-4 font-bold">COURSE TITLE</th>
                      <th className="p-4 font-bold">SYLLABUS DESCRIPTION</th>
                      <th className="p-4 font-bold">DIFFICULTY</th>
                      <th className="p-4 text-right font-bold">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {courses.map(course => {
                      const courseQCount = questions.filter(q => q.courseId === course.id).length;
                      return (
                        <tr key={course.id} className="hover:bg-slate-50/40">
                          <td className="p-4">
                            <div className="font-bold text-slate-950">{course.name}</div>
                            <div className="text-xs text-slate-400 font-mono mt-0.5">{course.id}</div>
                            <div className="text-[10px] bg-slate-100 text-slate-600 font-semibold uppercase px-1.5 py-0.5 rounded inline-block mt-1 font-mono tracking-wider">
                              {course.category}
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="text-slate-600 text-xs line-clamp-3 leading-relaxed max-w-sm">
                              {course.description}
                            </p>
                            <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase">
                              {course.modulesCount} lessons • {course.durationMinutes} mins
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide border ${
                              course.difficulty === "Beginner" ? "bg-green-50 text-green-700 border-green-200" :
                              course.difficulty === "Intermediate" ? "bg-amber-50 text-amber-700 border-amber-200" :
                              "bg-red-50 text-red-700 border-red-200"
                            }`}>
                              {course.difficulty}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              id={`del-course-${course.id}`}
                              onClick={() => handleDeleteCourseIntercept(course.id, course.name)}
                              className="text-red-500 hover:text-red-700 font-bold text-xs flex items-center gap-1 justify-end ml-auto bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition border border-red-200"
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
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm self-start">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4 flex items-center gap-2 pb-2.5 border-b border-slate-100">
                <Plus className="w-4 h-4 text-blue-600" />
                Add Course Instance
              </h3>
              <form onSubmit={handleCreateCourse} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Course Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Django templates inside views"
                    value={newCourse.name}
                    onChange={e => setNewCourse({ ...newCourse, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Syllabus Description</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide detailed description layout..."
                    value={newCourse.description}
                    onChange={e => setNewCourse({ ...newCourse, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50 text-slate-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Difficulty</label>
                    <select
                      value={newCourse.difficulty}
                      onChange={e => setNewCourse({ ...newCourse, difficulty: e.target.value as Course["difficulty"] })}
                      className="w-full p-2 border border-slate-200 rounded text-sm bg-slate-50 text-slate-800 font-semibold"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Lessons count</label>
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
                  className="w-full mt-2 py-2.5 bg-slate-900 text-white rounded text-sm font-bold hover:bg-slate-800 transition shadow-md hover:shadow-lg uppercase tracking-wider"
                >
                  Save Course Object
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB CONTENT: QUESTIONS */}
        {activeTab === "questions" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                Questions List <span className="text-xs text-slate-500 font-normal">({questions.length} objects)</span>
              </h3>
              <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-xs font-bold text-slate-600 uppercase border-b border-slate-200">
                      <th className="p-4 font-bold">COURSE</th>
                      <th className="p-4 font-bold">QUESTION CONTENT</th>
                      <th className="p-4 text-center font-bold">GRADE (POINTS)</th>
                      <th className="p-4 text-right font-bold">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {questions.map(q => {
                      const parentCourse = courses.find(c => c.id === q.courseId);
                      return (
                        <tr key={q.id} className="hover:bg-slate-50/40">
                          <td className="p-4">
                            <div className="font-bold text-slate-950 line-clamp-1">{parentCourse?.name || "Unknown Course"}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{q.courseId}</div>
                          </td>
                          <td className="p-4">
                            <p className="text-slate-800 text-xs font-medium max-w-sm line-clamp-3 leading-relaxed">
                              {q.questionText}
                            </p>
                          </td>
                          <td className="p-4 font-mono font-bold text-blue-600 text-center">
                            +{q.grade}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              id={`del-q-${q.id}`}
                              onClick={() => handleDeleteQuestionIntercept(q.id, q.questionText)}
                              className="text-red-500 hover:text-red-700 font-bold text-xs flex items-center gap-1 justify-end ml-auto bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition border border-red-200"
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
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm self-start">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4 flex items-center gap-2 pb-2.5 border-b border-slate-100">
                <Plus className="w-4 h-4 text-blue-600" />
                Add Question Object
              </h3>
              <form onSubmit={handleCreateQuestion} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Course (ForeignKey Link)</label>
                  <select
                    value={newQuestion.courseId}
                    onChange={e => setNewQuestion({ ...newQuestion, courseId: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded text-sm bg-slate-50 text-slate-800 font-semibold"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Question Content Text</label>
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
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Grade Sum Value Weight</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={newQuestion.grade}
                    onChange={e => setNewQuestion({ ...newQuestion, grade: Number(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded text-sm bg-slate-50 text-slate-850"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Weight of points earned when correct answers are matched.</p>
                </div>
                <button
                  id="submit-add-question"
                  type="submit"
                  className="w-full mt-2 py-2.5 bg-slate-900 text-white rounded text-sm font-bold hover:bg-slate-800 transition shadow-md uppercase tracking-wider"
                >
                  Save Question Object
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB CONTENT: CHOICES */}
        {activeTab === "choices" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                Choice Instances <span className="text-xs text-slate-500 font-normal">({choices.length} options)</span>
              </h3>
              <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-xs font-bold text-slate-600 uppercase border-b border-slate-200">
                      <th className="p-4 font-bold font-semibold">QUESTION PARENT</th>
                      <th className="p-4 font-bold font-semibold">CHOICE VALUE TEXT</th>
                      <th className="p-4 font-bold font-semibold">VERDICT</th>
                      <th className="p-4 text-right font-bold font-semibold">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {choices.map(c => {
                      const parentQ = questions.find(q => q.id === c.questionId);
                      return (
                        <tr key={c.id} className="hover:bg-slate-50/40">
                          <td className="p-4">
                            <div className="font-semibold text-slate-900 line-clamp-2 text-xs">{parentQ?.questionText || "Unknown Question"}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{c.questionId}</div>
                          </td>
                          <td className="p-4">
                            <p className="text-slate-850 text-xs max-w-xs leading-relaxed font-semibold">{c.choiceText}</p>
                          </td>
                          <td className="p-4">
                            {c.isCorrect ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-green-100 text-green-700 tracking-wider border border-green-200 uppercase">
                                CORRECT
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-400 tracking-wider uppercase">
                                incorrect
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              id={`del-choice-${c.id}`}
                              onClick={() => handleDeleteChoiceIntercept(c.id, c.choiceText)}
                              className="text-red-500 hover:text-red-700 font-bold text-xs flex items-center gap-1 justify-end ml-auto bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition border border-red-200"
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
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm self-start">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4 flex items-center gap-2 pb-2.5 border-b border-indigo-100">
                <Plus className="w-4 h-4 text-blue-600" />
                Add Choice Object
              </h3>
              <form onSubmit={handleCreateChoice} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Question (ForeignKey Relation)</label>
                  <select
                    value={newChoice.questionId}
                    onChange={e => setNewChoice({ ...newChoice, questionId: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded text-sm bg-slate-50 text-slate-800 font-semibold"
                  >
                    {questions.map(q => (
                      <option key={q.id} value={q.id}>{q.questionText.slice(0, 50)}...</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Choice Option Statement</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter choice option description..."
                    value={newChoice.choiceText}
                    onChange={e => setNewChoice({ ...newChoice, choiceText: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-500 bg-slate-50 text-slate-700 font-medium"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2.5 cursor-pointer py-1.5 select-none bg-slate-50 border border-slate-250 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={newChoice.isCorrect}
                      onChange={e => setNewChoice({ ...newChoice, isCorrect: e.target.checked })}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                    />
                    <span className="text-xs font-extrabold text-blue-800 uppercase tracking-wider">IS CORRECT OPTION</span>
                  </label>
                </div>
                <button
                  id="submit-add-choice"
                  type="submit"
                  className="w-full mt-2 py-2.5 bg-slate-900 text-white rounded text-sm font-bold hover:bg-slate-800 transition shadow-md uppercase tracking-wider"
                >
                  Save Choice Object
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB CONTENT: PYTHON DJANGO CODE */}
        {activeTab === "code" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3 border-b border-slate-150 pb-3">
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-bold text-slate-800">Django models.py Schema</h3>
                </div>
                <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded font-bold">onlinecourse/models.py</span>
              </div>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                Represents Python Django models for <strong>Course</strong>, <strong>Lesson</strong>, <strong>Question</strong>, <strong>Choice</strong>, and <strong>Submission</strong> models matching the requested certification deliverables.
              </p>
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg text-xs overflow-x-auto font-mono max-h-[350px] leading-relaxed">
                {djangoModelsCode}
              </pre>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3 border-b border-slate-150 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-bold text-slate-800">Django views.py Controllers</h3>
                </div>
                <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded font-bold">onlinecourse/views.py</span>
              </div>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                Implements views including <strong>submit</strong> (to process student answer arrays, save DB submission records) and <strong>exam_result</strong> (grading evaluation rendering).
              </p>
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg text-xs overflow-x-auto font-mono max-h-[350px] leading-relaxed">
                {djangoViewsAndAuthCode}
              </pre>
            </div>
          </div>
        )}

        {/* Dynamic Author Signature Footer section */}
        <div className="pt-6 mt-6 border-t border-slate-350 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1 bg-slate-200 text-slate-700 px-2 py-1 rounded-sm uppercase tracking-widest text-[9px] font-bold">
            <Lock className="w-3 h-3 text-slate-600" /> Django Administration Panel Simulator
          </span>
          <span className="font-extrabold uppercase tracking-widest text-[#124f38] bg-[#e6f4ee] px-2.5 py-1 rounded">
            Written by Brian McCarthy
          </span>
        </div>

      </div>

      {/* INTERACTIVE MODALS FOR SHIELD / AUTHENTICATION & ONLINECOURSE EXTENDED FIDELITY */}
      {modalType !== "none" && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl overflow-hidden border border-slate-350 animate-scaleUp">
            
            {/* Modal Header */}
            <div className="bg-[#417690] text-white px-5 py-3.5 flex items-center justify-between">
              <h4 className="font-bold text-sm uppercase tracking-wide flex items-center gap-2">
                {modalType === "groups" && <Shield className="w-4 h-4 text-[#a4f4d6]" />}
                {modalType === "users" && <Users className="w-4 h-4 text-[#a4f4d6]" />}
                {modalType === "lessons" && <List className="w-4 h-4 text-[#a4f4d6]" />}
                {modalType === "submissions" && <FileText className="w-4 h-4 text-[#a4f4d6]" />}
                <span>
                  {modalType === "groups" && "Django Auth - Groups Directory"}
                  {modalType === "users" && "Django Auth - Users Directory"}
                  {modalType === "lessons" && "Mock Lesson Model entries"}
                  {modalType === "submissions" && "Exam Submissions list logs"}
                </span>
              </h4>
              <button
                onClick={() => setModalType("none")}
                className="text-white hover:text-slate-200 text-xs font-bold leading-none bg-slate-800/10 hover:bg-slate-800/30 px-2 py-1 rounded transition"
              >
                ✖
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 max-h-[380px] overflow-y-auto">
              {modalType === "groups" && (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-3 rounded border text-xs text-slate-600 mb-3">
                    Django Groups offer custom permission levels mapped dynamically to student bodies, staffs or administrators.
                  </div>
                  
                  {/* Active List */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Groups</span>
                    {groups.map(g => (
                      <div key={g.id} className="p-3 bg-white border border-slate-200 rounded-md flex items-center justify-between text-xs font-semibold text-slate-800">
                        <span>🛡️ {g.name}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono">
                          {g.permissionsCount} permissions mapped
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Addition Form */}
                  <form onSubmit={handleAddGroup} className="border-t pt-3 mt-4">
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Create New Django Group</span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Group Name (e.g. Graders)"
                        value={newGroupName}
                        onChange={e => setNewGroupName(e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-slate-200 rounded text-xs text-slate-800"
                      />
                      <button type="submit" className="bg-[#417690] hover:bg-[#346077] text-white px-3 py-1.5 rounded text-xs font-bold transition">
                        Add Row
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {modalType === "users" && (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-3 rounded border text-xs text-slate-600 mb-3">
                    Database login credentials. Active admin superuser accounts are flagged as is_staff=True.
                  </div>
                  
                  {/* Active List */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active users (django.contrib.auth)</span>
                    <div className="space-y-2">
                      {users.map(u => (
                        <div key={u.id} className="p-3 bg-white border border-slate-250 rounded-md text-xs text-slate-800">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold flex items-center gap-1 text-slate-900">
                              👤 {u.username}
                              {u.isStaff && (
                                <span className="text-[9px] font-mono bg-amber-100 text-amber-800 px-1.5 rounded font-extrabold">
                                  STAFF
                                </span>
                              )}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">Joined: {u.dateJoined}</span>
                          </div>
                          <div className="text-slate-500 font-mono text-[11px]">{u.email}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Addition Form */}
                  <form onSubmit={handleAddUser} className="border-t pt-3 mt-4 space-y-3">
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Register New User Instance</span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Username"
                        value={newUsername}
                        onChange={e => setNewUsername(e.target.value)}
                        className="px-3 py-1.5 border border-slate-200 rounded text-xs text-slate-800"
                      />
                      <input
                        type="email"
                        required
                        placeholder="E-mail Address"
                        value={newUserEmail}
                        onChange={e => setNewUserEmail(e.target.value)}
                        className="px-3 py-1.5 border border-slate-200 rounded text-xs text-slate-800"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={newUserIsStaff}
                          onChange={e => setNewUserIsStaff(e.target.checked)}
                          className="w-3.5 h-3.5 rounded text-[#417690]"
                        />
                        <span className="text-xs text-slate-600 font-bold uppercase tracking-wide">Staff Authentication privileges</span>
                      </label>
                      <button type="submit" className="bg-[#417690] hover:bg-[#346077] text-white px-4 py-1.5 rounded text-xs font-bold transition">
                        Insert User Object
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {modalType === "lessons" && (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-3 rounded border text-xs text-slate-600 mb-3">
                    The Lesson model represents modular segments of Courses, which maps to course syllabus chapters.
                  </div>
                  
                  {/* Lists of Lesson Modules per active Course */}
                  <div className="space-y-3.5">
                    {courses.map(course => {
                      return (
                        <div key={course.id} className="border border-slate-200 rounded-md overflow-hidden bg-white">
                          <div className="bg-slate-50 border-b p-2 px-3 text-xs font-bold text-slate-700 bg-slate-50 flex items-center justify-between">
                            <span>📚 {course.name}</span>
                            <span className="text-[10px] font-mono text-slate-400">{course.modulesCount} modules</span>
                          </div>
                          <div className="p-3 space-y-1.5 font-mono text-[11px] text-slate-600">
                            {Array.from({ length: course.modulesCount }).map((_, index) => (
                              <div key={index} className="flex items-center justify-between border-b last:border-b-0 py-1 font-sans text-xs">
                                <span className="font-medium text-slate-800">
                                  Lesson {index + 1}: {
                                    index === 0 ? "Introduction and Overview" :
                                    index === 1 ? "Relational Setup & Admin configurations" :
                                    index === 2 ? "Bootstrap design styling patterns" :
                                    index === 3 ? "ORM Aggregation metrics" :
                                    index === 4 ? "Authentication decorators" :
                                    "Final synthesis examination review"
                                  }
                                </span>
                                <span className="text-[10px] bg-slate-100 text-slate-500 px-1 border rounded">Ordered order={index + 1}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {modalType === "submissions" && (
                <div className="space-y-3">
                  <div className="bg-slate-50 p-3 rounded border text-xs text-slate-650 leading-relaxed">
                    Student performance metadata log. In Django ORM, these are recorded inside the SQLite/PostgreSQL schema upon exam evaluation. Only scores &ge; 80% earn dynamic certificates.
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Exam Attempts ({submissions.length} dynamic row records)
                    </span>
                    {submissions.length === 0 ? (
                      <div className="p-8 text-center text-slate-450 text-xs italic bg-slate-50 rounded border border-dashed">
                        No submissions logged yet. Start an exam under study syllabus to view real-time grading database entries.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {submissions.map((sub, index) => {
                          const courseObj = courses.find(c => c.id === sub.courseId);
                          return (
                            <div key={sub.id} className="p-3 bg-white border border-slate-200 rounded-md text-xs relative overflow-hidden flex flex-col gap-1.5">
                              <div className="flex items-center justify-between font-bold text-slate-800">
                                <span className="truncate max-w-[280px]">📝 Submission #{submissions.length - index} ({courseObj?.name || "Topic"})</span>
                                <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-mono tracking-widest ${
                                  sub.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                                }`}>
                                  {sub.passed ? "PASSED" : "FAILED"}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                                <div>Grade percent: <strong className="text-slate-800">{sub.score}%</strong></div>
                                <div>Accumulation: <strong className="text-slate-800">{sub.scoreAchieved}/{sub.scoreTotal} pts</strong></div>
                              </div>
                              <div className="text-[10px] text-slate-400 italic">Timestamp: {sub.submittedAt.replace("T", " ").substring(0, 19)} UTC</div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t px-5 py-3 flex items-center justify-end">
              <button
                onClick={() => setModalType("none")}
                className="bg-slate-700 text-white font-bold text-xs py-2 px-4 rounded hover:bg-slate-800 transition uppercase tracking-wide shadow-sm"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
