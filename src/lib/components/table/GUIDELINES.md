# Table guidelines

Rules and recommendations for working with tables. Follow them whenever a screen
or a prototype has a table.

- **Source:** Figma → habibi-library → page
  [Tables Guide](https://www.figma.com/design/8FWSbY8d6RouJYeI2acNsl/habibi-library?node-id=40008180-8496)
  (it has a drawn example for every rule, in left-to-right and right-to-left).
- **This file is the single copy in code.** The docs page `/ds/tables` shows this same file.
  If the Figma page changes, update this file.
- **Sides:** "left" and "right" below are for left-to-right languages. In right-to-left
  languages they swap. In CSS, use `inline-start` / `inline-end` so this happens by itself.

## 1. Tables

### 1.0 When to use a table

- **Use a table** when the person compares data across cells, studies a sequence of events,
  or changes data with bulk operations.
- **Use a search page instead** when the person looks for one object by data they already know,
  to open its details (a user, a transaction, a server).

[Figma](https://www.figma.com/design/8FWSbY8d6RouJYeI2acNsl/habibi-library?node-id=40008180-11410)

### 1.1 Anatomy

A table is made of four parts, top to bottom:

1. **Title** — needed only if the page has other content besides the table.
2. **Toolbar** — search and filters on the left, a group of up to 3 buttons on the right.
3. **Table body** — columns, rows, cells and the bulk-operation controls (checkboxes).
4. **Summary row** — optional. Shows totals for the whole table, e.g. "14 employees" on the left
   and "Total: 25,037,750,192.00" on the right.

[Figma](https://www.figma.com/design/8FWSbY8d6RouJYeI2acNsl/habibi-library?node-id=40008180-11417)

### 1.2 Default row sorting

- Rows are **always** sorted by one of the columns. That column is marked with an arrow.
- The person can sort each column: alphabetically, or ascending and descending.

[Figma](https://www.figma.com/design/8FWSbY8d6RouJYeI2acNsl/habibi-library?node-id=40008180-11517)

### 1.3 Row alignment and text truncation

- Everything in a row, and in the header, is aligned to the text baseline.
- **Important text wraps** to a second line (for example a full name).
- **Text that can be skipped is cut** with "…" and stays available in the detail view.

[Figma](https://www.figma.com/design/8FWSbY8d6RouJYeI2acNsl/habibi-library?node-id=40008180-11615)

## 2. Scrolling

### 2.1 Vertical scrolling

- When the data is taller than the screen, the **toolbar can be pinned to the top** of the screen
  and the **summary row to the bottom**.
- Let the page header, titles and navigation scroll out of view, so they do not distract from
  the table.

[Figma](https://www.figma.com/design/8FWSbY8d6RouJYeI2acNsl/habibi-library?node-id=40008180-11708)

### 2.2 Horizontal scrolling

- When the data is wider than the screen, **selected columns can be pinned to the left**,
  on top of the other cells (usually the first column, the one that names the row).

[Figma](https://www.figma.com/design/8FWSbY8d6RouJYeI2acNsl/habibi-library?node-id=40008180-11824)

### 2.3 Scrolling both ways

- The two rules above work together: pinned toolbar and summary row, plus pinned columns.

[Figma](https://www.figma.com/design/8FWSbY8d6RouJYeI2acNsl/habibi-library?node-id=40008180-11938)

## 3. Search and filter

### 3.1 Purpose

- Search and filters help find the right records and limit what is shown.
- Filtering is done with **filter tags** (`FilterChip`): they show which conditions are applied
  and let the person change them.

[Figma](https://www.figma.com/design/8FWSbY8d6RouJYeI2acNsl/habibi-library?node-id=40008180-12079)

### 3.2 Filter tags

- Filter tags are **required** wherever a table can be filtered.
- If they do not fit on one line, they **wrap to the next line**. They are never hidden.

[Figma](https://www.figma.com/design/8FWSbY8d6RouJYeI2acNsl/habibi-library?node-id=40008180-12087)

### 3.3 Search across several columns

- Use the placeholder **"Search"**. Do not list the columns in the placeholder.

[Figma](https://www.figma.com/design/8FWSbY8d6RouJYeI2acNsl/habibi-library?node-id=40008180-12163)

### 3.4 Search in one column

- **Name the column** in the placeholder, e.g. "Search by login".

[Figma](https://www.figma.com/design/8FWSbY8d6RouJYeI2acNsl/habibi-library?node-id=40008180-12229)

### 3.5 Additional filters

- Show **no more than 3–5 filter tags** at a time. The rest are hidden in a dropdown list.
- The designer may choose to open a side panel (drawer) instead of the dropdown.

[Figma](https://www.figma.com/design/8FWSbY8d6RouJYeI2acNsl/habibi-library?node-id=40008180-12260)

## 4. Button placement

Where the "add a row" button (the main action) goes.

### 4.1 Page with only a table

- Put the add-row button in the **page header**.

[Figma](https://www.figma.com/design/8FWSbY8d6RouJYeI2acNsl/habibi-library?node-id=40008180-12378)

### 4.2 Page with tabs or other content

- If the page has tabs, segments, scopes or other content besides the table, put the add-row
  button in the **table's toolbar** — close to what it acts on.

[Figma](https://www.figma.com/design/8FWSbY8d6RouJYeI2acNsl/habibi-library?node-id=40008180-12480)

### 4.3 Icon buttons

- An icon-only button is fine for the main action.

[Figma](https://www.figma.com/design/8FWSbY8d6RouJYeI2acNsl/habibi-library?node-id=40008180-12580)

## 5. Single-row actions

Actions on one row: edit, download, delete…

### 5.1 Dedicated actions column — preferred when the table fits

- Little data and **no horizontal scrolling**: give actions their own column.
- The actions are shown **only while the mouse is over the row**.

[Figma](https://www.figma.com/design/8FWSbY8d6RouJYeI2acNsl/habibi-library?node-id=40008180-12684)

### 5.2 Wide table — preferred when it scrolls sideways

- A lot of data and **horizontal scrolling**: the actions appear on hover and are
  **pinned to the right edge** of the table body, on top of the cells. No column is needed.

[Figma](https://www.figma.com/design/8FWSbY8d6RouJYeI2acNsl/habibi-library?node-id=40008180-12799)

### 5.3 Pinned actions column — the fallback

- If 5.2 cannot be built, pin a dedicated actions column to the right side of the table.

[Figma](https://www.figma.com/design/8FWSbY8d6RouJYeI2acNsl/habibi-library?node-id=40008180-12909)

## 6. Column actions

### 6.1 Changing a column's width

- The resize control appears when the mouse is over a header cell.

[Figma](https://www.figma.com/design/8FWSbY8d6RouJYeI2acNsl/habibi-library?node-id=40008180-13054)

### 6.2 Parent column in a two-level header

- Resizing a parent column resizes its child columns **in proportion**.

[Figma](https://www.figma.com/design/8FWSbY8d6RouJYeI2acNsl/habibi-library?node-id=40008180-13188)

### 6.3 Child column in a two-level header

- Resizing a child column does **not** change the width of its parent.

[Figma](https://www.figma.com/design/8FWSbY8d6RouJYeI2acNsl/habibi-library?node-id=40008180-13344)

## 7. Bulk operations

Selecting several rows to act on them together.

### 7.1 Initial state

- Every row has a checkbox. The person ticks the rows they want.

[Figma](https://www.figma.com/design/8FWSbY8d6RouJYeI2acNsl/habibi-library?node-id=40008180-13504)

### 7.2 Some rows selected

- The checkbox in the header shows the **semi-check** (dash) icon.

[Figma](https://www.figma.com/design/8FWSbY8d6RouJYeI2acNsl/habibi-library?node-id=40008180-13621)

### 7.3 Select all

- Clicking the header checkbox selects **all available rows**, or clears the selection.

[Figma](https://www.figma.com/design/8FWSbY8d6RouJYeI2acNsl/habibi-library?node-id=40008180-13744)

### 7.4 Selection and filters

The header checkbox selects all **filtered** rows. If the person then changes the filters:

- **A)** Rows that newly appear are **not** selected automatically.
- **B)** Rows that drop out of the results are **removed** from the selection automatically.

[Figma](https://www.figma.com/design/8FWSbY8d6RouJYeI2acNsl/habibi-library?node-id=40008180-13867)

### 7.5 Selection and pagination

- The person can select all rows **on this page** or **all rows in the table**.
  Clicking the header checkbox opens a small menu with these two choices.

[Figma](https://www.figma.com/design/8FWSbY8d6RouJYeI2acNsl/habibi-library?node-id=40008180-13876)

## What the code can do today

Which rules the design system already covers, and what a prototype has to add itself.

| Rule                                 | Today                                                              |
| ------------------------------------ | ------------------------------------------------------------------ |
| 1.1 Title, toolbar                   | Build from `TextInput`, `FilterChip`, `Button` above the `Table`   |
| 1.1 Summary row                      | Not built yet                                                      |
| 1.2 Sorting and its arrow            | `Table`: `sortable`, `sortKey`, `sortDirection`, `onsort`          |
| 1.3 Cut long text with "…"           | `Table` does this in every cell                                    |
| 1.3 Wrap important text              | Not built yet (every cell is cut)                                  |
| 2.x Pinned toolbar, summary, columns | Not built yet                                                      |
| 3.x Filter tags, search              | `FilterChip`, `TextInput` (the page keeps the filter values)       |
| 3.5 "More filters" dropdown          | Build from `Button` + `Menu`                                       |
| 4.x Add-row button                   | `Button` (placement is up to the page)                             |
| 5.x Row actions on hover             | Not built yet (can be drawn by hand with the `cell` snippet)       |
| 6.x Column resize, two-level headers | Not built yet                                                      |
| 7.x Row checkboxes, select all       | Not built yet (`Checkbox` exists; `Table` has no selection column) |
| 7.5 Pagination                       | Not built yet                                                      |
