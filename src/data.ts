import { Course, Question, Choice } from "./types";

export const initialCourses: Course[] = [
  {
    id: "django-advanced",
    name: "Advanced Django Full-Stack Development",
    description: "Master Django models, migrations, views, and templates whilst building dynamic student assessment pipelines and fully functional custom admin dashboards.",
    category: "Full-Stack Development",
    difficulty: "Advanced",
    modulesCount: 6,
    durationMinutes: 180,
  },
  {
    id: "python-core",
    name: "Python Core & Object-Oriented Software Engineering",
    description: "Deep dive into dynamic Python development, reference count allocations, object-oriented custom classes, magic methods, list comprehensions, and generators.",
    category: "Python Engineering",
    difficulty: "Intermediate",
    modulesCount: 5,
    durationMinutes: 150,
  },
  {
    id: "sql-db",
    name: "SQL & Database Administration Principles",
    description: "Understand database architecture, structural constraint criteria, dynamic aggregations, recursive joining, indexing keys, and transaction commits in SQL.",
    category: "Database Systems",
    difficulty: "Beginner",
    modulesCount: 4,
    durationMinutes: 120,
  }
];

export const initialQuestions: Question[] = [
  // Django questions
  {
    id: "q1",
    courseId: "django-advanced",
    questionText: "Which of the following best describes the role of a 'Submission' model in our current full-stack Django architecture?",
    grade: 2
  },
  {
    id: "q2",
    courseId: "django-advanced",
    questionText: "How do you specify a many-to-one relationship from a Choice model to a Question model in Django?",
    grade: 1
  },
  {
    id: "q3",
    courseId: "django-advanced",
    questionText: "In a Django template or view, how can you fetch all choices associated with a specific question object named 'question'?",
    grade: 1
  },
  {
    id: "q4",
    courseId: "django-advanced",
    questionText: "What is the primary role of Django's database migrations?",
    grade: 1
  },
  {
    id: "q5",
    courseId: "django-advanced",
    questionText: "Which Django decorator is commonly used inside views to ensure that only authenticated students can submit an exam?",
    grade: 1
  },
  {
    id: "q6",
    courseId: "django-advanced",
    questionText: "When evaluating scores in an assessment view on the server, what is the best practice to validate choices?",
    grade: 2
  },
  {
    id: "q7",
    courseId: "django-advanced",
    questionText: "Which setting variable in Django's settings.py specifies database configurations like engine and file paths?",
    grade: 1
  },
  {
    id: "q8",
    courseId: "django-advanced",
    questionText: "If a Question model represents a single assessment element with a 'grade' integer property, how can you calculate total possible exam grade of a Course?",
    grade: 2
  },

  // Python questions
  {
    id: "q_py1",
    courseId: "python-core",
    questionText: "Which of the following is correct regarding memory management and garbage collection in Python (CPython)?",
    grade: 2
  },
  {
    id: "q_py2",
    courseId: "python-core",
    questionText: "How do you define a constant-like module variable, or represent a private attribute name conventionally in standard Python classes?",
    grade: 1
  },
  {
    id: "q_py3",
    courseId: "python-core",
    questionText: "Which of the following is a built-in exception in Python that is raised when trying to access a local variable before it has been assigned a value?",
    grade: 1
  },
  {
    id: "q_py4",
    courseId: "python-core",
    questionText: "What is the primary memory and execution difference between Python generators and custom list comprehensions?",
    grade: 2
  },

  // SQL questions
  {
    id: "q_sq1",
    courseId: "sql-db",
    questionText: "Which SQL JOIN clause returns all matching rows from both tables, plus unmatched rows from the left-side table with NULL for right-side attributes?",
    grade: 1
  },
  {
    id: "q_sq2",
    courseId: "sql-db",
    questionText: "What is the purpose of using a Database Transaction with COMMIT and ROLLBACK command steps?",
    grade: 2
  },
  {
    id: "q_sq3",
    courseId: "sql-db",
    questionText: "In SQL, how can you compute the average grade score of submissions grouped by each distinct course identifier?",
    grade: 1
  },
  {
    id: "q_sq4",
    courseId: "sql-db",
    questionText: "Which SQL constraint prevents inserting any duplicate keys whilst allowing at most one NULL value in a column?",
    grade: 2
  }
];

