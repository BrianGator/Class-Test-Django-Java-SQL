import { useState, useEffect } from "react";
import { Course, Question, Choice } from "../types";
import { AlertTriangle, Clock, ChevronLeft, Flag } from "lucide-react";

interface ExamWorkspaceProps {
  course: Course;
  questions: Question[];
  choices: Choice[];
  onExit: () => void;
  onSubmit: (answers: Record<string, string>) => void;
}

export default function ExamWorkspace({
  course,
  questions,
  choices,
  onExit,
  onSubmit,
}: ExamWorkspaceProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [markedQuestions, setMarkedQuestions] = useState<Record<string, boolean>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(15 * 60 + 30); // 15 mins 30 secs default timer
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Timer Countdown Effect
  useEffect(() => {
    if (timeLeftSeconds <= 0) {
      // Auto submit when countdown reaches zero
      handleSubmitFinal();
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeftSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeftSeconds]);

  // Format Helper
  const formatTimer = (secs: number) => {
    const mm = Math.floor(secs / 60);
    const ss = secs % 60;
    return `${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
  };

  const currentQuestion = questions[currentIdx];
  const currentChoices = currentQuestion 
    ? choices.filter((c) => c.questionId === currentQuestion.id)
    : [];

  // Metrics
  const answeredCount = Object.keys(userAnswers).length;
  const questionsTotal = questions.length;
  const progressPercent = questionsTotal > 0 ? (answeredCount / questionsTotal) * 100 : 0;

  const handleSelectChoice = (choiceId: string) => {
    if (!currentQuestion) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: choiceId,
    }));
  };

  const handleToggleMarkReview = () => {
    if (!currentQuestion) return;
    setMarkedQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((idx) => idx - 1);
    }
  };

  const handleSaveAndNext = () => {
    if (currentIdx < questionsTotal - 1) {
      setCurrentIdx((idx) => idx + 1);
    } else {
      // If last question, show the submit preview confirmation dialog
      setShowConfirmModal(true);
    }
  };

  const handleSubmitFinal = () => {
    onSubmit(userAnswers);
  };

  if (!currentQuestion) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white text-center font-sans">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Error loading questions</h2>
        <p className="text-slate-500 text-sm mt-1">This course has no assessments configured.</p>
        <button
          onClick={onExit}
          className="mt-6 px-6 py-2.5 bg-slate-900 text-white rounded font-medium text-sm hover:bg-slate-800"
        >
          Exit Assessment
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 font-sans overflow-hidden text-slate-900 border-t border-slate-200">
      
      {/* Header Navigation */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xl">CC</div>
          <div>
            <h1 className="text-xs font-semibold text-slate-500 uppercase tracking-widest leading-none mb-1">Online Course Platform</h1>
            <p className="text-base font-bold leading-none text-slate-800 truncate max-w-[280px] sm:max-w-md">{course.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Time Remaining</p>
            <p className="text-lg font-mono font-semibold text-blue-600">{formatTimer(timeLeftSeconds)}</p>
          </div>
          <button
            onClick={onExit}
            className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
          >
            Save & Exit
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex overflow-hidden">
        
        {/* Sidebar Progress Navigator */}
        <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 hidden md:flex">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Assessment Progress</h2>
            <div className="mt-3 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500 font-medium italic">
              {answeredCount} of {questionsTotal} Questions Answered
            </p>
          </div>

          <div className="flex-grow overflow-y-auto p-4 grid grid-cols-4 gap-2 content-start select-none">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIdx;
              const isAnswered = !!userAnswers[q.id];
              const isMarked = !!markedQuestions[q.id];
              
              let cellClass = "border-slate-200 bg-white text-slate-400";
              if (isAnswered) {
                cellClass = "border-blue-600 bg-blue-50 text-blue-600";
              }
              if (isMarked) {
                cellClass = "border-purple-600 bg-purple-50 text-purple-600";
              }
              if (isCurrent) {
                cellClass = "border-blue-600 bg-white text-blue-600 ring-2 ring-blue-500 ring-offset-2";
              }

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`aspect-square flex items-center justify-center border-2 font-bold rounded cursor-pointer text-xs transition duration-200 ${cellClass}`}
                >
                  {isMarked && !isCurrent ? (
                    <div className="flex flex-col items-center justify-center">
                      <span className="leading-tight">{idx + 1}</span>
                      <span className="text-[8px] uppercase tracking-tighter leading-none -mt-0.5 text-purple-500">REV</span>
                    </div>
                  ) : (
                    idx + 1
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-6 mt-auto bg-slate-50 border-t border-slate-200 text-xs">
            <p className="text-[10px] text-slate-400 mb-2 uppercase font-bold tracking-widest">Instructions</p>
            <p className="text-slate-600 leading-relaxed mb-3">
              Choose the most accurate response. You must achieve <strong className="text-slate-800">80% passing grade sum</strong> to complete this course. Jump to questions via the sidebar index grid at any time.
            </p>
            <div className="border-t border-slate-250 pt-2 text-[10px] uppercase tracking-widest font-extrabold text-blue-600">
              Written by Brian McCarthy
            </div>
          </div>
        </aside>

        {/* Assessment Question Workspace */}
        <section className="flex-grow bg-white p-8 sm:p-12 flex flex-col overflow-y-auto">
          <div className="max-w-3xl">
            
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase rounded tracking-widest font-mono">
                Question {currentIdx + 1} of {questionsTotal}
              </span>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded tracking-wide font-mono">
                Weight: {currentQuestion.grade} points
              </span>
              {markedQuestions[currentQuestion.id] && (
                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold uppercase rounded tracking-wider flex items-center gap-1 font-mono">
                  <Flag className="w-2.5 h-2.5 text-purple-700" />
                  Review Marked
                </span>
              )}
            </div>

            <h2 id="assessment-question-text" className="text-xl sm:text-2xl font-bold text-slate-800 leading-tight mb-8">
              {currentQuestion.questionText}
            </h2>

            {/* Answer Choices list */}
            <div className="space-y-4">
              {currentChoices.map((choice) => {
                const isSelected = userAnswers[currentQuestion.id] === choice.id;

                return (
                  <label
                    key={choice.id}
                    id={`choice-lbl-${choice.id}`}
                    onClick={() => handleSelectChoice(choice.id)}
                    className={`flex items-start gap-4 p-5 border-2 rounded-xl transition-all cursor-pointer group select-none ${
                      isSelected
                        ? "border-blue-500 bg-blue-50/60 shadow-sm"
                        : "border-slate-100 hover:border-blue-200 hover:bg-blue-50/20"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question_${currentQuestion.id}`}
                      checked={isSelected}
                      readOnly
                      className="mt-1 w-5 h-5 accent-blue-600 cursor-pointer shrink-0"
                    />
                    <div>
                      <p className={`text-sm ${isSelected ? "font-bold text-blue-950" : "font-medium text-slate-700"}`}>
                        {choice.choiceText}
                      </p>
                    </div>
                  </label>
                );
              })}

              {currentChoices.length === 0 && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg text-xs font-semibold leading-relaxed">
                  Notice: No choices configured for this question object in the Admin database. Click on Django Admin to setup choice options.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Sticky Footer Controls */}
      <footer className="h-20 bg-white border-t border-slate-200 flex items-center justify-between px-6 sm:px-10 shrink-0">
        <button
          id="btn-prev-question"
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className={`flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-widest transition-colors ${
            currentIdx === 0
              ? "text-slate-300 pointer-events-none"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            id="btn-mark-review"
            onClick={handleToggleMarkReview}
            className={`px-4 sm:px-6 py-2.5 border-2 text-[11px] font-extrabold tracking-wider uppercase rounded-lg transition duration-200 ${
              markedQuestions[currentQuestion.id]
                ? "bg-purple-50 border-purple-300 text-purple-700 hover:bg-purple-100"
                : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            {markedQuestions[currentQuestion.id] ? "Unmark Review" : "Mark for Review"}
          </button>
          
          <button
            id="btn-save-next"
            onClick={handleSaveAndNext}
            className="px-6 sm:px-10 py-3 bg-blue-600 text-white text-[11px] uppercase tracking-wider font-extrabold rounded-lg shadow-lg shadow-blue-200 hover:bg-blue-700 transition transform active:scale-95"
          >
            {currentIdx === questionsTotal - 1 ? "Review & Submit" : "Save and Next"}
          </button>
        </div>

        <button
          id="btn-submit-exam-link"
          onClick={() => setShowConfirmModal(true)}
          className="text-red-500 font-semibold uppercase text-[10px] tracking-widest hover:underline cursor-pointer"
        >
          Submit Exam
        </button>
      </footer>

      {/* Confirm Submission Modal Dialog */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full border border-slate-100 text-center space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Confirm Exam Submission?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              You have answered <strong className="text-slate-700 font-bold">{answeredCount} of {questionsTotal}</strong> questions. Once submitted, your score will be logged in the database and evaluated instantly.
            </p>

            {answeredCount < questionsTotal && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-[11px] text-red-650 flex items-center justify-center gap-1.5 font-bold uppercase tracking-wider">
                Warning: Unanswered questions will receive 0 points.
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                id="modal-cancel-btn"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition uppercase tracking-wider cursor-pointer"
              >
                No, Keep Reviewing
              </button>
              <button
                id="modal-submit-btn"
                onClick={handleSubmitFinal}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition uppercase tracking-wider shadow shadow-blue-200 cursor-pointer"
              >
                Yes, Submit final exam
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
