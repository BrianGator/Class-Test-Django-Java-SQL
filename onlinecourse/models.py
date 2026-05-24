import sys
from django.db import models
from django.utils.timezone import now
from django.conf import settings

# Create your models here.

class Course(models.Model):
    name = models.CharField(null=False, max_length=150, default="new course")
    image = models.ImageField(upload_to='course_images/', null=True, blank=True)
    category = models.CharField(max_length=80, default="General")
    description = models.TextField(max_length=1000)
    pub_date = models.DateField(null=True)
    is_enrolled = models.BooleanField(default=False)

    def __str__(self):
        return f"Course: {self.name} | Category: {self.category}"


class Lesson(models.Model):
    title = models.CharField(max_length=200, default="title")
    order = models.IntegerField(default=0)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    content = models.TextField()

    def __str__(self):
        return f"{self.title} (Lesson {self.order} for {self.course.name})"


class Question(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    question_text = models.TextField()
    grade = models.IntegerField(default=1)

    def is_get_score(self, selected_ids):
        # Determine if the list of selected choice IDs perfectly match the correct options
        all_choices = self.choice_set.all()
        correct_choices = all_choices.filter(is_correct=True)
        correct_ids = set(correct_choices.values_list('id', flat=True))
        
        # Selected IDs must match correct choices exactly
        selected_set = set(selected_ids)
        if correct_ids == selected_set:
            return True
        return False

    def __str__(self):
        return f"Question: {self.question_text[:60]}... (Grade: {self.grade})"


class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_text = models.TextField()
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"Choice: {self.choice_text[:40]} | Correct: {self.is_correct}"


class Submission(models.Model):
    enrollment = models.ForeignKey('Enrollment', on_delete=models.CASCADE, null=True, blank=True)
    choices = models.ManyToManyField(Choice)
    time_submitted = models.DateTimeField(default=now)

    def __str__(self):
        return f"Submission by {self.enrollment} at {self.time_submitted}"


class Enrollment(models.Model):
    AUDIENCE = [
        ('student', 'Student'),
        ('teacher', 'Teacher'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    date_enrolled = models.DateField(default=now)
    role = models.CharField(max_length=15, choices=AUDIENCE, default='student')
    rating = models.IntegerField(default=5)

    def __str__(self):
        return f"{self.user.username} enrolled in {self.course.name}"
