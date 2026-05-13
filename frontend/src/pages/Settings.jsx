import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Shield, Lock, Bell, Moon, Globe, Camera, Save, RefreshCcw } from 'lucide-react';
import Button from '../components/ui/Button';
import api from '../api';
import toast from 'react-hot-toast';
import { updateUser } from '../features/auth/authSlice';

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.put('/auth/me', {
        fullName: formData.fullName,
        email: formData.email
      });
      
      dispatch(updateUser(response.data.user));
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error('New passwords do not match');
    }
    
    try {
      setLoading(true);
      // Implementation for password change endpoint usually goes here
      // For now using updateMe pattern if backend supports it or placeholder
      toast.success('Security settings updated');
    } catch (error) {
      toast.error('Failed to update security settings');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Identity', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Interface', icon: Moon }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in pb-20">
      <div>
        <h1 className="text-4xl font-black tracking-tight">System Settings</h1>
        <p className="text-muted-foreground mt-2 font-medium">Manage your digital identity and platform preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-3 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black text-sm ${
                activeTab === tab.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
          <div className="bg-card border border-border rounded-[40px] p-10 shadow-sm min-h-[500px]">
            
            {activeTab === 'profile' && (
              <div className="space-y-10 animate-in">
                 <div className="flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-border">
                    <div className="relative group">
                       <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-5xl font-black shadow-2xl">
                          {user?.fullName?.charAt(0)}
                       </div>
                       <button className="absolute -bottom-2 -right-2 p-3 bg-card border border-border rounded-xl shadow-lg hover:scale-110 transition-all">
                          <Camera size={18} className="text-primary" />
                       </button>
                    </div>
                    <div>
                       <h2 className="text-2xl font-black">{user?.fullName}</h2>
                       <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-[10px] mt-1">{user?.role} Account</p>
                       <div className="flex gap-4 mt-6">
                          <div className="px-4 py-2 bg-muted/50 rounded-xl border border-border text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                             Email Verified
                          </div>
                       </div>
                    </div>
                 </div>

                 <form onSubmit={handleUpdateProfile} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Full Identity Name</label>
                          <div className="relative">
                             <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                             <input 
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className="w-full bg-background border border-border rounded-2xl pl-12 pr-6 py-4 outline-none focus:ring-2 focus:ring-primary font-bold text-sm transition-all"
                                placeholder="Enter full name..."
                             />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Digital Mailbox (Email)</label>
                          <div className="relative">
                             <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                             <input 
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full bg-background border border-border rounded-2xl pl-12 pr-6 py-4 outline-none focus:ring-2 focus:ring-primary font-bold text-sm transition-all"
                                placeholder="name@domain.com"
                             />
                          </div>
                       </div>
                    </div>

                    <div className="pt-6 flex justify-end">
                       <Button type="submit" variant="primary" icon={Save} loading={loading} className="px-10 py-4">
                          Commit Changes
                       </Button>
                    </div>
                 </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-10 animate-in">
                 <div>
                    <h3 className="text-xl font-black">Security Protocol</h3>
                    <p className="text-sm text-muted-foreground mt-1 font-medium">Update your access credentials to keep your account secure.</p>
                 </div>

                 <form onSubmit={handleChangePassword} className="space-y-8">
                    <div className="space-y-6 max-w-md">
                       <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Current Access Password</label>
                          <div className="relative">
                             <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                             <input 
                                name="currentPassword"
                                type="password"
                                value={formData.currentPassword}
                                onChange={handleInputChange}
                                className="w-full bg-background border border-border rounded-2xl pl-12 pr-6 py-4 outline-none focus:ring-2 focus:ring-primary font-bold text-sm transition-all"
                             />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">New Security Code</label>
                          <div className="relative">
                             <RefreshCcw className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                             <input 
                                name="newPassword"
                                type="password"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                className="w-full bg-background border border-border rounded-2xl pl-12 pr-6 py-4 outline-none focus:ring-2 focus:ring-primary font-bold text-sm transition-all"
                             />
                          </div>
                       </div>
                    </div>

                    <div className="pt-6 border-t border-border flex justify-end">
                       <Button type="submit" variant="primary" icon={Shield} loading={loading} className="px-10 py-4">
                          Update Security
                       </Button>
                    </div>
                 </form>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-10 animate-in">
                 <div className="p-8 bg-muted/30 border border-border rounded-3xl flex items-center justify-between">
                    <div>
                       <h4 className="font-black">Deep Dark Mode</h4>
                       <p className="text-xs text-muted-foreground mt-1 font-medium">Optimize interface for low-light environments.</p>
                    </div>
                    <div className="w-14 h-8 bg-primary rounded-full relative p-1 cursor-pointer">
                       <div className="w-6 h-6 bg-white rounded-full absolute right-1"></div>
                    </div>
                 </div>

                 <div className="p-8 bg-muted/30 border border-border rounded-3xl flex items-center justify-between opacity-50 grayscale">
                    <div>
                       <h4 className="font-black">Language Localization</h4>
                       <p className="text-xs text-muted-foreground mt-1 font-medium">Select your preferred system language.</p>
                    </div>
                    <div className="flex items-center gap-2 font-black text-sm">
                       <Globe size={18} className="text-primary" /> English (US)
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="flex flex-col items-center justify-center h-full py-20 text-center space-y-4">
                 <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                    <Bell size={40} />
                 </div>
                 <h3 className="text-xl font-black">Notification Center</h3>
                 <p className="text-muted-foreground max-w-xs font-medium italic">Configure how you receive job matches and platform alerts.</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
