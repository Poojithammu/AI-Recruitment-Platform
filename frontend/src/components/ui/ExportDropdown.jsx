import React, { useState, useRef, useEffect } from 'react';
import { Download, FileText, Table, FileSpreadsheet, ChevronDown } from 'lucide-react';
import { exportToCSV, exportToExcel, exportToPDF } from '../../utils/exportUtils';

const ExportDropdown = ({ data, fileName, title, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = (type) => {
    if (!data || data.length === 0) return;
    
    switch (type) {
      case 'csv':
        exportToCSV(data, fileName);
        break;
      case 'excel':
        exportToExcel(data, fileName);
        break;
      case 'pdf':
        exportToPDF(data, fileName, title);
        break;
      default:
        break;
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 
          ${disabled 
            ? 'bg-muted/50 text-muted-foreground cursor-not-allowed' 
            : 'bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20'}`}
      >
        <Download size={14} />
        <span>Export</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 origin-top-right rounded-xl bg-card border border-border shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="py-1">
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-foreground hover:bg-primary/10 transition-colors"
            >
              <FileText size={16} className="text-red-500" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-foreground hover:bg-primary/10 transition-colors"
            >
              <FileSpreadsheet size={16} className="text-green-500" />
              <span>Export Excel</span>
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-foreground hover:bg-primary/10 transition-colors"
            >
              <Table size={16} className="text-blue-500" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportDropdown;
