# Dashboard Table Controls Implementation Plan

> **For agentic workers:** implement the approved design inline; preserve unrelated working-tree changes.

**Goal:** Make dashboard filters and sorting compact and consistent, and make Views pagination controls read as part of one table panel.

**Architecture:** Normalize each ranked dashboard table to one broad search, content type, and sort control. Put review-focus checkboxes into three labeled groups inside one “More filters” disclosure, and remove duplicate per-column filters. Flatten the Views table’s inner pagination borders while retaining its outer panel and row separators.

**Tech Stack:** Existing HTML fragments, vanilla JavaScript, CSS.

**Spec:** User request and approved choice A in this conversation.

## Global Constraints

- Preserve existing data, table columns, routes, export behavior, and unrelated dirty changes.
- Keep both sortable headers and toolbar sort controls synchronized.
- Table search covers title, LiveLabs/WMS IDs, author/owner email, and additional contact email when the inventory index is ready.
- All dashboard table tabs use the same grouped review-focus controls; keep tab-specific filters working.
- Keep table-specific no-author and demand-protected options working.
- Do not add or run tests in this task.

## Review Focus

- Contact fields load lazily; visible row fields remain searchable while contact data loads, and contact-only searches do not show false matches.
- Owner/author and additional WMS contact emails both match the broad table search.
- Top Performers, P1 urgent action, At-risk, and Retirement review use the same Lifecycle, Demand and freshness, and Evidence and quality groups.
- Header sorting and toolbar sorting must use the same column and direction.
- Narrow screens must wrap search, type, and sort controls without horizontal overflow.
- Review-focus checkboxes retain their existing OR behavior.
- Views pagination retains top and bottom navigation while losing its inner box/divider styling.

---

### Task 1: Simplify dashboard table controls

**Files:** Modify `assets/js/dashboard.js`.

- [ ] Replace per-column dashboard filter inputs with one table-wide search.
- [ ] Keep Workshop/Sprint selection visible and group review-focus checkboxes under “More filters”.
- [ ] Add synchronized sort-by and direction controls; retain heading sorting.
- [ ] Remove redundant pagination “Filters” button.
- [ ] Preserve optional table-specific review filters and contact-search loading behavior.

### Task 2: Style the dashboard controls

**Files:** Modify `assets/css/dashboard.css`.

- [ ] Use a compact responsive toolbar and clearly grouped filter chips.
- [ ] Keep focus indicators, readable labels, and existing theme colors.

### Task 3: Flatten Views table navigation

**Files:** Modify `assets/css/views.css`.

- [ ] Remove the inner pagination outline and metadata divider.
- [ ] Preserve table panel border, toolbar separation, table header, and row separators.

### Continuation: Contact search and consistent dashboard review filters

**Files:** Modify `assets/js/dashboard.js` and dashboard script cache versions in the four public dashboard entry pages.

- [x] Include the generated WMS support/technical/manager contact index in the lazy record search, keyed by LiveLabs ID.
- [x] Search owner/author and selected additional contact email through “Search this table.”
- [x] Normalize the Top Performers, At-risk, and Retirement review legacy focus controls to the P1 grouped layout.
- [x] Keep contact-only searches from matching all rows while loading, and report when the additional contact index is unavailable.
- [x] Preserve the existing Workshop/Sprint selector, sort controls, and tab-specific filters.
- [x] Verify owner and additional-contact searches in the local browser and confirm the same three filter groups on all four tabs.
- [x] Run JavaScript syntax and scoped diff whitespace checks; no project tests were run.
