// Assignment 1 — Notes App with localStorage, sessionStorage and JSON
// Abhi Kumar Agrawal · SAP ID 590014564

const NOTES_KEY = "notes";      // localStorage: array of notes (the "database")
const THEME_KEY = "theme";      // localStorage: "light" | "dark"
const DRAFT_KEY = "noteDraft";  // sessionStorage: unsent text, lost when the tab closes

// ---------- Step 2: helper functions (JSON <-> storage) ----------

function getNotes() {
    const raw = localStorage.getItem(NOTES_KEY);
    if (!raw) return [];
    try {
        const notes = JSON.parse(raw);
        return Array.isArray(notes) ? notes : [];
    } catch (e) {
        console.error("Stored notes are not valid JSON:", e.message);
        return [];
    }
}

function saveNotes(notes) {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

function parseTags(input) {
    return [...new Set(
        input.split(",")
             .map(t => t.trim().replace(/^#/, "").toLowerCase())
             .filter(Boolean)
    )];
}

// ---------- Step 3: CRUD operations ----------

// CREATE
function addNote(text, tags = []) {
    text = text.trim();
    if (!text) return false;                 // empty notes are not allowed
    const notes = getNotes();
    notes.push({
        id: Date.now(),
        text: text,
        tags: tags,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: null
    });
    saveNotes(notes);
    renderNotes();
    return true;
}

// UPDATE (text and tags)
function updateNote(id, newText, newTags) {
    newText = newText.trim();
    if (!newText) return false;
    const notes = getNotes();
    const note = notes.find(n => n.id === id);
    if (note) {
        note.text = newText;
        if (newTags) note.tags = newTags;
        note.updatedAt = new Date().toISOString();
        saveNotes(notes);
    }
    editingId = null;
    renderNotes();
    return true;
}

// UPDATE (complete / incomplete)
function toggleComplete(id) {
    const notes = getNotes();
    const note = notes.find(n => n.id === id);
    if (note) {
        note.completed = !note.completed;
        note.updatedAt = new Date().toISOString();
        saveNotes(notes);
        renderNotes();
    }
}

// DELETE
function deleteNote(id) {
    const notes = getNotes().filter(n => n.id !== id);
    saveNotes(notes);
    renderNotes();
}

// ---------- Step 4: render to the DOM ----------

const listEl = document.getElementById("notesList");
const emptyEl = document.getElementById("emptyState");
const statsEl = document.getElementById("stats");
const searchEl = document.getElementById("searchInput");

let currentFilter = "all";
let editingId = null;

function formatDate(iso) {
    return new Date(iso).toLocaleString(undefined, {
        day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
}

function matchesSearch(note, query) {
    if (!query) return true;
    if (query.startsWith("#")) return (note.tags || []).includes(query.slice(1));
    return note.text.toLowerCase().includes(query) ||
           (note.tags || []).some(t => t.includes(query));
}

function renderNotes() {
    const notes = getNotes();
    const query = searchEl.value.trim().toLowerCase();

    const visible = notes.filter(n =>
        (currentFilter === "all" ||
         (currentFilter === "active" && !n.completed) ||
         (currentFilter === "completed" && n.completed)) &&
        matchesSearch(n, query)
    );

    const done = notes.filter(n => n.completed).length;
    statsEl.textContent = notes.length
        ? `${notes.length} note${notes.length > 1 ? "s" : ""} · ${done} completed` +
          (visible.length !== notes.length ? ` · showing ${visible.length}` : "")
        : "";

    listEl.replaceChildren(...visible.map(buildNoteCard));
    emptyEl.hidden = visible.length > 0;
    emptyEl.textContent = notes.length ? "No notes match this filter." : "No notes yet. Add your first one above.";
}

// Built with createElement + textContent (not innerHTML) so note text can never inject HTML
function buildNoteCard(note) {
    const card = document.createElement("article");
    card.className = "card note" + (note.completed ? " completed" : "");
    card.dataset.id = note.id;

    const left = el("div", "left");
    const handle = el("span", "handle", "⋮⋮");
    handle.title = "Drag to reorder";
    const check = document.createElement("input");
    check.type = "checkbox";
    check.className = "check";
    check.checked = note.completed;
    check.dataset.action = "toggle";
    check.title = "Mark complete";
    left.append(handle, check);

    const body = el("div", "body");
    const actions = el("div", "actions");

    if (editingId === note.id) {
        const ta = document.createElement("textarea");
        ta.className = "edit-text";
        ta.rows = 3;
        ta.value = note.text;
        const tags = document.createElement("input");
        tags.type = "text";
        tags.className = "edit-tags";
        tags.placeholder = "Tags, comma separated";
        tags.value = (note.tags || []).join(", ");
        body.append(ta, tags);
        actions.append(button("Save", "save", "primary"), button("Cancel", "cancel"));
        setTimeout(() => ta.focus(), 0);
    } else {
        body.append(el("p", "text", note.text));
        if (note.tags && note.tags.length) {
            const tagWrap = el("div", "tags");
            note.tags.forEach(t => {
                const tag = el("button", "tag", "#" + t);
                tag.type = "button";
                tag.dataset.tag = t;
                tagWrap.append(tag);
            });
            body.append(tagWrap);
        }
        const meta = "Created " + formatDate(note.createdAt) +
                     (note.updatedAt ? " · Edited " + formatDate(note.updatedAt) : "");
        body.append(el("div", "meta", meta));
        actions.append(button("Edit", "edit"), button("Delete", "delete", "delete"));
        card.draggable = true;
    }

    card.append(left, body, actions);
    return card;
}

function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

function button(label, action, extraClass = "") {
    const b = el("button", extraClass, label);
    b.type = "button";
    b.dataset.action = action;
    return b;
}

// ---------- Events ----------

// Add note
const form = document.getElementById("noteForm");
const noteInput = document.getElementById("noteInput");
const tagInput = document.getElementById("tagInput");
const formError = document.getElementById("formError");

form.addEventListener("submit", e => {
    e.preventDefault();
    const ok = addNote(noteInput.value, parseTags(tagInput.value));
    formError.hidden = ok;
    if (ok) {
        noteInput.value = "";
        tagInput.value = "";
        sessionStorage.removeItem(DRAFT_KEY);
        noteInput.focus();
    }
});

// Ctrl/Cmd + Enter adds the note
noteInput.addEventListener("keydown", e => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) form.requestSubmit();
});

// Draft in sessionStorage: survives a refresh, disappears when the tab is closed
function saveDraft() {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ text: noteInput.value, tags: tagInput.value }));
}
noteInput.addEventListener("input", () => { formError.hidden = true; saveDraft(); });
tagInput.addEventListener("input", saveDraft);

