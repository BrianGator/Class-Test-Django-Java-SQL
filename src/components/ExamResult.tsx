import { Course, Question, Choice, ExamSubmission } from "../types";
import { Award, CheckCircle2, XCircle, ArrowRight, RefreshCw, BookOpen, Clock, Activity, Zap } from "lucide-react";

interface ExamResultProps {
  course: Course;
  questions: Question[];
  choices: Choice[];
  submission: ExamSubmission;
  onRetake: () => void;
  onBackToSyllabus: () => void;
  onViewDashboard: () => void;
}

export default function ExamResult({
  course,
  questions,
  choices,
  submission,
  onRetake,
  onBackToSyllabus,
  onViewDashboard,
}: ExamResultProps) {

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Pass/Fail Status Card */}
        <div id="results-dashboard-card" className={`border rounded-2xl p-8 shadow-sm relative overflow-hidden ${
          submission.passed 
            ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 text-green-950" 
            : "bg-gradient-to-br from-red-50 to-rose-50 border-red-200 text-red-950"
        }`}>
          <div className="absolute right-0 top-0 bottom-0 w-1/4 bg-[radial-gradient(circle_at_right,rgba(0,0,0,0.02),transparent)] rounded-r-2xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {submission.passed ? (
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-extrabold shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-extrabold shrink-0">
                    <XCircle className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Evaluation Result</h4>
                  <h1 className="text-2xl font-black tracking-tight">
                    {submission.passed ? "Certified Assessment Passed!" : "Passing Threshold Not Achieved"}
                  </h1>
                </div>
              </div>

              <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
                {submission.passed 
                  ? "Congratulations! You have demonstrated high mastery of full-stack structures. Your credentials have been locked in the local models.py database submission record."
                  : "You achieved a grade that is below the 80% passing threshold set by cognitiveclass.ai. We encourage you to review correct choices and retake assessment until you pass!"
                }
              </p>
              
              <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono font-medium">
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-500">
                  Attempt logged: {new Date(submission.submittedAt).toLocaleTimeString()}
                </span>
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-500">
                  Submission ID: {submission.id}
                </span>
              </div>
            </div>

            {/* Score circle widget */}
            <div className="text-center bg-white p-5 rounded-2xl border border-slate-150 shadow-sm shrink-0 flex flex-col justify-center items-center w-36 h-36">
              <span className={`text-3xl font-black font-mono leading-none ${submission.passed ? "text-green-600" : "text-red-500"}`}>
                {submission.score}%
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 mt-1.5 tracking-wider">Score Achieved</span>
              <div className="mt-2 text-slate-600 font-mono text-xs font-bold bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                {submission.scoreAchieved}/{submission.scoreTotal} pts
              </div>
            </div>
          </div>
        </div>

        {/* Diagnostic Actions Row */}
        <div className="flex flex-wrap gap-3">
          <button
            id="result-retake-btn"
            onClick={onRetake}
            className="px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold uppercase tracking-widest rounded-lg shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Retake Assessment
          </button>
          
          <button
            onClick={onBackToSyllabus}
            className="px-5 py-2.5 bg-white border-2 border-slate-250 text-slate-600 hover:text-slate-800 rounded-lg text-xs font-bold uppercase tracking-widest transition flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            Syllabus View
          </button>

          <button
            onClick={onViewDashboard}
            className="px-5 py-2.5 bg-white border-2 border-slate-250 text-slate-600 hover:text-slate-800 rounded-lg text-xs font-bold uppercase tracking-widest transition flex items-center gap-1.5 cursor-pointer ml-auto"
          >
            Dashboard
          </button>
        </div>


        {/* Display and Evaluate Question Breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Detailed Submission Breakdown & ORM trace
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Verify your choices. The assessment engine evaluates choices by matching user-submits with true database records.
            </p>
          </div>

          <div className="divide-y divide-slate-100 space-y-6">
            {questions.map((q, qIndex) => {
              const qChoices = choices.filter(c => c.questionId === q.id);
              const selectedChoiceId = submission.answers[q.id];
              const selectedChoiceObj = choices.find(c => c.id === selectedChoiceId);
              const correctChoiceObj = qChoices.find(c => c.isCorrect);
              const isCorrectAt = selectedChoiceObj?.isCorrect || false;

              return (
                <div key={q.id} className="pt-6 first:pt-0 space-y-4">
                  {/* Question header */}
                  <div className="flex items-start gap-4">
                    <span className={`w-6 h-6 rounded text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 font-mono ${
                      isCorrectAt ? "bg-green-100 text-green-700" : "bg-red-100 text-red-650"
                    }`}>
                      {qIndex + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{q.questionText}</h4>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded">
                          Allocation: {q.grade} grading weight
                        </span>
                        {isCorrectAt ? (
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-150 px-2 py-0.5 rounded">
                            Earned: {q.grade} pts
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-150 px-2 py-0.5 rounded">
                            Earned: 0 pts
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Choice summary feedback */}
                  <div className="pl-10 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {/* Left: Your Answer */}
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-150">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Your Submission Selection</span>
                        {selectedChoiceObj ? (
                          <div className="flex items-start gap-1.5 mt-1">
                            {isCorrectAt ? (
                              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            )}
                            <p className="font-medium text-slate-700">{selectedChoiceObj.choiceText}</p>
                          </div>
                        ) : (
                          <p className="text-slate-400 italic">No selection was submitted (Skipped)</p>
                        )}
                      </div>

                      {/* Right: Correct Answer feedback */}
                      <div className="p-3 bg-blue-50/30 rounded-lg border border-blue-100">
                        <span className="block text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1">Correct Choice Key</span>
                        {correctChoiceObj ? (
                          <p className="font-semibold text-slate-800 mt-1">{correctChoiceObj.choiceText}</p>
                        ) : (
                          <p className="text-yellow-600 italic">No correct choice matches in SQLite metadata.</p>
                        )}
                      </div>
                    </div>

                    {/* ORM debug trace block */}
                    <div className="p-3 bg-slate-900 text-slate-300 font-mono text-[10px] rounded-lg space-y-1.5 flex flex-col">
                      <div className="flex items-center justify-between text-blue-400 font-bold border-b border-slate-800 pb-1">
                        <span className="flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5" /> Django ORM Evaluation Trace
                        </span>
                        <span className="text-slate-500 select-none">SELECT Query executed</span>
                      </div>
                      <p className="text-gray-400 italic"># Running Python logic in submission view:</p>
                      <p>
                        <span className="text-pink-400">selected_choice</span> = Choice.objects.get(pk=<span className="text-emerald-400">"{selectedChoiceId || 'None'}"</span>)
                      </p>
                      <p>
                        <span className="text-blue-300">if</span> selected_choice.is_correct == <span className="text-amber-400">True</span>:
                      </p>
                      <p className="pl-4">
                        score_achieved += question.grade <span className="text-green-400">(+{isCorrectAt ? q.grade : 0} points)</span>
                      </p>
                      <p className="text-slate-500 italic mt-1 font-sans">
                        Verdict analysis: user submitted ID matches Choice reference with <code className="text-purple-300 font-mono">is_correct={String(isCorrectAt)}</code>
                      </p>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
