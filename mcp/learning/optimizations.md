# Task---> optimize the CreditHoldReport page

## Summary

In the `CreditHoldReport.jsx` page, I updated the table rendering logic to make it more dynamic and maintainable. Previously, the table column names and table cells were hard-coded in the JSX.

Now, I created a `COLUMNS` array and used the `map()` function to render both table headers and table body cells dynamically.

## Changes Made

* Added a reusable `COLUMNS` array for table column keys and labels.
* Used `COLUMNS.map()` to render table headers.
* Used nested `map()` to render table rows and cells.
* Added `formatCellValue()` to handle special cell formatting.
* Used the `useMemo()` hook to optimize filter logic.

## Learning

I learned that the `map()` function is useful for rendering repeated UI elements in React. It helps reduce hard-coded JSX and makes the table easier to update.

I also learned that `useMemo()` can be used to avoid unnecessary recalculations. In this page, filtered rows are recalculated only when the filter value changes.

## Benefit

This change makes the page cleaner, easier to maintain, and more scalable. If a new column needs to be added, it can be added in the `COLUMNS` array instead of updating multiple hard-coded table elements.
