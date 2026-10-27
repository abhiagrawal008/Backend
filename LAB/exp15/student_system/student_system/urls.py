from django.urls import include, path

urlpatterns = [
    path("api/students/", include("students.urls")),
]
