from django.http import JsonResponse

def student_list(request):
    return JsonResponse({
        "students": [],
        "message": "Student list endpoint",
    })

def student_detail(request, student_id):
    return JsonResponse({
        "student_id": student_id,
        "message": "Student detail endpoint",
    })
