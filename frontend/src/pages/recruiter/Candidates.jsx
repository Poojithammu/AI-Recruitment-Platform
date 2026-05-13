import React, { useState } from 'react';
import {
  Search,
  Filter,
  MoreVertical,
  Mail,
  Calendar,
  Eye,
  Star,
  Download
} from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ExportDropdown from '../../components/ui/ExportDropdown';
import { candidates } from '../../services/mockData';

const CandidateCard = ({ candidate }) => (
  <Card className="group hover:border-primary/50 transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary font-bold text-lg border border-primary/10">
          {candidate.name.split(' ').map(n => n[0]).join('')}
        </div>

        <div>
          <h4 className="font-bold text-lg group-hover:text-primary transition-colors">
            {candidate.name}
          </h4>
          <p className="text-sm text-muted-foreground">{candidate.role}</p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <Badge variant="primary" className="text-[10px]">
          Match: {candidate.matchScore}%
        </Badge>
        <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
          {candidate.status}
        </div>
      </div>
    </div>

    <div className="flex flex-wrap gap-1.5 mb-6">
      {candidate.skills.slice(0, 4).map((skill) => (
        <Badge key={skill} variant="muted" className="text-[10px] bg-muted/50">
          {skill}
        </Badge>
      ))}

      {candidate.skills.length > 4 && (
        <span className="text-[10px] text-muted-foreground ml-1">
          +{candidate.skills.length - 4} more
        </span>
      )}
    </div>

    <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-y border-border">
      <div className="text-center">
        <p className="text-[10px] text-muted-foreground uppercase font-bold">
          Experience
        </p>
        <p className="text-sm font-bold mt-1">{candidate.experience}</p>
      </div>

      <div className="text-center border-l border-border">
        <p className="text-[10px] text-muted-foreground uppercase font-bold">
          ATS Score
        </p>
        <p className="text-sm font-bold mt-1 text-green-500">
          {candidate.atsScore}/100
        </p>
      </div>
    </div>

    <div className="flex items-center gap-2">
      <Button variant="primary" size="sm" className="flex-1" icon={Mail}>
        Contact
      </Button>

      <Button variant="outline" size="icon" className="flex-shrink-0" icon={Eye} />
      <Button variant="outline" size="icon" className="flex-shrink-0" icon={Calendar} />
      <Button variant="ghost" size="icon" className="flex-shrink-0" icon={MoreVertical} />
    </div>
  </Card>
);

const Candidates = () => {
  const [view, setView] = useState('grid');

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Candidates</h1>
          <p className="text-muted-foreground mt-1">
            Discover and manage top talent matched by AI.
          </p>
        </div>

        <div className="flex gap-3">
          {candidates.length > 0 && (
            <ExportDropdown 
              data={candidates.map(c => ({
                Name: c.name,
                Role: c.role,
                Experience: c.experience,
                Match: c.matchScore,
                ATS_Score: c.atsScore,
                Status: c.status,
                Skills: c.skills.join(', ')
              }))}
              fileName="candidates_list"
              title="Qualified Candidates Inventory"
            />
          )}

          <Button variant="primary">
            <div className="flex items-center gap-2">
              <FaLinkedin size={18} />
              <span>Sourcing Tool</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="py-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name, skills, role..."
              className="w-full bg-muted border border-border rounded-xl py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center bg-muted rounded-lg p-1 border border-border">
              <button
                onClick={() => setView('grid')}
                className={`p-1.5 rounded-md transition-all ${
                  view === 'grid'
                    ? 'bg-card shadow-sm text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                  <div className="bg-current rounded-[1px]"></div>
                  <div className="bg-current rounded-[1px]"></div>
                  <div className="bg-current rounded-[1px]"></div>
                  <div className="bg-current rounded-[1px]"></div>
                </div>
              </button>

              <button
                onClick={() => setView('list')}
                className={`p-1.5 rounded-md transition-all ${
                  view === 'list'
                    ? 'bg-card shadow-sm text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                <div className="w-4 h-4 flex flex-col gap-0.5">
                  <div className="bg-current h-1 rounded-[1px]"></div>
                  <div className="bg-current h-1 rounded-[1px]"></div>
                  <div className="bg-current h-1 rounded-[1px]"></div>
                </div>
              </button>
            </div>

            <Button variant="outline" size="sm" icon={Filter}>
              Filters
            </Button>

            <Button variant="ghost" size="sm" icon={Star}>
              Favorites
            </Button>
          </div>
        </div>
      </Card>

      {/* Grid View */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}

          {[1, 2, 3].map((i) => (
            <CandidateCard
              key={`m${i}`}
              candidate={{
                ...candidates[0],
                id: `m${i}`,
                name: ['Emma Watson', 'Liam Smith', 'Sophia Rodriguez'][i - 1],
                matchScore: 80 + i * 4,
                status: 'Shortlisted'
              }}
            />
          ))}
        </div>
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">
                    Candidate
                  </th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">
                    Role & Exp
                  </th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">
                    Top Skills
                  </th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">
                    ATS Score
                  </th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">
                    Match %
                  </th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">
                    Status
                  </th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px] text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {[...candidates, ...candidates].map((candidate, i) => (
                  <tr key={i} className="group hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          {candidate.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div className="font-bold">{candidate.name}</div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div>{candidate.role}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {candidate.experience}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {candidate.skills.slice(0, 2).map((s) => (
                          <span
                            key={s}
                            className="px-1.5 py-0.5 bg-muted rounded text-[10px] border border-border"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-6 py-4 font-bold text-green-500">
                      {candidate.atsScore}%
                    </td>

                    <td className="px-6 py-4 font-bold text-primary">
                      {candidate.matchScore}%
                    </td>

                    <td className="px-6 py-4">
                      <Badge variant="muted">{candidate.status}</Badge>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors">
                          <Mail size={16} />
                        </button>

                        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Candidates;