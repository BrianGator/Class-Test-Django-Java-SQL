import { Course, Question, Choice, ExamSubmission } from "../types";
import { ArrowLeft, BookOpen, Clock, Award, HelpCircle, Check, Play, Edit2, History, AlertCircle } from "lucide-react";

interface CourseDetailsProps {
  course: Course;
  questions: Question[];
  choices: Choice[];
  submissions: ExamSubmission[];
  onBack: () => void;
  onStartExam: () => void;
  onGoToAdmin: () => void;
}

export default function CourseDetails({
  course,
  questions,
  choices,
  submissions,
  onBack,
  onStartExam,
  onGoToAdmin,
}: CourseDetailsProps) {

  const courseSubmissions = submissions.filter(s => s.courseId === course.id);
  const maxScore = courseSubmissions.length > 0 
    ? Math.max(...courseSubmissions.map(s => s.score))
    : 0;
  const isPassed = courseSubmissions.some(s => s.passed);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb */}
        <button
          id="course-back-btn"
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 font-semibold hover:text-slate-800 transition text-xs uppercase tracking-widest cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Course Catalog
        </button>

        {/* Detailed Course Header Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-4">
          <div className="flex flex-wrap gap-2 items-center text-xs font-bold uppercase tracking-wider">
            <span className="text-blue-600">{course.category}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">{course.difficulty} Module</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">{course.name}</h1>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">{course.description}</p>
          
          <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Duration</span>
              <span className="text-base font-bold text-slate-700 flex items-center justify-center gap-1">
                <Clock className="w-4 h-4 text-blue-500" />
                {course.durationMinutes} mins
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Modules</span>
              <span className="text-base font-bold text-slate-700">{course.modulesCount} Core Modules</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Assessment Qs</span>
              <span className="text-base font-bold text-slate-700 font-mono">{questions.length} Questions</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Passing Grade</span>
              <span className="text-base font-bold text-blue-600 font-mono">80% Required</span>
            </div>
          </div>
        </div>

        {/* Course Syllabus & Questions Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Syllabus questions checklist */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Final Exam syllabus & study guide
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Review models configured in Database. There are {questions.length} question modules in this exam.
              </p>
            </div>

            {questions.length === 0 ? (
              <div className="py-12 px-6 bg-amber-50/50 rounded-xl border border-dashed border-amber-200 text-center space-y-4">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                <div>
                  <h4 className="font-bold text-amber-900 text-sm">No exam Questions have been added yet</h4>
                  <p className="text-xs text-amber-700 max-w-sm mx-auto mt-1">
                    This course has no assessments populated. Open Django Admin and add question-and-choice models to run simulation!
                  </p>
                </div>
                <button
                  onClick={onGoToAdmin}
                  className="px-4 py-2 bg-amber-600 text-white rounded text-xs font-bold hover:bg-amber-700 transition"
                >
                  Configure in Django admin
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 space-y-4">
                {questions.map((q, qIndex) => {
                  const qChoices = choices.filter(c => c.questionId === q.id);
                  return (
                    <div key={q.id} className="pt-4 first:pt-0 space-y-3">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 bg-slate-100 rounded text-[10px] font-bold text-slate-500 flex items-center justify-center shrink-0 mt-0.5 font-mono">
                          {qIndex + 1}
                        </span>
                        <div>
                          <h4 className="font-semibold text-slate-800 text-sm">{q.questionText}</h4>
                          <span className="text-[10px] font-mono font-bold text-blue-500 uppercase tracking-widest mt-1 inline-block bg-blue-50 px-1.5 py-0.5 rounded">
                            Grade sum weight: {q.grade} pt{q.grade !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>

                      {/* Display read only Choices checklist */}
                      <ul className="pl-7 space-y-2">
                        {qChoices.map(c => (
                          <li
                            key={c.id}
                            className="flex items-start gap-2 text-xs text-slate-600 group hover:text-slate-800 transition"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 group-hover:bg-blue-500 transition-colors shrink-0" />
                            <span>{c.choiceText}</span>
                          </li>
                        ))}
                        {qChoices.length === 0 && (
                          <li className="text-xs italic text-red-500 font-medium">
                            Warning: No options added. Question cannot be answered.
                          </li>
                        )}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action side Panel */}
          <div className="space-y-6">
            
            {/* Assessment execution trigger box */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-center space-y-4">
              <Award className="w-12 h-12 text-blue-600 mx-auto" />
              <div>
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Final Exam Assessment</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 leading-relaxed">
                  Earn structured credits for cognitiveclass.ai. Submit selections inside our minimum 80% passing threshold.
                </p>
              </div>

              {/* Certified Banner */}
              {isPassed ? (
                <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs font-bold uppercase tracking-wider">
                  ✓ Passed & Certified ({maxScore}%)
                </div>
              ) : maxScore > 0 ? (
                <div className="p-3 rounded-lg bg-red-50 border border-red-250 text-red-700 text-xs font-bold leading-normal">
                  Last try: <span className="font-mono">{maxScore}%</span> <br />
                  <span className="text-[10px] font-normal uppercase tracking-wider text-red-500">FAILED (Requires 80%)</span>
                </div>
              ) : null}

              {questions.length > 0 ? (
                <button
                  id="start-assessment-btn"
                  onClick={onStartExam}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition transform active:scale-95 text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow"
                >
                  <Play className="w-4 h-4 fill-white text-white" />
                  {courseSubmissions.length > 0 ? "Retake Assessment" : "Start Assessment"}
                </button>
              ) : (
                <button
                  onClick={onGoToAdmin}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition text-xs uppercase tracking-widest"
                >
                  Add Questions First
                </button>
              )}
            </div>

            {/* Assessment History Column */}
            {courseSubmissions.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                <h4 className="font-bold text-xs text-slate-700 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <History className="w-4 h-4 text-slate-400" />
                  Attempt History
                </h4>
                <div className="space-y-2 max-h-[180px] overflow-y-auto">
                  {courseSubmissions.slice().reverse().map((sub, sIndex) => (
                    <div key={sub.id} className="text-xs p-2.5 rounded bg-slate-50 border border-slate-150 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-700">Attempt #{courseSubmissions.length - sIndex}</span>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {new Date(sub.submittedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                      <span className={`font-mono font-extrabold px-1.5 py-0.5 rounded ${
                        sub.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-650"
                      }`}>
                        {sub.score}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
