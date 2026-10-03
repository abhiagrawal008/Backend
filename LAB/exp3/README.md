# exp3
Experiment 3: Create a Responsive Web Page with HTML and CSS

- [Open experiment page](index.html) — final page (Task 5 + all three exercises)
- [Open experiment report](REPORT.md)

## Step-by-step tasks

| File | What it adds |
|------|--------------|
| [tasks/task1.html](tasks/task1.html) | HTML skeleton with the viewport meta tag and a header |
| [tasks/task2.html](tasks/task2.html) | Flexbox row of three cards (desktop layout) |
| [tasks/task3.html](tasks/task3.html) | `@media (max-width: 768px)` — cards stack on mobile |
| [tasks/task4.html](tasks/task4.html) | Responsive navigation bar with a second breakpoint at 480px |
| [tasks/task5.html](tasks/task5.html) | CSS Grid layout and a sticky footer |

## Exercises (done in `index.html`)

1. **Three breakpoints:** 4 columns above 1024px (a 4th card was added), 3 columns from 769–1024px, 2 columns up to 768px, 1 column up to 480px.
2. **Responsive image:** Card 3 has an `<img>` with `max-width: 100%; height: auto;`.
3. **Dark mode:** `@media (prefers-color-scheme: dark)` switches the background to `#1a1a1a` and text to `#e0e0e0`.

## How to run

Open `index.html` in a browser (or right-click → *Open with Live Server* in VS Code) and resize the window.
