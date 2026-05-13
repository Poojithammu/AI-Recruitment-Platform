import React from 'react';
import { ChevronLeft, ChevronRight, Edit2, Trash2, Eye, Loader2 } from 'lucide-react';

const DataTable = ({ 
  columns, 
  data = [], 
  actions = ['view', 'edit', 'delete'], 
  pagination = false,
  loading = false,
  onView,
  onEdit,
  onDelete
}) => {
  if (loading) {
    return (
      <div className="bg-card rounded-[32px] border border-border p-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 size={40} className="text-primary animate-spin" />
        <p className="text-sm font-bold text-muted-foreground animate-pulse uppercase tracking-widest">Synchronizing Database...</p>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="bg-card rounded-[32px] border border-border p-20 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
           <Eye size={24} />
        </div>
        <div>
          <p className="text-lg font-bold">No Records Found</p>
          <p className="text-sm text-muted-foreground">Adjust your filters or try a different search term.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-[32px] border border-border overflow-hidden shadow-sm">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              {columns.map((col, idx) => (
                <th key={idx} className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                  {col.header}
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] text-right">
                  System Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {data.map((row, rowIdx) => (
              <tr key={row._id || rowIdx} className="hover:bg-primary/[0.02] transition-all group">
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="px-8 py-6 text-sm">
                    {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                  </td>
                ))}
                {actions && actions.length > 0 && (
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      {actions.includes('view') && (
                        <button 
                          onClick={() => onView?.(row)}
                          className="p-2.5 hover:bg-primary/10 text-primary rounded-xl transition-colors border border-transparent hover:border-primary/20"
                        >
                          <Eye size={18} />
                        </button>
                      )}
                      {actions.includes('edit') && (
                        <button 
                          onClick={() => onEdit?.(row)}
                          className="p-2.5 hover:bg-blue-500/10 text-blue-500 rounded-xl transition-colors border border-transparent hover:border-blue-500/20"
                        >
                          <Edit2 size={18} />
                        </button>
                      )}
                      {actions.includes('delete') && (
                        <button 
                          onClick={() => onDelete?.(row)}
                          className="p-2.5 hover:bg-destructive/10 text-destructive rounded-xl transition-colors border border-transparent hover:border-destructive/20"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="px-8 py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between bg-muted/10 gap-4">
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
            Displaying <span className="text-foreground">{data.length}</span> active records
          </p>
          <div className="flex gap-2">
            <button className="p-2.5 border border-border rounded-xl hover:bg-muted transition-colors disabled:opacity-30" disabled>
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-1.5">
              {[1].map(p => (
                <button key={p} className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all ${p === 1 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-muted text-muted-foreground'}`}>
                  {p}
                </button>
              ))}
            </div>
            <button className="p-2.5 border border-border rounded-xl hover:bg-muted transition-colors disabled:opacity-30" disabled>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
