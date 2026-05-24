import { useState, useEffect } from "react";
import { Course, Question, Choice, ExamSubmission } from "./types";
import { initialCourses, initialQuestions, initialChoices } from "./data";
import Dashboard from "./components/Dashboard";
import DjangoAdmin from "./components/DjangoAdmin";
import CourseDetails from "./components/CourseDetails";
import ExamWorkspace from "./components/ExamWorkspace";
import ExamResult from "./components/ExamResult";
import ProjectDeliverables from "./components/ProjectDeliverables";
import { Database, Layout, BookOpen, AlertCircle, Sparkles } from "lucide-react";

export default function App() {
  // Database state (persisted to localStorage for maximum user interactivity)
  const [courses, setCourses] = useState<Course[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [submissions, setSubmissions] = useState<ExamSubmission[]>([]);

  // Navigation states
  const [currentScreen, setCurrentScreen] = useState<"dashboard" | "admin" | "details" | "workspace" | "result" | "deliverables">("dashboard");
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeSubmissionId, setActiveSubmissionId] = useState<string | null>(null);

  // Initialize DB from localStorage or seed fallback
  useEffect(() => {
    const cachedCourses = localStorage.getItem("cc_courses");
    const cachedQuestions = localStorage.getItem("cc_questions");
    const cachedChoices = localStorage.getItem("cc_choices");
    const cachedSubmissions = localStorage.getItem("cc_submissions");

    if (cachedCourses) setCourses(JSON.parse(cachedCourses));
    else {
      setCourses(initialCourses);
      localStorage.setItem("cc_courses", JSON.stringify(initialCourses));
    }

    if (cachedQuestions) setQuestions(JSON.parse(cachedQuestions));
    else {
      setQuestions(initialQuestions);
      localStorage.setItem("cc_questions", JSON.stringify(initialQuestions));
    }

    if (cachedChoices) setChoices(JSON.parse(cachedChoices));
    else {
      setChoices(initialChoices);
      localStorage.setItem("cc_choices", JSON.stringify(initialChoices));
    }

    if (cachedSubmissions) {
      setSubmissions(JSON.parse(cachedSubmissions));
    } else {
      setSubmissions([]);
      localStorage.setItem("cc_submissions", JSON.stringify([]));
    }
  }, []);

  // Update localStorage when local memory states change
  const updateCourses = (newCourses: Course[]) => {
    setCourses(newCourses);
    localStorage.setItem("cc_courses", JSON.stringify(newCourses));
  };

  const updateQuestions = (newQ: Question[]) => {
    setQuestions(newQ);
    localStorage.setItem("cc_questions", JSON.stringify(newQ));
  };

  const updateChoices = (newC: Choice[]) => {
    setChoices(newC);
    localStorage.setItem("cc_choices", JSON.stringify(newC));
  };

  const updateSubmissions = (newS: ExamSubmission[]) => {
    setSubmissions(newS);
    localStorage.setItem("cc_submissions", JSON.stringify(newS));
  };

  // Add / Delete executors
  const handleAddCourse = (course: Course) => {
    updateCourses([...courses, course]);
  };

  const handleAddQuestion = (q: Question) => {
    updateQuestions([...questions, q]);
  };

  const handleAddChoice = (c: Choice) => {
    updateChoices([...choices, c]);
  };

  const handleDeleteCourse = (id: string) => {
    updateCourses(courses.filter(c => c.id !== id));
    // Cascade delete associated questions & choices
    const remainingQuestions = questions.filter(q => q.courseId !== id);
    updateQuestions(remainingQuestions);
    const qIds = questions.filter(q => q.courseId === id).map(q => q.id);
    updateChoices(choices.filter(c => !qIds.includes(c.questionId)));
  };

  const handleDeleteQuestion = (id: string) => {
    updateQuestions(questions.filter(q => q.id !== id));
    // Cascade delete choices
    updateChoices(choices.filter(c => c.questionId !== id));
  };

  const handleDeleteChoice = (id: string) => {
    updateChoices(choices.filter(c => c.id !== id));
  };

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset the database? This restores all default courses, assessment questions, and wipes previous submissions.")) {
      updateCourses(initialCourses);
      updateQuestions(initialQuestions);
      updateChoices(initialChoices);
      updateSubmissions([]);
      setCurrentScreen("dashboard");
      setActiveCourseId(null);
      setActiveSubmissionId(null);
    }
  };

  // Exam submission evaluation (matching index verification views.py simulation)
  const handleExamSubmit = (answers: Record<string, string>) => {
    if (!activeCourseId) return;
    
    const courseQuestions = questions.filter(q => q.courseId === activeCourseId);
    let scoreAchieved = 0;
    let scoreTotal = 0;

    courseQuestions.forEach(q => {
      scoreTotal += q.grade;
      const selectedChoiceId = answers[q.id];
      if (selectedChoiceId) {
        const choiceObj = choices.find(c => c.id === selectedChoiceId);
        if (choiceObj && choiceObj.isCorrect) {
          scoreAchieved += q.grade;
        }
      }
    });

    const scorePercent = scoreTotal > 0 ? Math.round((scoreAchieved / scoreTotal) * 100) : 0;
    const passed = scorePercent >= 80;

    const submission: ExamSubmission = {
      id: "sub_" + Date.now(),
      courseId: activeCourseId,
      answers,
      score: scorePercent,
      scoreAchieved,
      scoreTotal,
      passed,
      submittedAt: new Date().toISOString()
    };

    const nextSubmissions = [...submissions, submission];
    updateSubmissions(nextSubmissions);
    setActiveSubmissionId(submission.id);
    setCurrentScreen("result");
  };

  // Launch mock exam passed simulator
  const handleLaunchMockPassedSimulator = () => {
    const courseId = "django-advanced";
    const mockAnswers: Record<string, string> = {
      q1: "c1_2", // correct (2 pts)
      q2: "c2_2", // correct (1 pt)
      q3: "c3_1", // correct (1 pt)
      q4: "c4_1", // incorrect (0 pts, correct is c4_2)
      q5: "c5_2", // correct (1 pt)
      q6: "c6_2", // correct (2 pts)
      q7: "c7_2", // correct (1 pt)
      q8: "c8_2", // correct (2 pts)
    };

    // Calculate score based on actual seeded questions/choices in the user state
    const courseQuestions = questions.filter(q => q.courseId === courseId);
    let scoreAchieved = 0;
    let scoreTotal = 0;

    courseQuestions.forEach(q => {
      scoreTotal += q.grade;
      const selectedChoiceId = mockAnswers[q.id];
      if (selectedChoiceId) {
        const choiceObj = choices.find(c => c.id === selectedChoiceId);
        if (choiceObj && choiceObj.isCorrect) {
          scoreAchieved += q.grade;
        }
      }
    });

    const scorePercent = scoreTotal > 0 ? Math.round((scoreAchieved / scoreTotal) * 100) : 0;
    const passed = scorePercent >= 80;

    const submission: ExamSubmission = {
      id: "mock_sub_" + Date.now(),
      courseId: courseId,
      answers: mockAnswers,
      score: scorePercent,
      scoreAchieved,
      scoreTotal,
      passed,
      submittedAt: new Date().toISOString()
    };

    // Append to local storage list & transfer screen
    const nextSubmissions = [...submissions, submission];
    updateSubmissions(nextSubmissions);
    setActiveCourseId(courseId);
    setActiveSubmissionId(submission.id);
    setCurrentScreen("result");
  };

  // Find active entities
  const activeCourse = courses.find(c => c.id === activeCourseId);
  const activeSubmission = submissions.find(s => s.id === activeSubmissionId);

  return (
    <div id="app-viewport-root" className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-start">
      
      {/* Global Application Nav Header */}
      {currentScreen !== "workspace" && (
        <header className="bg-white border-b border-slate-200 py-4 px-6 shrink-0 relative z-10 shadow-sm">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Left aligned logo */}
            <div 
              onClick={() => {
                setCurrentScreen("dashboard");
                setActiveCourseId(null);
              }}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-lg transition duration-200 group-hover:bg-blue-700 shadow-md">
                CC
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-slate-800 tracking-tight">cognitiveclass.ai</span>
                  <span className="text-[10px] font-extrabold uppercase bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-mono">Sim</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium leading-none -mt-0.5">Online Learning & Grading Portal</p>
              </div>
            </div>

            {/* Central screen tab controls */}
            <nav className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-lg p-1">
              <button
                id="nav-tab-dashboard"
                onClick={() => {
                  setCurrentScreen("dashboard");
                  setActiveCourseId(null);
                }}
                className={`py-1.5 px-4 rounded text-xs tracking-wide font-extrabold flex items-center gap-1.5 transition ${
                  currentScreen === "dashboard" || currentScreen === "details" || currentScreen === "result" || currentScreen === "deliverables"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Layout className="w-3.5 h-3.5" />
                Student Portal
              </button>

              <button
                id="nav-tab-admin-sim"
                onClick={() => setCurrentScreen("admin")}
                className={`py-1.5 px-4 rounded text-xs tracking-wide font-extrabold flex items-center gap-1.5 transition ${
                  currentScreen === "admin"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                Django Admin
                <span className="text-[9px] font-mono px-1 bg-blue-100 rounded text-blue-800 font-bold">
                  {courses.length} DB rows
                </span>
              </button>
            </nav>

          </div>
        </header>
      )}

      {/* Screen Routing Outlet Container */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        {currentScreen === "dashboard" && (
          <Dashboard
            courses={courses}
            questions={questions}
            choices={choices}
            submissions={submissions}
            onSelectCourse={(courseId) => {
              setActiveCourseId(courseId);
              setCurrentScreen("details");
            }}
            onGoToAdmin={() => setCurrentScreen("admin")}
            onLaunchMockPassedSimulator={handleLaunchMockPassedSimulator}
            onGoToDeliverables={() => setCurrentScreen("deliverables")}
          />
        )}

        {currentScreen === "admin" && (
          <DjangoAdmin
            courses={courses}
            questions={questions}
            choices={choices}
            submissions={submissions}
            onAddCourse={handleAddCourse}
            onAddQuestion={handleAddQuestion}
            onAddChoice={handleAddChoice}
            onDeleteCourse={handleDeleteCourse}
            onDeleteQuestion={handleDeleteQuestion}
            onDeleteChoice={handleDeleteChoice}
            onResetData={handleResetData}
            onLaunchMockPassedSimulator={handleLaunchMockPassedSimulator}
          />
        )}

        {currentScreen === "details" && activeCourse && (
          <CourseDetails
            course={activeCourse}
            questions={questions.filter(q => q.courseId === activeCourse.id)}
            choices={choices.filter(c => questions.filter(q => q.courseId === activeCourse.id).map(q => q.id).includes(c.questionId))}
            submissions={submissions}
            onBack={() => {
              setCurrentScreen("dashboard");
              setActiveCourseId(null);
            }}
            onStartExam={() => setCurrentScreen("workspace")}
            onGoToAdmin={() => setCurrentScreen("admin")}
          />
        )}

        {currentScreen === "workspace" && activeCourse && (
          <ExamWorkspace
            course={activeCourse}
            questions={questions.filter(q => q.courseId === activeCourse.id)}
            choices={choices.filter(c => questions.filter(q => q.courseId === activeCourse.id).map(q => q.id).includes(c.questionId))}
            onExit={() => {
              setCurrentScreen("details");
            }}
            onSubmit={handleExamSubmit}
          />
        )}

        {currentScreen === "result" && activeCourse && activeSubmission && (
          <ExamResult
            course={activeCourse}
            questions={questions.filter(q => q.courseId === activeCourse.id)}
            choices={choices.filter(c => questions.filter(q => q.courseId === activeCourse.id).map(q => q.id).includes(c.questionId))}
            submission={activeSubmission}
            onRetake={() => {
              setCurrentScreen("workspace");
            }}
            onBackToSyllabus={() => {
              setCurrentScreen("details");
            }}
            onViewDashboard={() => {
              setCurrentScreen("dashboard");
              setActiveCourseId(null);
            }}
          />
        )}

        {currentScreen === "deliverables" && (
          <ProjectDeliverables
            onBack={() => {
              setCurrentScreen("dashboard");
            }}
          />
        )}

      </div>

      {/* Global persistent footer with designer attributes */}
      {currentScreen !== "workspace" && (
        <footer id="global-designer-footer" className="w-full text-center py-4 bg-white border-t border-slate-200 text-[11px] font-extrabold tracking-widest text-slate-500 uppercase shrink-0">
          Written by Brian McCarthy • Relational Simulator Engine
        </footer>
      )}
    </div>
  );
}
