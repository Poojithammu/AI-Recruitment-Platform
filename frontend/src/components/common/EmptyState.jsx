import React from 'react';
import { Ghost } from 'lucide-react';

const EmptyState = ({ title = "No data found", description = "Try adjusting your filters or search terms.", icon: Icon = Ghost }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-card/30 border border-dashed border-border rounded-3xl">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6 text-muted-foreground/50">
        <Icon size={40} />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm">{description}</p>
      <button className="mt-8 btn-primary">
        Reset Search
      </button>
    </div>
  );
};

export default EmptyState;
