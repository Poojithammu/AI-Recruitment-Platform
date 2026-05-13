import React from "react";
import {
  Users,
  Building2,
  Briefcase,
  UserSearch,
  Bot,
  ShieldCheck,
  Activity,
  FileText,
  Database,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  Line,
  Legend,
} from "recharts";

const hiringTrendData = [
  { month: "Jan", jobs: 120 },
  { month: "Feb", jobs: 180 },
  { month: "Mar", jobs: 240 },
  { month: "Apr", jobs: 300 },
  { month: "May", jobs: 260 },
  { month: "Jun", jobs: 380 },
];

const apiUsageData = [
  { name: "Gemini", requests: 1200 },
  { name: "OpenAI", requests: 900 },
  { name: "Email API", requests: 450 },
  { name: "Scraper API", requests: 1600 },
];

const roleData = [
  { name: "Admins", value: 5 },
  { name: "Recruiters", value: 18 },
  { name: "Analysts", value: 12 },
  { name: "Users", value: 65 },
];

const scrapingData = [
  { name: "Success", value: 82 },
  { name: "Failed", value: 18 },
];

const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#22c55e"];
const SCRAPE_COLORS = ["#22c55e", "#ef4444"];

const recentUsers = [
  {
    name: "Harsha",
    email: "harsha@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    name: "Priya",
    email: "priya@example.com",
    role: "Recruiter",
    status: "Active",
  },
  {
    name: "Rahul",
    email: "rahul@example.com",
    role: "Analyst",
    status: "Pending",
  },
];

const recentScrapers = [
  {
    source: "LinkedIn Jobs",
    jobs: 240,
    status: "Success",
  },
  {
    source: "Indeed",
    jobs: 180,
    status: "Success",
  },
  {
    source: "Naukri",
    jobs: 45,
    status: "Failed",
  },
];

const aiRequests = [
  {
    model: "Gemini",
    task: "Requirement Extraction",
    requests: 320,
  },
  {
    model: "OpenAI",
    task: "Trend Analysis",
    requests: 210,
  },
  {
    model: "Gemini",
    task: "Skill Detection",
    requests: 145,
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

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-slate-400 mt-2">
            AI Hiring Intelligence System Monitoring Panel
          </p>
        </div>

        <button className="mt-4 md:mt-0 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-xl transition">
          <RefreshCw size={18} />
          Refresh Data
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value="100"
          icon={Users}
          color="bg-indigo-600"
        />
        <StatCard
          title="Total Companies"
          value="342"
          icon={Building2}
          color="bg-cyan-600"
        />
        <StatCard
          title="Jobs Scraped"
          value="2,184"
          icon={Briefcase}
          color="bg-green-600"
        />
        <StatCard
          title="Recruiters Found"
          value="786"
          icon={UserSearch}
          color="bg-purple-600"
        />
        <StatCard
          title="AI Requests"
          value="4,562"
          icon={Bot}
          color="bg-pink-600"
        />
        <StatCard
          title="System Health"
          value="99.2%"
          icon={ShieldCheck}
          color="bg-emerald-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
        {/* Hiring Trend */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-5">Hiring Trend Analytics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hiringTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="jobs"
                stroke="#6366f1"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* API Usage */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-5">API Usage</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={apiUsageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="requests" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Role Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-5">User Role Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={roleData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {roleData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Scraping Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-5">Scraping Success Rate</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={scrapingData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {scrapingData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={SCRAPE_COLORS[index]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-5">Quick Actions</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <button className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 p-4 rounded-xl transition">
            <Users />
            Manage Users
          </button>

          <button className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 p-4 rounded-xl transition">
            <Activity />
            Monitor Scrapers
          </button>

          <button className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 p-4 rounded-xl transition">
            <Database />
            API Logs
          </button>

          <button className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 p-4 rounded-xl transition">
            <FileText />
            Generate Reports
          </button>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
        {/* Users */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Users</h2>
          <div className="space-y-4">
            {recentUsers.map((user, index) => (
              <div
                key={index}
                className="border border-slate-800 rounded-xl p-4"
              >
                <p className="font-semibold">{user.name}</p>
                <p className="text-slate-400 text-sm">{user.email}</p>
                <div className="flex justify-between mt-2 text-sm">
                  <span>{user.role}</span>
                  <span
                    className={
                      user.status === "Active"
                        ? "text-green-400"
                        : "text-yellow-400"
                    }
                  >
                    {user.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scraper Logs */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Scraper Logs</h2>
          <div className="space-y-4">
            {recentScrapers.map((scraper, index) => (
              <div
                key={index}
                className="border border-slate-800 rounded-xl p-4"
              >
                <p className="font-semibold">{scraper.source}</p>
                <p className="text-slate-400 text-sm">
                  Jobs Collected: {scraper.jobs}
                </p>
                <p
                  className={`mt-2 text-sm ${
                    scraper.status === "Success"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {scraper.status}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Requests */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">AI Activity</h2>
          <div className="space-y-4">
            {aiRequests.map((req, index) => (
              <div
                key={index}
                className="border border-slate-800 rounded-xl p-4"
              >
                <p className="font-semibold">{req.task}</p>
                <p className="text-slate-400 text-sm">{req.model}</p>
                <p className="text-indigo-400 mt-2">
                  Requests: {req.requests}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;