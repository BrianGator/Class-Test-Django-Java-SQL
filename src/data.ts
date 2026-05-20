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
    id: "python-basics",
    name: "Introduction to Python Programming",
    description: "Launch your developer journey with basic structures, functional modularity, error catching, and object-oriented syntax paradigms in Python.",
    category: "Software Engineering",
    difficulty: "Beginner",
    modulesCount: 4,
    durationMinutes: 120,
  },
  {
    id: "data-science-intro",
    name: "Data Science Tools & Methodology",
    description: "Understand the core iterative workflows of data exploration, visual pipelines, statistical regressions, and cloud deployment engines.",
    category: "Data Science",
    difficulty: "Intermediate",
    modulesCount: 5,
    durationMinutes: 150,
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
    courseId: "python-basics",
    questionText: "Which keyword is used to define functions in Python?",
    grade: 1
  },
  {
    id: "q_py2",
    courseId: "python-basics",
    questionText: "What is the output of len({'apple', 'banana', 'apple'}) inside Python?",
    grade: 1
  },

  // Data Science questions
  {
    id: "q_ds1",
    courseId: "data-science-intro",
    questionText: "Which Python package is primary choice for grid manipulation and multidimensional array equations?",
    grade: 1
  },
  {
    id: "q_ds2",
    courseId: "data-science-intro",
    questionText: "What is the primary goal of regression models in statistical data science?",
    grade: 1
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

  // Python basics
  {
    id: "c_py1_1",
    questionId: "q_py1",
    choiceText: "func",
    isCorrect: false
  },
  {
    id: "c_py1_2",
    questionId: "q_py1",
    choiceText: "def",
    isCorrect: true
  },
  {
    id: "c_py1_3",
    questionId: "q_py1",
    choiceText: "define",
    isCorrect: false
  },
  {
    id: "c_py1_4",
    questionId: "q_py1",
    choiceText: "fn",
    isCorrect: false
  },

  {
    id: "c_py2_1",
    questionId: "q_py2",
    choiceText: "3",
    isCorrect: false
  },
  {
    id: "c_py2_2",
    questionId: "q_py2",
    choiceText: "2 (since sets disallow duplicates)",
    isCorrect: true
  },
  {
    id: "c_py2_3",
    questionId: "q_py2",
    choiceText: "1",
    isCorrect: false
  },
  {
    id: "c_py2_4",
    questionId: "q_py2",
    choiceText: "SyntaxError",
    isCorrect: false
  },

  // Data Science
  {
    id: "c_ds1_1",
    questionId: "q_ds1",
    choiceText: "Numpy",
    isCorrect: true
  },
  {
    id: "c_ds1_2",
    questionId: "q_ds1",
    choiceText: "Requests",
    isCorrect: false
  },
  {
    id: "c_ds1_3",
    questionId: "q_ds1",
    choiceText: "Django",
    isCorrect: false
  },
  {
    id: "c_ds1_4",
    questionId: "q_ds1",
    choiceText: "BeautifulSoup",
    isCorrect: false
  },

  {
    id: "c_ds2_1",
    questionId: "q_ds2",
    choiceText: "Group data elements into clusters based on geometric proximity.",
    isCorrect: false
  },
  {
    id: "c_ds2_2",
    questionId: "q_ds2",
    choiceText: "Predict a continuous numerical outcome based on historical input data correlation.",
    isCorrect: true
  },
  {
    id: "c_ds2_3",
    questionId: "q_ds2",
    choiceText: "Convert tabular matrix strings to markdown table layouts dynamically.",
    isCorrect: false
  },
  {
    id: "c_ds2_4",
    questionId: "q_ds2",
    choiceText: "Examine static image contrast parameters inside neural vectors.",
    isCorrect: false
  }
];