export const initialChoices: Choice[] = [
  // q1 choices
  {
    id: "c1_1",
    questionId: "q1",
    choiceText: "It handles the primary CSS styling for the final exam results page.",
    isCorrect: false
  },
  {
    id: "c1_2",
    questionId: "q1",
    choiceText: "It stores the relationship between a user, their chosen choices, and the associated exam for evaluation.",
    isCorrect: true
  },
  {
    id: "c1_3",
    questionId: "q1",
    choiceText: "It is a built-in Django middleware that automatically grades student work.",
    isCorrect: false
  },
  {
    id: "c1_4",
    questionId: "q1",
    choiceText: "It acts as a temporary cache for static images uploaded via the admin panel.",
    isCorrect: false
  },

  // q2 choices
  {
    id: "c2_1",
    questionId: "q2",
    choiceText: "Using models.ManyToManyField(Question)",
    isCorrect: false
  },
  {
    id: "c2_2",
    questionId: "q2",
    choiceText: "Using models.ForeignKey(Question, on_delete=models.CASCADE)",
    isCorrect: true
  },
  {
    id: "c2_3",
    questionId: "q2",
    choiceText: "Using models.OneToOneField(Question)",
    isCorrect: false
  },
  {
    id: "c2_4",
    questionId: "q2",
    choiceText: "Using models.ChoicesField(Question)",
    isCorrect: false
  },

  // q3 choices
  {
    id: "c3_1",
    questionId: "q3",
    choiceText: "question.choice_set.all()",
    isCorrect: true
  },
  {
    id: "c3_2",
    questionId: "q3",
    choiceText: "Choice.objects.get(all=question)",
    isCorrect: false
  },
  {
    id: "c3_3",
    questionId: "q3",
    choiceText: "question.get_choices()",
    isCorrect: false
  },
  {
    id: "c3_4",
    questionId: "q3",
    choiceText: "Choice.filter(question_id=question)",
    isCorrect: false
  },

  // q4 choices
  {
    id: "c4_1",
    questionId: "q4",
    choiceText: "To seed initial mock data into your development server.",
    isCorrect: false
  },
  {
    id: "c4_2",
    questionId: "q4",
    choiceText: "To translate changes made to Python models into SQL statements and execute them against the database.",
    isCorrect: true
  },
  {
    id: "c4_3",
    questionId: "q4",
    choiceText: "To backup your production database to a secure cloud container.",
    isCorrect: false
  },
  {
    id: "c4_4",
    questionId: "q4",
    choiceText: "To optimize search query speed and indexes dynamically.",
    isCorrect: false
  },

  // q5 choices
  {
    id: "c5_1",
    questionId: "q5",
    choiceText: "The @auth_required decorator",
    isCorrect: false
  },
  {
    id: "c5_2",
    questionId: "q5",
    choiceText: "The @login_required decorator",
    isCorrect: true
  },
  {
    id: "c5_3",
    questionId: "q5",
    choiceText: "The @student_only decorator",
    isCorrect: false
  },
  {
    id: "c5_4",
    questionId: "q5",
    choiceText: "The @verify_signature decorator",
    isCorrect: false
  },

  // q6 choices
  {
    id: "c6_1",
    questionId: "q6",
    choiceText: "Using client-side cookies to compare user selections locally.",
    isCorrect: false
  },
  {
    id: "c6_2",
    questionId: "q6",
    choiceText: "Querying Choice models filtered by is_correct=True on the backend server to match with the submitted IDs.",
    isCorrect: true
  },
  {
    id: "c6_3",
    questionId: "q6",
    choiceText: "Exposing is_correct values in a JSON api that anyone can inspect.",
    isCorrect: false
  },
  {
    id: "c6_4",
    questionId: "q6",
    choiceText: "Relying on string matching to find options that contain the words 'true' or 'correct'.",
    isCorrect: false
  },

  // q7 choices
  {
    id: "c7_1",
    questionId: "q7",
    choiceText: "DATABASE_CREDENTIALS",
    isCorrect: false
  },
  {
    id: "c7_2",
    questionId: "q7",
    choiceText: "DATABASES",
    isCorrect: true
  },
  {
    id: "c7_3",
    questionId: "q7",
    choiceText: "SQL_ENGINE",
    isCorrect: false
  },
  {
    id: "c7_4",
    questionId: "q7",
    choiceText: "DB_CONNECTIONS",
    isCorrect: false
  },

  // q8 choices
  {
    id: "c8_1",
    questionId: "q8",
    choiceText: "Iterating elements in frontend DOM with React custom wrappers.",
    isCorrect: false
  },
  {
    id: "c8_2",
    questionId: "q8",
    choiceText: "Using Course.objects.filter(id=course_id).aggregate(Sum('question__grade')) or related ORM aggregate queries.",
    isCorrect: true
  },
  {
    id: "c8_3",
    questionId: "q8",
    choiceText: "Multiplying grade factor by 10 dynamically in a hardcoded database trigger.",
    isCorrect: false
  },
  {
    id: "c8_4",
    questionId: "q8",
    choiceText: "Applying Python list length counters over unrelated tables.",
    isCorrect: false
  },

  // Python sub answers
  {
    id: "c_py1_1",
    questionId: "q_py1",
    choiceText: "Python does not employ reference counting, relying strictly on mark-and-sweep cycles once every 10 seconds.",
    isCorrect: false
  },
  {
    id: "c_py1_2",
    questionId: "q_py1",
    choiceText: "Python manages memory mainly through reference counting paired with a generational cyclic garbage collector for detecting reference cycles.",
    isCorrect: true
  },
  {
    id: "c_py1_3",
    questionId: "q_py1",
    choiceText: "Python transfers all object garbage-disposal logic directly to the operating system kernel's native free() calls instantly.",
    isCorrect: false
  },
  {
    id: "c_py1_4",
    questionId: "q_py1",
    choiceText: "CPython disables memory re-allocation entirely, enforcing instance attributes to reside on a local thread stack.",
    isCorrect: false
  },

  {
    id: "c_py2_1",
    questionId: "q_py2",
    choiceText: "Naming the attribute with a double leading underscore (e.g., '__secret') to trigger name mangling, and keeping constant conventions in uppercase (e.g., 'LIMIT').",
    isCorrect: true
  },
  {
    id: "c_py2_2",
    questionId: "q_py2",
    choiceText: "Prefixing with C++-styled 'const static' syntax patterns inside of a nested function block.",
    isCorrect: false
  },
  {
    id: "c_py2_3",
    questionId: "q_py2",
    choiceText: "Using immutable annotations dynamically evaluated inside bytecode containers.",
    isCorrect: false
  },
  {
    id: "c_py2_4",
    questionId: "q_py2",
    choiceText: "Declaring variables using a local JS-like 'const var' keyword combination.",
    isCorrect: false
  },

  {
    id: "c_py3_1",
    questionId: "q_py3",
    choiceText: "NullReferenceError",
    isCorrect: false
  },
  {
    id: "c_py3_2",
    questionId: "q_py3",
    choiceText: "UnboundLocalError",
    isCorrect: true
  },
  {
    id: "c_py3_3",
    questionId: "q_py3",
    choiceText: "IndexError",
    isCorrect: false
  },
  {
    id: "c_py3_4",
    questionId: "q_py3",
    choiceText: "AttributeError",
    isCorrect: false
  },

  {
    id: "c_py4_1",
    questionId: "q_py4",
    choiceText: "Generators can only handle string outputs while list comprehensions can output multi-dimensional dictionary structures.",
    isCorrect: false
  },
  {
    id: "c_py4_2",
    questionId: "q_py4",
    choiceText: "List comprehensions compute and hold all elements in memory instantly as a list, whereas generators utilize lazy evaluation returning an iterator to yield elements on-demand.",
    isCorrect: true
  },
  {
    id: "c_py4_3",
    questionId: "q_py4",
    choiceText: "Generators do not support iter expressions while list comprehensions are optimized thread-safe parallel wrappers.",
    isCorrect: false
  },
  {
    id: "c_py4_4",
    questionId: "q_py4",
    choiceText: "There is no difference in memory footprints between list comprehensions and generators after compiler output compilation.",
    isCorrect: false
  },

  // SQL sub answers
  {
    id: "c_sq1_1",
    questionId: "q_sq1",
    choiceText: "FULL OUTER JOIN",
    isCorrect: false
  },
  {
    id: "c_sq1_2",
    questionId: "q_sq1",
    choiceText: "LEFT JOIN (or LEFT OUTER JOIN)",
    isCorrect: true
  },
  {
    id: "c_sq1_3",
    questionId: "q_sq1",
    choiceText: "RIGHT JOIN",
    isCorrect: false
  },
  {
    id: "c_sq1_4",
    questionId: "q_sq1",
    choiceText: "INNER JOIN",
    isCorrect: false
  },

  {
    id: "c_sq2_1",
    questionId: "q_sq2",
    choiceText: "To bypass key verification indexes for fast data operations.",
    isCorrect: false
  },
  {
    id: "c_sq2_2",
    questionId: "q_sq2",
    choiceText: "To enforce ACID properties by committing logical groups of database changes atomically or discarding them on error.",
    isCorrect: true
  },
  {
    id: "c_sq2_3",
    questionId: "q_sq2",
    choiceText: "To encrypt plain-text column fields under SSL layer handshakes.",
    isCorrect: false
  },
  {
    id: "c_sq2_4",
    questionId: "q_sq2",
    choiceText: "To automatically resolve deadlocks inside a multithreaded network driver.",
    isCorrect: false
  },

  {
    id: "c_sq3_1",
    questionId: "q_sq3",
    choiceText: "SELECT AVG(score) FROM submissions GROUP BY course_id;",
    isCorrect: true
  },
  {
    id: "c_sq3_2",
    questionId: "q_sq3",
    choiceText: "SELECT SUM(score) / COUNT(*) FROM submissions ORDER BY course_id;",
    isCorrect: false
  },
  {
    id: "c_sq3_3",
    questionId: "q_sq3",
    choiceText: "SELECT DISTINCT AVG(score) OVER course_id FROM submissions;",
    isCorrect: false
  },
  {
    id: "c_sq3_4",
    questionId: "q_sq3",
    choiceText: "SELECT course_id, MEDIAN(score) FROM submissions WHERE score = 80;",
    isCorrect: false
  },

  {
    id: "c_sq4_1",
    questionId: "q_sq4",
    choiceText: "PRIMARY KEY",
    isCorrect: false
  },
  {
    id: "c_sq4_2",
    questionId: "q_sq4",
    choiceText: "UNIQUE",
    isCorrect: true
  },
  {
    id: "c_sq4_3",
    questionId: "q_sq4",
    choiceText: "NOT NULL",
    isCorrect: false
  },
  {
    id: "c_sq4_4",
    questionId: "q_sq4",
    choiceText: "FOREIGN KEY",
    isCorrect: false
  }
];
