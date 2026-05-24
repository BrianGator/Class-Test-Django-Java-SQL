from django.urls import path
from . import views

app_name = 'onlinecourse'

urlpatterns = [
    # Core course details page
    path('course/<int:course_id>/', views.course_details, name='course_details'),
    
    # Task 6: View paths directing submission payload evaluations
    path('<int:course_id>/submit/', views.submit, name='submit'),
    path('course/<int:course_id>/submit/', views.submit, name='submit_course'), # support alias
    
    # Task 6: View paths rendering diagnostic reports and passing scores
    path('course/<int:course_id>/submission/<int:submission_id>/result/', views.show_exam_result, name='show_exam_result'),
]
