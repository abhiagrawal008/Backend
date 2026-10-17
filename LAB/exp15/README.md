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
