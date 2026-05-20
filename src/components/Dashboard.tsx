import { Course, Question, Choice, ExamSubmission } from "../types";
import { BookOpen, Award, CheckCircle2, AlertCircle, Clock, Zap, ArrowRight, UserCheck } from "lucide-react";

interface DashboardProps {
  courses: Course[];
  questions: Question[];
  choices: Choice[];
  submissions: ExamSubmission[];
  onSelectCourse: (courseId: string) => void;
  onGoToAdmin: () => void;
}

export default function Dashboard({
  courses,
  questions,
  choices,
  submissions,
  onSelectCourse,
  onGoToAdmin,
}: DashboardProps) {

  // Stats summaries
  const enrolledCount = courses.length;
  const completedStats = submissions.filter(s => s.passed);
  const totalSubmits = submissions.length;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Banner Welcome Panel */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white rounded-2xl p-8 relative overflow-hidden shadow-lg border border-blue-800">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_right,rgba(255,255,255,0.15),transparent)] rounded-r-2xl pointer-events-none" />
          <div className="max-w-2xl relative z-10 space-y-3">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 transition">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Cognitive Labs Environment
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl text-white">
              cognitiveclass.ai Assessment Portal
            </h1>
            <p className="text-blue-100 text-sm md:text-base leading-relaxed">
              Successfully complete evaluation exams with an <strong className="text-white">80% pass criteria</strong> score to earn verifiable completion certs. Add custom exam questions or new courses in the Django Admin Simulator below.
            </p>
            <div className="pt-4 flex flex-wrap gap-3">
              <button
                id="dashboard-admin-btn"
                onClick={onGoToAdmin}
                className="px-5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold rounded-lg shadow transition duration-200 transform active:scale-95 flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-blue-600" />
                Launch Django Admin Simulator
              </button>
            </div>
          </div>
        </div>

        {/* Highlight Stats Bento widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Courses</p>
              <h4 className="text-2xl font-bold text-slate-800">{enrolledCount} Available</h4>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Passed Exams</p>
              <h4 className="text-2xl font-bold text-slate-800">{completedStats.length} Certifications</h4>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Attempts</p>
              <h4 className="text-2xl font-bold text-slate-800">{totalSubmits} Submission{totalSubmits !== 1 ? "s" : ""}</h4>
            </div>
          </div>
        </div>

        {/* Course Catalog Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Course Catalog
            </h2>
            <span className="text-xs text-slate-400 font-mono font-medium">Click on a course to view details & assessment</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => {
              const courseQuestions = questions.filter(q => q.courseId === course.id);
              const courseSubmissions = submissions.filter(s => s.courseId === course.id);
              const isPassed = courseSubmissions.some(s => s.passed);
              const lastSubmission = courseSubmissions[courseSubmissions.length - 1];

              return (
                <div
                  key={course.id}
                  id={`course-card-${course.id}`}
                  onClick={() => onSelectCourse(course.id)}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-blue-400 transition cursor-pointer flex flex-col group"
                >
                  {/* Decorative tag top banner */}
                  <div className="h-2 bg-slate-100 group-hover:bg-blue-500 transition-colors duration-300" />
                  
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{course.category}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                          course.difficulty === "Beginner" ? "bg-green-100 text-green-700" :
                          course.difficulty === "Intermediate" ? "bg-amber-100 text-amber-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {course.difficulty}
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition line-clamp-1">
                        {course.name}
                      </h3>
                      
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                        {course.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-3">
                      {/* Metric lines */}
                      <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {course.durationMinutes} mins
                        </span>
                        <span>{courseQuestions.length} Assessment Qs</span>
                      </div>

                      {/* Score history pill */}
                      {lastSubmission && (
                        <div className="p-2.5 rounded bg-slate-50 border border-slate-150 flex items-center justify-between text-xs">
                          <span className="text-slate-500 font-medium">Last score:</span>
                          <span className={`font-mono font-bold ${lastSubmission.passed ? "text-green-600" : "text-red-500"}`}>
                            {lastSubmission.score}% ({lastSubmission.passed ? "PASSED" : "FAILED"})
                          </span>
                        </div>
                      )}

                      {/* Primary Button mimic */}
                      <div className="w-full pt-1">
                        {isPassed ? (
                          <div className="flex items-center justify-center gap-1.5 w-full py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-bold">
                            <CheckCircle2 className="w-4 h-4" />
                            Certified Pass
                          </div>
                        ) : courseQuestions.length === 0 ? (
                          <div className="flex items-center justify-center gap-1.5 w-full py-2 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg text-xs font-bold font-mono">
                            <AlertCircle className="w-4 h-4" />
                            Needs Questions
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1 w-full py-2 bg-slate-900 group-hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition">
                            Open Syllabus & Assessment
                            <ArrowRight className="w-3.5 h-3.5 transition group-hover:translate-x-1" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Author Signature Footer section */}
        <div className="pt-6 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-450 font-medium">
          <span>cognitiveclass.ai Interactive Simulator</span>
          <span className="font-extrabold uppercase tracking-widest text-blue-600">Written by Brian McCarthy</span>
        </div>

      </div>
    </div>
  );
}
