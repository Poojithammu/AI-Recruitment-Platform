import React from "react";
import {
  Users,
  Briefcase,
  Mail,
  TrendingUp,
  Search,
  Bell,
  UserCheck,
  Calendar,
  Building2,
  ArrowUpRight,
  Send,
  Bot,
  Clock,
  MapPin,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import ExportDropdown from "../components/ui/ExportDropdown";

const hiringPipelineData = [
  { month: "Jan", candidates: 35 },
  { month: "Feb", candidates: 48 },
  { month: "Mar", candidates: 62 },
  { month: "Apr", candidates: 85 },
  { month: "May", candidates: 73 },
  { month: "Jun", candidates: 96 },
];

const roleDemandData = [
  { role: "Frontend", demand: 82 },
  { role: "Backend", demand: 75 },
  { role: "Full Stack", demand: 95 },
  { role: "AI/ML", demand: 68 },
  { role: "DevOps", demand: 58 },
];

const outreachData = [
  { name: "Emails Sent", value: 52 },
  { name: "Responses", value: 21 },
  { name: "Interviews", value: 9 },
  { name: "Offers", value: 4 },
];

const COLORS = ["#6366f1", "#06b6d4", "#22c55e", "#f59e0b"];

const candidates = [
  {
    name: "Rahul Sharma",
    role: "MERN Stack Developer",
    location: "Hyderabad",
    experience: "2 Years",
    status: "Shortlisted",
  },
  {
    name: "Priya Verma",
    role: "React Developer",
    location: "Bangalore",
    experience: "1 Year",
    status: "Interview Scheduled",
  },
  {
    name: "Arjun Reddy",
    role: "Node.js Developer",
    location: "Remote",
    experience: "3 Years",
    status: "New",
  },
];

const recentJobs = [
  {
    company: "Infosys",
    role: "Full Stack Developer",
    applicants: 46,
    deadline: "May 20",
  },
  {
    company: "TCS",
    role: "Frontend Engineer",
    applicants: 31,
    deadline: "May 18",
  },
  {
    company: "Wipro",
    role: "Backend Developer",
    applicants: 28,
    deadline: "May 25",
  },
];

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg hover:scale-[1.02] transition-all">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-slate-400 text-sm">{title}</p>
        <h3 className="text-2xl font-bold text-white mt-2">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="text-white" size={22} />
      </div>
    </div>
  </div>
);

const RecruiterDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
          <p className="text-slate-400 mt-2">
            Recruitment pipeline intelligence and hiring operations
          </p>
        </div>

        <div className="flex gap-3">
          <button className="bg-slate-900 border border-slate-800 p-3 rounded-xl hover:bg-slate-800 transition">
            <Bell size={20} />
          </button>

          <button className="bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-xl flex items-center gap-2 transition">
            <Search size={18} />
            Find Candidates
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Active Candidates"
          value="248"
          icon={Users}
          color="bg-indigo-600"
        />
        <StatCard
          title="Open Positions"
          value="32"
          icon={Briefcase}
          color="bg-cyan-600"
        />
        <StatCard
          title="Outreach Campaigns"
          value="14"
          icon={Mail}
          color="bg-purple-600"
        />
        <StatCard
          title="Placement Rate"
          value="78%"
          icon={TrendingUp}
          color="bg-green-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
        {/* Hiring Pipeline */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold">Hiring Pipeline Growth</h2>
            <ExportDropdown 
              data={hiringPipelineData.map(d => ({ Month: d.month, Candidates: d.candidates }))}
              fileName="hiring_pipeline"
              title="Hiring Pipeline Growth Data"
            />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={hiringPipelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="candidates"
                stroke="#6366f1"
                fill="#6366f1"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Role Demand */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold">Role Demand Analytics</h2>
            <ExportDropdown 
              data={roleDemandData.map(d => ({ Role: d.role, Demand: d.demand }))}
              fileName="role_demand"
              title="Role Demand Analytics Data"
            />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roleDemandData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="role" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="demand" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
        {/* Candidates */}
        <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold">Top Candidates</h2>
            <div className="flex items-center gap-3">
              <ExportDropdown 
                data={candidates.map(c => ({ Name: c.name, Role: c.role, Location: c.location, Experience: c.experience, Status: c.status }))}
                fileName="top_candidates"
                title="Top Candidates List"
              />
              <button className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                View All <ArrowUpRight size={16} />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {candidates.map((candidate, index) => (
              <div
                key={index}
                className="border border-slate-800 rounded-xl p-5 hover:bg-slate-800 transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{candidate.name}</h3>
                    <p className="text-slate-400">{candidate.role}</p>

                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-300">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {candidate.location}
                      </span>
                      <span>{candidate.experience}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 lg:items-end">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        candidate.status === "Shortlisted"
                          ? "bg-green-500/20 text-green-400"
                          : candidate.status === "Interview Scheduled"
                          ? "bg-cyan-500/20 text-cyan-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {candidate.status}
                    </span>

                    <button className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Outreach Funnel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold">Outreach Funnel</h2>
            <ExportDropdown 
              data={outreachData.map(d => ({ Stage: d.name, Count: d.value }))}
              fileName="outreach_funnel"
              title="Outreach Funnel Performance"
            />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={outreachData}
                cx="50%"
                cy="50%"
                outerRadius={95}
                dataKey="value"
                label
              >
                {outreachData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
        {/* AI Assistant */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-3 bg-indigo-600 rounded-xl">
              <Bot />
            </div>
            <div>
              <h2 className="text-xl font-semibold">AI Recruiter Assistant</h2>
              <p className="text-slate-400 text-sm">
                Candidate intelligence and hiring recommendations
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-800 rounded-xl p-4">
              <p className="text-slate-300">
                AI detected increased demand for Full Stack developers in
                Hyderabad this week.
              </p>
            </div>

            <div className="bg-slate-800 rounded-xl p-4">
              <p className="text-slate-300">
                12 candidates match your Node.js openings with 85%+ compatibility.
              </p>
            </div>

            <button className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl flex items-center justify-center gap-2 transition">
              <Bot size={18} />
              Open AI Assistant
            </button>
          </div>
        </div>

        {/* Open Jobs */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold">Active Job Openings</h2>
            <ExportDropdown 
              data={recentJobs.map(j => ({ Role: j.role, Company: j.company, Applicants: j.applicants, Deadline: j.deadline }))}
              fileName="active_jobs"
              title="Active Job Openings Overview"
            />
          </div>

          <div className="space-y-4">
            {recentJobs.map((job, index) => (
              <div
                key={index}
                className="border border-slate-800 rounded-xl p-4 hover:bg-slate-800 transition"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-semibold">{job.role}</h3>
                    <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
                      <Building2 size={14} />
                      {job.company}
                    </p>

                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-300">
                      <span className="flex items-center gap-1">
                        <UserCheck size={14} />
                        {job.applicants} Applicants
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        Deadline: {job.deadline}
                      </span>
                    </div>
                  </div>

                  <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg flex items-center gap-2">
                    <Send size={16} />
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;