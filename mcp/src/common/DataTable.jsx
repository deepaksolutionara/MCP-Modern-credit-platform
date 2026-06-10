/**
 * DataTable.jsx — reusable table component.
 *
 * Props:
 *   columns           – Column definitions (see type below).
 *   rows              – Array of data objects.
 *   rowKey            – String field name OR (row, index) => key. Default: 'id'.
 *   emptyMessage      – Text shown when rows is empty.
 *   title             – Optional heading above the table (string or ReactNode).
 *   search            – Controlled search value (renders search bar when provided).
 *   onSearch          – Search change handler (receives new string).
 *   searchPlaceholder – Placeholder text for the search input.
 *   classes           – Override any default CSS class. Shape: { card, title,
 *                       searchWrap, searchIcon, searchInput, table, th, thRight,
 *                       thCenter, tr, td, empty }. Unset keys fall back to the
 *                       cmod-* defaults so CommunicationModule needs no changes.
 *
 * Column definition:
 *   {
 *     label:      string         — header text
 *     key?:       string         — row field; passed as first arg to render
 *     render?:    (value, row) => ReactNode  — custom cell renderer
 *     className?: string         — extra class(es) on every <td> in this column
 *     align?:     'left' | 'right' | 'center'
 *   }
 */

import React from 'react';
import { Search } from 'lucide-react';
import '../App.css';

// Default CSS classes — used when the caller does not provide overrides.
const DEFAULTS = {
  card:        'cmod-table-card',
  title:       'cmod-tpl-heading',
  searchWrap:  'cmod-search-wrap',
  searchIcon:  'cmod-search-icon',
  searchInput: 'cmod-search-input',
  table:       'cmod-table',
  th:          'cmod-th',
  thRight:     'cmod-th-right',
  thCenter:    'cmod-th-center',
  tr:          'cmod-tr',
  td:          'cmod-td',
  empty:       'cmod-empty',
};

export default function DataTable({
  columns,
  rows,
  rowKey = 'id',
  emptyMessage = 'No records.',
  title,
  search,
  onSearch,
  searchPlaceholder = 'Search...',
  classes = {},
}) {
  // Merge caller overrides with defaults — only provided keys are overridden
  const cls = { ...DEFAULTS, ...classes };

  const getKey = typeof rowKey === 'function'
    ? rowKey
    : (row, i) => row[rowKey] ?? i;

  return (
    <div className={cls.card}>

      {/* Optional title — accepts a plain string or a ReactNode (e.g. a custom
          header with extra controls like the Zendesk sync "Live" badge) */}
      {title && (
        typeof title === 'string'
          ? <div className={cls.title}>{title}</div>
          : title
      )}

      {/* Search bar — only rendered when onSearch is wired up */}
      {onSearch && (
        <div className={cls.searchWrap}>
          <Search size={13} className={cls.searchIcon} />
          <input
            className={cls.searchInput}
            placeholder={searchPlaceholder}
            value={search ?? ''}
            onChange={e => onSearch(e.target.value)}
          />
        </div>
      )}

      <table className={cls.table}>
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className={[
                  cls.th,
                  col.align === 'right'  ? cls.thRight  : '',
                  col.align === 'center' ? cls.thCenter : '',
                ].filter(Boolean).join(' ')}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={cls.empty}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={getKey(row, i)} className={cls.tr}>
                {columns.map((col, ci) => {
                  const val     = col.key ? row[col.key] : undefined;
                  const content = col.render ? col.render(val, row) : val;
                  return (
                    <td
                      key={ci}
                      className={[cls.td, col.className].filter(Boolean).join(' ')}
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>

    </div>
  );
}
