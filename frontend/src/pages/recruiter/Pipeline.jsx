import React, { useState } from 'react';
import { 
  MoreHorizontal, 
  Plus, 
  Search, 
  Filter, 
  Layout, 
  GripVertical,
  Calendar,
  MessageSquare,
  Clock,
  Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ExportDropdown from '../../components/ui/ExportDropdown';

const pipelineColumns = [
  { id: 'new', title: 'New Leads', color: 'bg-blue-500' },
  { id: 'contacted', title: 'Contacted', color: 'bg-purple-500' },
  { id: 'scheduled', title: 'Interview Scheduled', color: 'bg-orange-500' },
  { id: 'followup', title: 'Follow Up', color: 'bg-yellow-500' },
  { id: 'closed', title: 'Closed', color: 'bg-green-500' },
];

const initialCards = [
  { id: '1', name: 'Alex Rivera', role: 'Full Stack Dev', company: 'Google', column: 'new', match: 95 },
  { id: '2', name: 'Sarah Chen', role: 'Backend Engineer', company: 'Meta', column: 'contacted', match: 88 },
  { id: '3', name: 'Marcus Thorne', role: 'UX Designer', company: 'Airbnb', column: 'scheduled', match: 92 },
  { id: '4', name: 'Emma Watson', role: 'Product Manager', company: 'Stripe', column: 'followup', match: 84 },
  { id: '5', name: 'Liam Smith', role: 'DevOps Lead', company: 'Vercel', column: 'new', match: 91 },
  { id: '6', name: 'Sophia Rodriguez', role: 'Data Scientist', company: 'OpenAI', column: 'closed', match: 97 },
];

const CandidateCard = ({ card }) => (
  <motion.div
    layoutId={card.id}
    className="bg-card border border-border rounded-xl p-4 shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors"
  >
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-2">
        <GripVertical size={14} className="text-muted-foreground" />
        <h5 className="font-bold text-sm">{card.name}</h5>
      </div>
      <Badge variant="primary" className="text-[10px] px-1">{card.match}%</Badge>
    </div>
    
    <div className="space-y-1 mb-4">
      <p className="text-xs text-muted-foreground flex items-center gap-1">
        <Briefcase size={12} /> {card.role}
      </p>
      <p className="text-[10px] text-muted-foreground pl-4">at {card.company}</p>
    </div>

    <div className="flex justify-between items-center pt-3 border-t border-border">
      <div className="flex -space-x-1.5">
        <div className="w-5 h-5 rounded-full bg-blue-500 border border-card flex items-center justify-center text-[8px] text-white">R</div>
        <div className="w-5 h-5 rounded-full bg-purple-500 border border-card flex items-center justify-center text-[8px] text-white">A</div>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <div className="flex items-center gap-1 text-[10px]">
          <MessageSquare size={10} /> 2
        </div>
        <div className="flex items-center gap-1 text-[10px]">
          <Calendar size={10} /> 12 May
        </div>
      </div>
    </div>
  </motion.div>
);

const Pipeline = () => {
  const [cards, setCards] = useState(initialCards);

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recruitment Pipeline</h1>
          <p className="text-muted-foreground mt-1">Track candidate progress across stages.</p>
        </div>
        <div className="flex gap-3">
          {cards.length > 0 && (
            <ExportDropdown 
              data={cards.map(c => ({
                Name: c.name,
                Role: c.role,
                Company: c.company,
                Stage: pipelineColumns.find(col => col.id === c.column)?.title || c.column,
                Match: c.match
              }))}
              fileName="recruitment_pipeline"
              title="Hiring Pipeline Status Report"
            />
          )}
          <div className="flex items-center bg-muted rounded-xl px-3 border border-border">
            <Search size={16} className="text-muted-foreground mr-2" />
            <input type="text" placeholder="Filter pipeline..." className="bg-transparent border-none outline-none py-2 text-sm w-40" />
          </div>
          <Button variant="primary" icon={Plus}>Add Candidate</Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex gap-6 h-full min-w-max">
          {pipelineColumns.map((column) => (
            <div key={column.id} className="w-80 flex flex-col bg-muted/30 rounded-2xl border border-border overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${column.color}`} />
                  <h4 className="font-bold text-sm uppercase tracking-wider">{column.title}</h4>
                  <span className="text-xs text-muted-foreground ml-1">
                    ({cards.filter(c => c.column === column.id).length})
                  </span>
                </div>
                <button className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground">
                  <Plus size={16} />
                </button>
              </div>

              <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
                {cards
                  .filter(card => card.column === column.id)
                  .map(card => (
                    <CandidateCard key={card.id} card={card} />
                  ))
                }
                
                {cards.filter(c => c.column === column.id).length === 0 && (
                  <div className="h-24 border-2 border-dashed border-border rounded-xl flex items-center justify-center text-muted-foreground text-xs italic">
                    No candidates here
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pipeline;
