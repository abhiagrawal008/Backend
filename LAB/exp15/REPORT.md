# Experiment 15 Report

## Objective

Install Django, set up a project, and build a simple To-Do application with SQLite that supports Create, Read, Update and Delete (CRUD).

## Work Completed

1. Created the folder `django_todo_app`, a virtual environment with `python -m venv venv`, and installed Django with `pip install django` (`python -m django --version` → `6.1.2`).
2. Created the project in the current folder with `django-admin startproject todo_project .`, which generated `manage.py` and the `todo_project/` package (`settings.py`, `urls.py`, `wsgi.py`, `asgi.py`, `__init__.py`).
3. Created the app with `python manage.py startapp todo` and added `'todo'` to `INSTALLED_APPS` in `settings.py`.
4. Defined the `Task` model in `todo/models.py` with `title` (`CharField`, max 200), `completed` (`BooleanField`, default `False`) and `created_at` (`DateTimeField`, `auto_now_add`).
5. Ran `python manage.py makemigrations todo`, which created `todo/migrations/0001_initial.py`, then `python manage.py migrate`, which created the tables in `db.sqlite3`.
6. Created an admin account with `python manage.py createsuperuser` and registered `Task` in `todo/admin.py`.
7. Wrote the views `task_list`, `add_task`, `toggle_task` and `delete_task` in `todo/views.py`.
8. Added the app routes in `todo/urls.py` and included them from `todo_project/urls.py` with `path('', include('todo.urls'))`.
9. Created the templates `todo/templates/todo/task_list.html` and `add_task.html`. The add form includes `{% csrf_token %}`.
10. Started the server with `python manage.py runserver`.

### Results observed

```
$ python manage.py check
System check identified no issues (0 silenced).

$ python manage.py showmigrations todo
todo
 [X] 0001_initial
```

| Operation | Action | Result |
|-----------|--------|--------|
| Read | Open `/` with no tasks | `200`, "No tasks yet." |
| Create | Add "Finish Experiment 15" | `POST /add/ 302`, task shown in the list |
| Create | Add "Write the lab report" | Shown above the first task (newest first) |
| Update | "Toggle" on "Finish Experiment 15" | `GET /toggle/1/ 302`, `completed` = `True`, title shown with strikethrough |
| Delete | "Delete" on "Write the lab report" | `GET /delete/2/ 302`, task removed |
| Admin | Open `/admin/` | `302` redirect to the admin login page |

Tasks are stored in `db.sqlite3`, so they are still there after the server is stopped and started again.

## manage.py commands used

| Command | Purpose |
|---------|---------|
| `startapp todo` | Create the `todo` app |
| `makemigrations todo` | Generate the migration from `models.py` |
| `migrate` | Apply migrations and create the tables |
| `createsuperuser` | Create an admin account |
| `runserver` | Start the development server on port 8000 |
| `check` | Validate the project |
| `showmigrations todo` | List the app's migrations |

## Conclusion

Django follows the Model-View-Template pattern: the model describes the table, the views handle requests and query the database through the ORM, and the templates render the HTML. Migrations turn changes in `models.py` into SQL, so the table was created without writing SQL by hand, and the admin panel works for the model with one line in `admin.py`.
