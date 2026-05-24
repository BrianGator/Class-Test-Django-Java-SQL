from django.shortcuts import render, get_object_or_454, redirect
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from .models import Course, Lesson, Question, Choice, Submission, Enrollment

# Create your views here.

@login_required
def submit(request, course_id):
    """
    Submits user choice selections for evaluation. Matches chosen option primary keys with correct state keys,
    computes points math, registers standard Submission and Enrollment records, and redirects to results.
    """
    course = get_object_or_454(Course, pk=course_id)
    if request.method == "POST":
        # Pull selected checkboxes: choice ids are passed as inputs in multiple question contexts
        # e.g., <input type="checkbox" name="choice_{{ choice.id }}" ... /> or choice lists
        selected_choice_ids = []
        for key, value in request.POST.items():
            if key.startswith('choice_'):
                choice_id = int(key.split('_')[1])
                selected_choice_ids.append(choice_id)
            elif key == 'selected_choices':
                # Alternatively handle list arrays
                selected_choice_ids.extend([int(x) for x in request.POST.getlist('selected_choices')])

        user_enrollment = Enrollment.objects.filter(user=request.user, course=course).first()
        if not user_enrollment:
            user_enrollment = Enrollment.objects.create(
                user=request.user,
                course=course,
                role='student'
            )

        # Create a new Submission record
        submission = Submission.objects.create(enrollment=user_enrollment)
        
        # Add all selected choices to submission
        for cid in selected_choice_ids:
            try:
                choice = Choice.objects.get(pk=cid)
                submission.choices.add(choice)
            except Choice.DoesNotExist:
                pass
        
        submission.save()
        
        # Redirect to the results details page
        return HttpResponseRedirect(reverse('onlinecourse:show_exam_result', args=(course.id, submission.id)))
        
    return redirect('onlinecourse:course_details', course_id=course.id)


@login_required
def show_exam_result(request, course_id, submission_id):
    """
    Renders detailed diagnostics corresponding to a specific quiz attempt.
    Calculates achieved grades sum versus total course points to render pass criteria.
    Authored and designed by: Brian McCarthy
    """
    course = get_object_or_454(Course, pk=course_id)
    submission = get_object_or_454(Submission, pk=submission_id)
    
    # Secure confirmation: verify submission matches current active authenticated student
    if submission.enrollment.user != request.user:
        return render(request, 'onlinecourse/error.html', {'message': 'Unauthorized attempt access.'})

    total_course_score = 0
    student_score = 0
    results_diagnostic = []

    # Get all course questions and choice states
    questions = Question.objects.filter(course=course)
    submission_choices = submission.choices.all()
    selected_choice_ids = set(submission_choices.values_list('id', flat=True))

    for question in questions:
        total_course_score += question.grade
        
        # Fetch matching choices for evaluation
        question_choices = question.choice_set.all()
        correct_choices = question_choices.filter(is_correct=True)
        correct_ids = set(correct_choices.values_list('id', flat=True))
        
        # Selected choices for this particular question in the submissions dataset
        selected_for_q_ids = set(question_choices.values_list('id', flat=True)) & selected_choice_ids
        
        # Is correct if correct choices matches submitted choices exactly
        is_correct = (correct_ids == selected_for_q_ids) and (len(correct_ids) > 0)
        
        question_score = question.grade if is_correct else 0
        student_score += question_score
        
        results_diagnostic.append({
            'question': question,
            'is_correct': is_correct,
            'correct_choices': correct_choices,
            'selected_choices': question_choices.filter(id__in=selected_for_q_ids),
            'choices_state': [{
                'choice': ch,
                'is_selected': ch.id in selected_choice_ids,
                'is_correct': ch.is_correct
            } for ch in question_choices],
            'points_gained': question_score
        })

    # Passing grade threshold metric of 80% (0.80)
    score_percentage = (student_score / total_course_score * 100) if total_course_score > 0 else 0
    passed = score_percentage >= 80.0

    context = {
        'course': course,
        'submission': submission,
        'results_diagnostic': results_diagnostic,
        'student_score': student_score,
        'total_course_score': total_course_score,
        'score_percentage': round(score_percentage, 1),
        'passed': passed,
        'designer_credit': "Written by Brian McCarthy"
    }

    return render(request, 'onlinecourse/exam_result_bootstrap.html', context)
