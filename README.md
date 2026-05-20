# Technical Specifications Guide: Class-Test-Django-Python-SQL

Interactive Class Assessment Portal implementing robust educational testing mechanics modeled around concepts of **Django Full-Stack Development**, **Python Platform Engineering**, and **SQL Relational Databases**.

Designed and Authored by: **Brian McCarthy**

---

## 🚀 Languages Used

This portal models and simulates multiple backend language mechanics using standard safe web standards:
1. **TypeScript (TSX):** Full client-side application architecture, strict interface typing, state management, and real-time grading logic.
2. **Python:** Core language principles (reference counting, cyclic GC, custom class representations, name mangling with double leading underscores, unbound local errors, generators, list comprehensions), plus Python Django model schemas (`models.py`) and standard view handler controllers (`views.py`) rendered inside the simulation blueprints tabs.
3. **HTML5 & CSS3:** Structural rendering with semantic HTML elements and responsive responsive visual skins utilizing Tailwind utility engines.
4. **SQL:** Course questions and answer options targeting relational normalization rules (1NF/2NF/3NF), unique constraints, transactional properties, joins, and dynamic grouping.

---

## 🛠️ Technologies & Frameworks

- **Core Library:** React 18+ (Functional Components, Custom hooks, and state context binders).
- **Core Bundler:** Vite (Highly optimized module compiler & fast development pipeline).
- **Styling System:** Tailwind CSS (Modern, high-visibility layout structure).
- **Icon Set:** Lucide React icons (Consistent graphical accents across states).
- **Local Persistence:** LocalStorage API (Holds mock tables so changes to courses, questions, choices, and score attempts remain entirely safe across browser refreshes).

---

## 📂 Structural Files

- **`/index.html`**
  Primary bootstrap element referencing the compiled main entry script, featuring the project title: `Class-Test-Django-Python-SQL`.
- **`/src/types.ts`**
  Strict TypeScript typing interfaces for `Course`, `Question`, `Choice`, and `ExamSubmission` models.
- **`/src/data.ts`**
  Base database seed elements including seed courses, questions, and matching choices representing Python, Django, and SQL questions.
- **`/src/App.tsx`**
  Primary application router and central execution model. Coordinates data cascades, cascades deletion constraints, implements Django database reset controls, and evaluates final grading sums.
- **`/src/components/Dashboard.tsx`**
  The entry student visual dashboard, utilizing bento metrics, dynamic attempt tracking widgets, and visual tags for each course category.
- **`/src/components/CourseDetails.tsx`**
  Comprehensive study guide detailing module durations, grade criteria, full exam syllabus previews, attempt records, and retake controls.
- **`/src/components/DjangoAdmin.tsx`**
  Simulates a robust relational administration panel. Active tabs enable full CRUD operations for database course objects, foreign keys, and matching choices, with additional real Python blueprints.
- **`/src/components/ExamWorkspace.tsx`**
  Implements the testing environment. Features countdown clocks, interactive side navigation grids, "Mark for Review" flags, and final validation alert modals.
- **`/src/components/ExamResult.tsx`**
  Presents dynamic metric indicators. Renders pass/fail verdicts, points math, answer diagnostic breakdowns, and live Django ORM trace evaluation loops.

---

## 📖 How to Use

1. **Browse Courses:** Select from the course catalog cards highlighting Django, Python, or SQL.
2. **Review Syllabus:** Inspect the specific questions, credits weights, and module counts in the syllabus study views.
3. **Take Assessments:** Click the **Start Assessment** button to render the workspaces. Submit choices, bookmark items for review via flags, or monitor time.
4. **View Diagnostics:** Review your submitted answers side-by-side with database correct keys. Analyze the simulated **Django ORM traces** displaying the exact server query logic.
5. **Use Django Admin Simulator:** Navigate to the **Django Admin** tab inside the top navbar. Dynamically add, modify, or delete course entries, assessment questions, and choices, or view the corresponding Python source codes.
6. **Reset Schema:** Click the **Reset DB Seed** inside the Admin panel to flush changes and revert back to standard seeds.

---

## ⚡ Key Functions

- **Lazy Local DB Persistence:** Automates active state saves to the browser's disk caches.
- **ForeignKey Cascade Constraints:** Automatically deletes associated child questions and choices when their parent entity is dropped.
- **Review Booking Flag System:** Updates side navigators with custom indices for review and tracking.
- **ORM Trace Simulation Engine:** Demystifies server-side actions by outputting formatted Python code blocks showing matching `Choice.objects.get()` lookups.

---

## 🎯 Requirements

- **Browser Compatibilities:** Modern web browser supporting ES6 Modules, flex/grid layouts, and LocalStorage.
- **System Constraints:** Active JavaScript enabled.
- **Screen Ratios:** Built with adaptive grid offsets to support standard desktop displays, intermediate workspace frames, and touch devices.

---
*Created and verified by Brian McCarthy. All rights reserved.*
