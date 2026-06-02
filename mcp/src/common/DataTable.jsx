/**
 * DataTable.jsx — reusable table component.
 *
 * Props:
 *   columns          – Column definitions (see type below).
 *   rows             – Array of data objects.
 *   rowKey           – String field name OR (row, index) => key. Default: 'id'.
 *   emptyMessage     – Text shown when rows is empty.
 *   title            – Optional heading rendered above the table.
 *   search           – Controlled search value (shows search bar when provided).
 *   onSearch         – Search change handler (fn receives new string value).
 *   searchPlaceholder– Placeholder for the search input.
 *
 * Column definition:
 *   {
 *     label:     string          — header text
 *     key?:      string          — row field to read; passed as first arg to render
 *     render?:   (value, row) => ReactNode  — custom cell renderer
 *     className?: string         — extra class(es) on every <td> in this column
 *     align?:    'left'|'right'|'center'    — header + cell text alignment
 *   }
 *
 * If `render` is omitted, the cell displays row[key] as plain text.
 * If both `key` and `render` are provided, render(row[key], row) is called.
 */

import React from 'react';
import { Search } from 'lucide-react';
import '../App.css';

export default function DataTable({
  columns,
  rows,
  rowKey = 'id',
  emptyMessage = 'No records.',
  title,
  search,
  onSearch,
  searchPlaceholder = 'Search...',
}) {
  // Support both a field-name string and a custom key function
  const getKey = typeof rowKey === 'function'
    ? rowKey
    : (row, i) => row[rowKey] ?? i;

  return (
    <div className="cmod-table-card">

      {/* Optional section title (e.g. "Communication Templates") */}
      {title && <div className="cmod-tpl-heading">{title}</div>}

      {/* Search bar — only rendered when onSearch is wired up */}
      {onSearch && (
        <div className="cmod-search-wrap">
          <Search size={13} className="cmod-search-icon" />
          <input
            className="cmod-search-input"
            placeholder={searchPlaceholder}
            value={search ?? ''}
            onChange={e => onSearch(e.target.value)}
          />
        </div>
      )}

      <table className="cmod-table">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className={[
                  'cmod-th',
                  col.align === 'right'  ? 'cmod-th-right'  : '',
                  col.align === 'center' ? 'cmod-th-center' : '',
                ].filter(Boolean).join(' ')}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            // Empty state spans all columns
            <tr>
              <td colSpan={columns.length} className="cmod-empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={getKey(row, i)} className="cmod-tr">
                {columns.map((col, ci) => {
                  const val     = col.key ? row[col.key] : undefined;
                  const content = col.render ? col.render(val, row) : val;
                  return (
                    <td
                      key={ci}
                      className={['cmod-td', col.className].filter(Boolean).join(' ')}
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
