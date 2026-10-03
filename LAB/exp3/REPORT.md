# Experiment 3 Report

## Objective

Build a responsive web page from scratch using HTML5, CSS3, Flexbox, CSS Grid and media queries, without any framework.

## Work Completed

1. Created the HTML skeleton with `<meta name="viewport" content="width=device-width, initial-scale=1.0">` so mobile browsers use the real device width.
2. Laid out three cards in a row with Flexbox (`display: flex; gap: 20px;` and `flex: 1` on each card).
3. Added a `max-width: 768px` media query that switches the row to `flex-direction: column`, so the cards stack on tablets and phones.
4. Added a navigation bar and a second breakpoint at `max-width: 480px` where the nav stacks vertically and its links wrap.
5. Replaced Flexbox with CSS Grid (`grid-template-columns: repeat(3, 1fr)`) and added a footer kept at the bottom with `min-height: 100vh` on a flex-column `body`.
6. Exercises:
   - Added a 4th card and a `min-width: 1025px` query for a 4-column grid.
   - Added a responsive image (`max-width: 100%; height: auto;`).
   - Added a `prefers-color-scheme: dark` query for dark mode.

### Results observed

| Viewport width | Grid columns | Notes |
|----------------|--------------|-------|
| 1280px (desktop) | 4 | Nav in one row |
| 900px (laptop) | 3 | Base grid |
| 768px (tablet) | 2 | Smaller heading |
| 375px (phone) | 1 | Nav stacks vertically, links centred |

The image always stayed inside its card, and no viewport size caused horizontal scrolling. With the system set to dark mode, the page background became `#1a1a1a` and card text `#e0e0e0`.

## Conclusion

The viewport meta tag together with media queries lets one HTML file adapt from a phone to a wide desktop. Flexbox suits one-dimensional layouts like the nav bar, while Grid makes it easy to redefine the number of columns at each breakpoint.
