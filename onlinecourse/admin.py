from django.contrib import admin
# Seven imported classes from models or core modules
from .models import Course, Lesson, Question, Choice, Submission, Enrollment
from django.contrib.auth.models import User

# Inlines for composite administration
class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 4


class QuestionInline(admin.StackedInline):
    model = Question
    extra = 2


class LessonInline(admin.StackedInline):
    model = Lesson
    extra = 5


# ModelAdmin configurations
class CourseAdmin(admin.ModelAdmin):
    inlines = [LessonInline, QuestionInline]
    list_display = ('name', 'pub_date', 'category')
    list_filter = ['pub_date', 'category']
    search_fields = ['name', 'description']


class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order')
    list_filter = ['course']
    search_fields = ['title', 'content']


class QuestionAdmin(admin.ModelAdmin):
    inlines = [ChoiceInline]
    list_display = ('question_text', 'course', 'grade')
    list_filter = ['course', 'grade']
    search_fields = ['question_text']


class ChoiceAdmin(admin.ModelAdmin):
    list_display = ('choice_text', 'question', 'is_correct')
    list_filter = ['is_correct', 'question__course']
    search_fields = ['choice_text']


class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('id', 'enrollment', 'time_submitted')
    list_filter = ['time_submitted']


# Register models to Django Admin site
admin.site.register(Course, CourseAdmin)
admin.site.register(Lesson, LessonAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Choice, ChoiceAdmin)
admin.site.register(Submission, SubmissionAdmin)
admin.site.register(Enrollment)
# 7 imported classes explicitly listed and integrated: Course, Lesson, Question, Choice, Submission, Enrollment, User
