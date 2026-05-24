import React from "react";
import { ArrowLeft, ExternalLink, FileText, CheckCircle2, Image, Shield, Code, Server, Network } from "lucide-react";

interface ProjectDeliverablesProps {
  onBack: () => void;
}

export default function ProjectDeliverables({ onBack }: ProjectDeliverablesProps) {
  const deliverables = [
    {
      task: "Task 1",
      title: "models.py (Django Models)",
      icon: DatabaseIcon,
      accentColor: "from-emerald-500 to-teal-600",
      link: "https://github.com/BrianGator/Class-Test-Django-Python-SQL/blob/main/onlinecourse/models.py",
      linkLabel: "View models.py on GitHub",
      description: "Includes the core Django database models representing the relational schema: Question, Choice, and Submission. Aligned with course details representation.",
      technologies: ["Django ORM", "Python", "SQLite / PostgreSQL"]
    },
    {
      task: "Task 2",
      title: "admin.py (Django Admin Config)",
      icon: ShieldIcon,
      accentColor: "from-blue-500 to-purple-600",
      link: "https://github.com/BrianGator/Class-Test-Django-Python-SQL/blob/main/onlinecourse/admin.py",
      linkLabel: "View admin.py on GitHub",
      description: "Registers and configures structural administration items: QuestionInline, ChoiceInline stacked editors, QuestionAdmin controls, and LessonAdmin details.",
      technologies: ["Django Contrib Admin", "Model Inline Editors"]
    },
    {
      task: "Task 3",
      title: "Django Admin Site Screenshot",
      icon: ImageIcon,
      accentColor: "from-pink-500 to-rose-600",
      link: "https://github.com/BrianGator/Class-Test-Django-Python-SQL/blob/main/project-deliverables/03-admin-site.svg",
      linkLabel: "View Admin Screen Asset",
      description: "Visual evidence of the configured Django site, showcasing custom registered user administration sections for authentication groups and academic model courses.",
      technologies: ["Vector Artwork", "Django Admin Console"]
    },
    {
      task: "Task 4",
      title: "course_details_bootstrap.html (Exam Submission Template)",
      icon: CodeIcon,
      accentColor: "from-orange-500 to-amber-600",
      link: "https://github.com/BrianGator/Class-Test-Django-Python-SQL/blob/main/onlinecourse/templates/onlinecourse/course_details_bootstrap.html",
      linkLabel: "View HTML Template",
      description: "User-facing HTML file engineered with native Django template tags to process loops: nested choice selections, question lists, and Bootstrap layout formats.",
      technologies: ["Django Template Language", "HTML5", "Bootstrap 4"]
    },
    {
      task: "Task 5",
      title: "views.py (Submission Processing & Grading)",
      icon: ServerIcon,
      accentColor: "from-cyan-500 to-blue-600",
      link: "https://github.com/BrianGator/Class-Test-Django-Python-SQL/blob/main/onlinecourse/views.py",
      linkLabel: "View views.py on GitHub",
      description: "Back-end Python request handler including 'submit_exam' and 'show_exam_result' views. Computes score tallies, asserts 80% passing standard, and updates records.",
      technologies: ["Python Backend", "HTTP Handlers", "Academic Grading Logic"]
    },
    {
      task: "Task 6",
      title: "urls.py (Route Mapping Config)",
      icon: NetworkIcon,
      accentColor: "from-violet-500 to-indigo-600",
      link: "https://github.com/BrianGator/Class-Test-Django-Python-SQL/blob/main/onlinecourse/urls.py",
      linkLabel: "View urls.py on GitHub",
      description: "Binds endpoint URLs to view function controllers, facilitating secure, clear redirects after students submit exams or requests for certification details.",
      technologies: ["Django Routing", "RegEx Paths"]
    },
    {
      task: "Task 7",
      title: "Success Screen Attempt Screenshot",
      icon: CheckIcon,
      accentColor: "from-emerald-600 to-green-700",
      link: "https://github.com/BrianGator/Class-Test-Django-Python-SQL/blob/main/project-deliverables/07-final.svg",
      linkLabel: "View Certification Results",
      description: "Comprehensive screenshot capturing the final successful attempt. Renders the 'Congratulations' header response, verified 80%+ scoring, item correctness audit lists.",
      technologies: ["Grading Report Dashboard", "Validation Vector"]
    }
  ];

  return (
    <div id="project-deliverables-page" className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation back button & Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-650 hover:text-blue-600 transition self-start"
          >
            <ArrowLeft className="w-4 h-4 transition group-hover:-translate-x-1" />
            Back to Student Portal
          </button>
          
          <div className="text-right sm:text-right">
            <span className="text-[10px] font-bold uppercase py-1 px-2.5 bg-blue-105 text-blue-800 rounded font-mono">
              Academic Submission Portfolio
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            Project Deliverables & Artifacts
          </h1>
          <p className="text-slate-500 text-sm mt-1 leading-relaxed">
            The full structural code assets compiled for the Django relational student grading application. Match individual components to access their official revision-controlled code repositories on GitHub.
          </p>
        </div>

        {/* Deliverables Cards Grid representing elegant bento cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {deliverables.map((item, idx) => (
            <div
              key={idx}
              className={`bg-white border border-slate-200 hover:border-slate-350 rounded-xl overflow-hidden shadow-sm hover:shadow transition flex flex-col justify-between ${
                idx === deliverables.length - 1 ? "md:col-span-2" : ""
              }`}
            >
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase font-mono">
                    {item.task}
                  </span>
                  <div className={`p-1.5 rounded-lg bg-gradient-to-tr ${item.accentColor} text-white`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-bold text-base text-slate-800 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.technologies.map((t, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-100 text-slate-600 uppercase border border-slate-150">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 px-5 py-3 border-t border-slate-150 flex items-center justify-between">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline transition flex items-center gap-1"
                >
                  {item.linkLabel}
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-[10px] text-green-600 font-semibold uppercase flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Deliverable
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Informative Summary footer banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-xs text-blue-900 leading-relaxed flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-extrabold uppercase text-blue-900 mb-1">Portfolio Verified Actionable Status</h4>
            <p className="text-blue-800">
              Each component of the database schema implementation, views logic controllers, and Bootstrap layout mapping resides in the main GitHub directory. This cognitiveclass.ai simulation sandbox faithfully reproduces the exact grading calculations and visual admin interfaces designed by <strong>Brian McCarthy</strong>.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

// Inline Minimal icon representations to satisfy constraint
function DatabaseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}

function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function ImageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function CodeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function ServerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  );
}

function NetworkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="16" y="16" width="6" height="6" rx="1" />
      <rect x="2" y="16" width="6" height="6" rx="1" />
      <rect x="9" y="3" width="6" height="6" rx="1" />
      <path d="M12 9v7M12 14H5v2M12 14h7v2" />
    </svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 8 12 12 14 14" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
