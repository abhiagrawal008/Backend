# exp15
Experiment 15: Django To-Do application with SQLite

- [Open experiment report](REPORT.md)
- Project: [django_todo_app/](django_todo_app/)
- Settings and routes: [todo_project/settings.py](django_todo_app/todo_project/settings.py), [todo_project/urls.py](django_todo_app/todo_project/urls.py)
- App: [todo/models.py](django_todo_app/todo/models.py), [todo/views.py](django_todo_app/todo/views.py), [todo/urls.py](django_todo_app/todo/urls.py), [todo/admin.py](django_todo_app/todo/admin.py)
- Templates: [todo/templates/todo/](django_todo_app/todo/templates/todo/)

## Setup (first time only)

```bash
cd django_todo_app
python3 -m venv venv
source venv/bin/activate
pip install django
python manage.py migrate
python manage.py createsuperuser
```

`venv/` and `db.sqlite3` are not committed, so run these after a fresh clone.

## How to run

```bash
cd django_todo_app
source venv/bin/activate
python manage.py runserver          # http://127.0.0.1:8000/
```

| URL | What it does |
|-----|--------------|
| `/` | List all tasks, newest first |
| `/add/` | Form to add a task (POST) |
| `/toggle/<id>/` | Mark a task completed / not completed |
| `/delete/<id>/` | Delete a task |
| `/admin/` | Django admin (log in with the superuser) |

## Lecture 27 — Django Middleware and URL Routing

[student_system/](student_system/) follows the Lecture 27 notes: a `student_system` project with a `students` app.

- [students/middleware.py](student_system/students/middleware.py) — `SimpleLoggingMiddleware` prints the method, path, status code and time taken for every request
- [student_system/settings.py](student_system/student_system/settings.py) — middleware registered at the top of `MIDDLEWARE`
- [students/urls.py](student_system/students/urls.py), [students/views.py](student_system/students/views.py) — `/api/students/` and `/api/students/<int:student_id>/` return JSON
- [student_system/urls.py](student_system/student_system/urls.py) — includes the app routes under `api/students/`

```bash
cd student_system
python3 -m venv venv
source venv/bin/activate
pip install django
python manage.py runserver          # http://127.0.0.1:8000/api/students/
```

| Request | Response | Terminal |
|---------|----------|----------|
| `GET /api/students/` | `200` `{"students": [], "message": "Student list endpoint"}` | `Request: GET /api/students/` · `Response: 200` · `Time taken: …ms` |
| `GET /api/students/42/` | `200` `{"student_id": 42, "message": "Student detail endpoint"}` | `Request: GET /api/students/42/` · `Response: 200` · `Time taken: …ms` |

Routing error (PBL): changing `<int:student_id>` to `<int:id>` in `students/urls.py` gives `500` with `TypeError: student_detail() got an unexpected keyword argument 'id'`, because the route parameter no longer matches the view argument. Changing it back fixes it.