function restoreDraft() {
    try {
        const draft = JSON.parse(sessionStorage.getItem(DRAFT_KEY));
        if (draft) {
            noteInput.value = draft.text || "";
            tagInput.value = draft.tags || "";
        }
    } catch (e) { /* ignore a broken draft */ }
}

// Edit / Delete / Save / Cancel / Toggle — one listener for the whole list (event delegation)
listEl.addEventListener("click", e => {
    const tagBtn = e.target.closest("[data-tag]");
    if (tagBtn) {
        searchEl.value = "#" + tagBtn.dataset.tag;
        renderNotes();
        return;
    }
    const target = e.target.closest("[data-action]");
    if (!target) return;
    const card = target.closest(".note");
    const id = Number(card.dataset.id);

    switch (target.dataset.action) {
        case "toggle": toggleComplete(id); break;
        case "delete":
            if (confirm("Delete this note?")) deleteNote(id);
            break;
        case "edit":   editingId = id; renderNotes(); break;
        case "cancel": editingId = null; renderNotes(); break;
        case "save": {
            const text = card.querySelector(".edit-text").value;
            const tags = parseTags(card.querySelector(".edit-tags").value);
            if (!updateNote(id, text, tags)) card.querySelector(".edit-text").focus();
            break;
        }
    }
});

