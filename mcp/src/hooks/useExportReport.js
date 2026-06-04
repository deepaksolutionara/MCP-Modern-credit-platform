import { useMemo } from 'react';
import * as XLSX from 'xlsx';

function fileTimestamp() {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');

  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`;
}

function downloadFile({ type, headers, values, filename, sheetName }) {
  if (type === 'csv') {
    const csvRows = values.map(row =>
      row
        .map(value => `"${String(value ?? '').replace(/"/g, '""')}"`)
        .join(',')
    );

    const csv = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();

    URL.revokeObjectURL(url);
    return;
  }

 if (type === 'xlsx') {
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...values]);

  // Format Order Amount column: G2 to G(last row)
  values.forEach((_, index) => {
    const cellAddress = `G${index + 2}`; // +2 because row 1 is header
    if (worksheet[cellAddress]) {
      worksheet[cellAddress].z = '#,##0';
    }
  });

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}
}

export function useExportReport({ reportRows, columns, fileName, sheetName = 'Report' }) {
  const exportData = useMemo(() => {
    const headers = columns.map(col => col.label);

    const values = reportRows.map(row =>
      columns.map(({ key }) => row[key] ?? '')
    );

    return { headers, values };
  }, [reportRows, columns]);

  function exportReport(type) {
    const { headers, values } = exportData;

    if (!values.length) {
      alert('No rows available to export.');
      return;
    }

    downloadFile({
      type,
      headers,
      values,
      filename: `${fileName}_${fileTimestamp()}`,
      sheetName,
    });
  }

  return {
    exportReport,
    exportRowCount: exportData.values.length,
    exportData,
  };
}