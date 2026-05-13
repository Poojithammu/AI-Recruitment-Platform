import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import AppLayout from './layouts/AppLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Settings from './pages/Settings';

// Dashboards
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import CandidateManagement from './pages/admin/CandidateManagement';
import RecruiterManagement from './pages/admin/RecruiterManagement';
import JobManagement from './pages/admin/JobManagement';
// Recruiter Module
import RecruiterLayout from './pages/recruiter/layout/RecruiterLayout';
import { 
  RecruiterDashboard, 
  CompanyForm,
  RecruiterJobs, 
  PostJob,
  JobDetails,
  RecruiterCandidates, 
  RecruiterPipeline, 
  RecruiterRequirementAI, 
  CompanyIntelligence, 
  CompanyDetails,
  LeadScoring, 
  OutreachAutomation, 
  SavedSearches, 
  ReportsAnalytics, 
  NotificationsCenter, 
  ProfileSettings 
} from './pages/recruiter';

import AnalystDashboard from './pages/analyst/AnalystDashboard';
import UserDashboard from './pages/user/UserDashboard';
import JobExplorer from './pages/user/JobExplorer';
import ResumeScrutinizer from './pages/user/ResumeScrutinizer';
import CompanyExplorer from './pages/user/CompanyExplorer';

// Other Pages
import ProfileSetup from './pages/ProfileSetup';
import RequirementExtraction from './pages/RequirementExtraction';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleProtectedRoute from './components/common/RoleProtectedRoute';
import RootRedirect from './components/common/RootRedirect';

function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#141414',
          color: '#fff',
          border: '1px solid #262626',
          borderRadius: '12px'
        },
      }} />
      <Router>
        <Routes>
          {/* Root Redirect Logic */}
          <Route path="/" element={<RootRedirect />} />
          
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          {/* Protected Main Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile-setup" element={<ProfileSetup />} />
            
            {/* Recruiter Routes */}
            <Route element={<RoleProtectedRoute allowedRoles={['recruiter']} />}>
              <Route element={<RecruiterLayout />}>
                <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
                <Route path="/recruiter/companies" element={<CompanyIntelligence />} />
                <Route path="/recruiter/companies/new" element={<CompanyForm />} />
                <Route path="/recruiter/companies/edit/:id" element={<CompanyForm />} />
                <Route path="/recruiter/companies/:id" element={<CompanyDetails />} />
                <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
                <Route path="/recruiter/jobs/new" element={<PostJob />} />
                <Route path="/recruiter/jobs/:id" element={<JobDetails />} />
                <Route path="/recruiter/candidates" element={<RecruiterCandidates />} />
                <Route path="/recruiter/pipeline" element={<RecruiterPipeline />} />
                <Route path="/recruiter/requirements" element={<RecruiterRequirementAI />} />
                <Route path="/recruiter/lead-scoring" element={<LeadScoring />} />
                <Route path="/recruiter/outreach" element={<OutreachAutomation />} />
                <Route path="/recruiter/searches" element={<SavedSearches />} />
                <Route path="/recruiter/reports" element={<ReportsAnalytics />} />
                <Route path="/recruiter/notifications" element={<NotificationsCenter />} />
                <Route path="/recruiter/settings" element={<ProfileSettings />} />
              </Route>
            </Route>

            {/* App Content with Sidebar/Navbar */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<RootRedirect />} />
              
              {/* Role-specific dashboards */}
              <Route element={<RoleProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/candidates" element={<CandidateManagement />} />
                <Route path="/admin/recruiters" element={<RecruiterManagement />} />
                <Route path="/admin/jobs" element={<JobManagement />} />
              </Route>
              
              <Route element={<RoleProtectedRoute allowedRoles={['analyst']} />}>
                <Route path="/analyst/dashboard" element={<AnalystDashboard />} />
              </Route>

              <Route element={<RoleProtectedRoute allowedRoles={['user']} />}>
                <Route path="/user/dashboard" element={<UserDashboard />} />
                <Route path="/user/jobs" element={<JobExplorer />} />
                <Route path="/user/companies" element={<CompanyExplorer />} />
                <Route path="/user/resume-scrutinizer" element={<ResumeScrutinizer />} />
              </Route>

              {/* Shared Protected Routes */}
              <Route path="/profile" element={<Settings />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Fallback Routes */}
          <Route path="/unauthorized" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-3xl font-bold">403 - Unauthorized Access</h1></div>} />
          <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-3xl font-bold">404 - Page Not Found</h1></div>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
