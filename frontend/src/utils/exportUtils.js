import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

/**
 * Export data to CSV
 * @param {Array} data - Array of objects
 * @param {string} fileName - Name of the file
 */
export const exportToCSV = (data, fileName) => {
  if (!data || !data.length) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header] === null || row[header] === undefined ? '' : row[header];
        // Handle values with commas
        const stringValue = String(value).replace(/"/g, '""');
        return `"${stringValue}"`;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export data to Excel
 * @param {Array} data - Array of objects
 * @param {string} fileName - Name of the file
 */
export const exportToExcel = (data, fileName) => {
  if (!data || !data.length) return;

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

/**
 * Export data to PDF
 * @param {Array} data - Array of objects
 * @param {string} fileName - Name of the file
 * @param {string} title - Title in the PDF
 */
export const exportToPDF = (data, fileName, title) => {
  if (!data || !data.length) return;

  const doc = new jsPDF();
  const headers = Object.keys(data[0]);
  const body = data.map(row => headers.map(header => row[header]));

  doc.text(title, 14, 15);
  autoTable(doc, {
    startY: 20,
    head: [headers.map(h => h.charAt(0).toUpperCase() + h.slice(1))],
    body: body,
  });
  doc.save(`${fileName}.pdf`);
};