// Save with Ctrl/Cmd + Enter, cancel with Escape while editing
listEl.addEventListener("keydown", e => {
    const card = e.target.closest(".note");
    if (!card || editingId === null) return;
    if (e.key === "Escape") { editingId = null; renderNotes(); }
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) card.querySelector('[data-action="save"]').click();
});

// Search and filter
searchEl.addEventListener("input", renderNotes);
document.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
        document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        currentFilter = chip.dataset.filter;
        renderNotes();
    });
});

// ---------- Drag to reorder (order is saved in the notes array) ----------

let dragId = null;

listEl.addEventListener("dragstart", e => {
    const card = e.target.closest(".note");
    if (!card) return;
    dragId = Number(card.dataset.id);
    card.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
});

listEl.addEventListener("dragover", e => {
    const card = e.target.closest(".note");
    if (!card || dragId === null) return;
    e.preventDefault();
    listEl.querySelectorAll(".drag-over").forEach(c => c.classList.remove("drag-over"));
    if (Number(card.dataset.id) !== dragId) card.classList.add("drag-over");
});

listEl.addEventListener("drop", e => {
    e.preventDefault();
    const card = e.target.closest(".note");
    if (!card || dragId === null) return;
    const targetId = Number(card.dataset.id);
    if (targetId !== dragId) {
        const notes = getNotes();
        const from = notes.findIndex(n => n.id === dragId);
        const [moved] = notes.splice(from, 1);
        const to = notes.findIndex(n => n.id === targetId);
        notes.splice(from <= to ? to + 1 : to, 0, moved);
        saveNotes(notes);
    }
    renderNotes();
});

listEl.addEventListener("dragend", () => {
    dragId = null;
    renderNotes();
});

// ---------- Import / Export as a JSON file ----------

document.getElementById("exportBtn").addEventListener("click", () => {
    const json = JSON.stringify(getNotes(), null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "notes-" + new Date().toISOString().slice(0, 10) + ".json";
    a.click();
    URL.revokeObjectURL(a.href);
});

document.getElementById("importFile").addEventListener("change", async e => {
    const file = e.target.files[0];
    if (!file) return;
    try {
        const data = JSON.parse(await file.text());
        if (!Array.isArray(data)) throw new Error("File must contain an array of notes");
        const existing = getNotes();
        const ids = new Set(existing.map(n => n.id));
        let added = 0;
        data.forEach((n, i) => {
            if (!n || typeof n.text !== "string" || !n.text.trim()) return;   // skip invalid notes
            let id = Number(n.id) || Date.now() + i;
            while (ids.has(id)) id++;
            ids.add(id);
            existing.push({
                id,
                text: n.text.trim(),
                tags: Array.isArray(n.tags) ? n.tags.map(String) : [],
                completed: Boolean(n.completed),
                createdAt: n.createdAt || new Date().toISOString(),
                updatedAt: n.updatedAt || null
            });
            added++;
        });
        saveNotes(existing);
        renderNotes();
        alert(`Imported ${added} note${added === 1 ? "" : "s"}.`);
    } catch (err) {
        alert("Import failed: " + err.message);
    }
    e.target.value = "";
});

// ---------- Dark / Light mode (preference saved in localStorage) ----------

const themeBtn = document.getElementById("themeToggle");

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    themeBtn.textContent = theme === "dark" ? "Light mode" : "Dark mode";
}

themeBtn.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
});

// Another tab changed localStorage -> refresh this tab too (localStorage is shared per origin)
window.addEventListener("storage", e => {
    if (e.key === NOTES_KEY) renderNotes();
    if (e.key === THEME_KEY) applyTheme(e.newValue || "light");
});

// ---------- Step 5: load on start ----------

window.onload = () => {
    applyTheme(localStorage.getItem(THEME_KEY) || "light");
    restoreDraft();
    renderNotes();
};
