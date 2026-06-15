# Task---> optimize the Code

## 1 CreditHoldReport page
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

## 2 Auto Released Page 
-->Replace hard-coded table headers and cells with a COLUMNS array and map().
-->Replace key={i} with a unique key like key={e.audit} or key={${e.order}-${e.audit}}.
-->Add a visible filter dropdown because the filter state and useMemo() logic already exist but are not being used in the UI.

## 3 Case details
-->Replaced repeated badge components with one reusable Badge component using status-style mapping.
-->Combined similar sidebar sections like linked invoices and linked disputes into one reusable LinkedItems component.
-->Used config arrays with map() for repeated UI such as action buttons, financial rows, and stat boxes. 

## 4 Cases
-->Replace repeated search conditions with a SEARCH_FIELDS array and .some().
-->Replace the long switch in sortCases() with a SORT_GETTERS config object.
-->Create a reusable FilterSelect component for the status and priority dropdowns.

## 5 Communication modal
-->Create a reusable DataTable component and render all four tab tables using column configs.
-->Use useMemo() with a SEARCH_FIELDS array for outbound filtering.
-->Replace repeated if/else, inline styles, and index keys with maps, CSS classes, and stable IDs.

## 6 Announcement banner
1. Deferred render (LCP fix)
Before: useState(true) — banner rendered immediately on first paint, making span.announcement-desc the browser's LCP element.

After: useState(null) + useEffect — component returns null on first paint, then checks localStorage after mount. The banner never participates in LCP calculation.

2. localStorage persistence
Before: useState(true) resets on every page navigation — banner kept reappearing even after dismissal.

After: On close, writes '1' to localStorage under key announcement_v2_7_3_dismissed. On mount, checks that key — if it exists, stays hidden. Dismissed once = dismissed everywhere, across all pages and reloads. Bumping the key string shows it again for the next release.

## Results
LCP(largest contentful paint)  1950.36s -> 0.60s

## Communication
-->Use SEARCH_FIELDS with .some() to shorten and improve search filtering.
-->Use config arrays with map() for tabs and template table columns.
-->Replace repeated if conditions with object maps for channel avatars, channel badges, status badges, and direction icons.

## Communication Module
-->Create a reusable DataTable component and render all four tab tables using column configs.
-->Use useMemo() with a SEARCH_FIELDS array for outbound filtering.
-->Replace repeated if/else, inline styles, and index keys with maps, CSS classes, and stable IDs.

## customerdetail
-->eplace the long renderTab() switch with a TAB_COMPONENTS object map.
-->Create a reusable DetailRow component for repeated row UI across Held Orders, A/R Ledger, Disputes, Cases, and Invoices.
-->Replace index keys and conditional class chains with stable IDs and class maps.

## zendesk Coordination
-->Use SEARCH_FIELDS with .some() to shorten ticket filtering.
-->Create reusable Badge, OwnerCell, and DataTable components.
-->Replace hard-coded tab buttons and repeated table rendering with config arrays and map().

## Credit hold report
-->Optimized the Credit Hold Report by using COLUMNS.map() and SEARCH_FIELDS to reduce hard-coded table and filter logic.
-->Improved performance with useMemo() for filtered rows and memoized export data.
-->Reduced duplicate code by creating a reusable useExportReport hook for CSV/XLSX export with row count and Excel formatting.

## Re-decisioning events
-->Replace hard-coded KPI cards with a kpis array and render them using map() and memoize them using useMemo Hook.
-->Replace hard-coded table headers and cells with a COLUMNS array and dynamic rendering.
-->Replace multiple .filter().length calls with one .reduce() to calculate stats in a single pass.
-->Improve empty/loading states (production readiness)

## SLA Risk Queue
-->Replace hard-coded table headers and cells with a reusable COLUMNS array and map().
-->Generate filter tab counts from a FILTER_CONFIG instead of writing repeated .filter() logic.
-->Use item.id as the row key instead of the array index.

## Release unlock 
-->Use a COLUMNS array with map() to remove hard-coded table headers and cells.
-->Keep totalBlocked memoized with useMemo() if heldOrders becomes dynamic.
-->Move fmt() into a reusable formatter utility so other components can reuse it...

## Release unlock detail

-->Create reusable DetailCard and CriteriaRow components to reduce repeated JSX.
-->Use a contextItems array with map() for the order context section.
-->git push origin optimized-codeMove fmt() into a shared formatCurrencyShort() utility and use stable keys like c.text.

## SimulationStudio

-->Create reusable components like KpiCard, RangeInput, PillGroup, and SelectInput to reduce repeated JSX.
-->Replace manual tabs and repeated KPI sections with config arrays and map().
-->Combine related input states into state objects and clean up useMemo() dependencies.

## ScoreCards
-->Replace TrendLine conditional logic with a TREND_CONFIG object.
-->Move the large sections data array into a separate scorecardsData.js file.
-->Create a reusable SectionBlock component to make the main Scorecards component shorter and cleaner.

## Held orders
-->Use filterTabsWithCount with useMemo() to avoid recalculating tab counts every render.
-->Replace the sorting switch with a SORT_GETTERS config object.
-->Use a COLUMNS array to render table headers and cells dynamically, and replace hard-coded colSpan={14} with colSpan={COLUMNS.length}.

## DashBoard
-->Replace TrendLine conditional logic with a TREND_CONFIG object.
-->Move the large sections data array into a separate scorecardsData.js file.
-->Create a reusable SectionBlock component to make the main Scorecards component shorter and cleaner.

## Next Best Actions

-->Replace multiple activeTab === ... conditions with a tabs config that includes Component and props.
-->Move cashRecovery and slaCases data into a separate data file.
-->Consider lazy loading tab components later if the tab content becomes large.