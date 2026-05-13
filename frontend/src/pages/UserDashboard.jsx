import React from "react";
import {
  Building2,
  Briefcase,
  UserSearch,
  TrendingUp,
  Search,
  Bookmark,
  Bell,
  Bot,
  MapPin,
  Calendar,
  Sparkles,
  ArrowUpRight,
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

const hiringTrendData = [
  { month: "Jan", jobs: 40 },
  { month: "Feb", jobs: 65 },
  { month: "Mar", jobs: 90 },
  { month: "Apr", jobs: 120 },
  { month: "May", jobs: 110 },
  { month: "Jun", jobs: 160 },
];

const skillsData = [
  { skill: "React", demand: 88 },
  { skill: "Node.js", demand: 75 },
  { skill: "Python", demand: 92 },
  { skill: "AWS", demand: 61 },
  { skill: "MongoDB", demand: 70 },
];

const jobTypeData = [
  { name: "Full Time", value: 58 },
  { name: "Internships", value: 22 },
  { name: "Remote", value: 14 },
  { name: "Contract", value: 6 },
];

const COLORS = ["#6366f1", "#06b6d4", "#22c55e", "#f59e0b"];

const recommendedJobs = [
  {
    company: "Infosys",
    role: "MERN Stack Developer",
    location: "Hyderabad",
    experience: "1-3 Years",
    posted: "2 days ago",
  },
  {
    company: "TCS",
    role: "Frontend React Developer",
    location: "Bangalore",
    experience: "0-2 Years",
    posted: "1 day ago",
  },
  {
    company: "Tech Mahindra",
    role: "Node.js Developer",
    location: "Remote",
    experience: "2-4 Years",
    posted: "Today",
  },
];

const savedCompanies = [
  "Google",
  "Microsoft",
  "Amazon",
  "Zoho",
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

const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">User Dashboard</h1>
          <p className="text-slate-400 mt-2">
            AI-powered hiring intelligence personalized for you
          </p>
        </div>

        <div className="flex gap-3">
          <button className="bg-slate-900 border border-slate-800 p-3 rounded-xl hover:bg-slate-800 transition">
            <Bell size={20} />
          </button>

          <button className="bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-xl flex items-center gap-2 transition">
            <Search size={18} />
            Search Jobs
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Recommended Jobs"
          value="126"
          icon={Briefcase}
          color="bg-indigo-600"
        />
        <StatCard
          title="Saved Companies"
          value="18"
          icon={Building2}
          color="bg-cyan-600"
        />
        <StatCard
          title="Recruiters Available"
          value="92"
          icon={UserSearch}
          color="bg-purple-600"
        />
        <StatCard
          title="Hiring Growth"
          value="+24%"
          icon={TrendingUp}
          color="bg-green-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
        {/* Hiring Trend */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-5">Hiring Trend Insights</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={hiringTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="jobs"
                stroke="#6366f1"
                fill="#6366f1"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Skill Demand */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-5">Top Skill Demand</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="skill" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="demand" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
        {/* Recommended Jobs */}
        <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold">Recommended Jobs</h2>
            <button className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              View All <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="space-y-4">
            {recommendedJobs.map((job, index) => (
              <div
                key={index}
                className="border border-slate-800 rounded-xl p-5 hover:bg-slate-800 transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{job.role}</h3>
                    <p className="text-slate-400">{job.company}</p>

                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-300">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {job.location}
                      </span>
                      <span>{job.experience}</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {job.posted}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="bg-slate-700 hover:bg-slate-600 p-3 rounded-lg">
                      <Bookmark size={18} />
                    </button>
                    <button className="bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-lg">
                      View Job
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Job Type */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-5">Opportunity Distribution</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={jobTypeData}
                cx="50%"
                cy="50%"
                outerRadius={95}
                dataKey="value"
                label
              >
                {jobTypeData.map((entry, index) => (
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
              <h2 className="text-xl font-semibold">AI Career Assistant</h2>
              <p className="text-slate-400 text-sm">
                Personalized recommendations powered by AI
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-800 rounded-xl p-4">
              <p className="text-slate-300">
                Based on your MERN stack profile, React and Node.js roles are
                trending this week.
              </p>
            </div>

            <div className="bg-slate-800 rounded-xl p-4">
              <p className="text-slate-300">
                AI recommends improving AWS and Docker skills to increase job
                match score.
              </p>
            </div>

            <button className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl flex items-center justify-center gap-2 transition">
              <Sparkles size={18} />
              Ask AI Assistant
            </button>
          </div>
        </div>

        {/* Saved Companies */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-5">Saved Companies</h2>

          <div className="space-y-4">
            {savedCompanies.map((company, index) => (
              <div
                key={index}
                className="flex items-center justify-between border border-slate-800 rounded-xl p-4 hover:bg-slate-800 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-cyan-600 rounded-xl">
                    <Building2 size={18} />
                  </div>
                  <span className="font-medium">{company}</span>
                </div>

                <button className="text-indigo-400 hover:text-indigo-300">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;