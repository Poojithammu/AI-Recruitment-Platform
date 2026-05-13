import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Bell,
  Mail,
  Lock,
  Save,
  Camera,
  CreditCard,
  Building2,
  MapPin,
  Globe
} from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import api from '../../api';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../features/auth/authSlice';

const Settings = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('Profile');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: '',
    designation: '',
    linkedInUrl: '',
    officeLocation: '',
    hiringFocus: ''
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        // Fetch user basic info (already in useAuth, but let's be sure)
        const authRes = await api.get('/auth/me');
        const profileRes = await api.get('/profiles/me');
        
        const userData = authRes.data.user;
        const profileData = profileRes.data;
        
        setFormData({
          fullName: userData.fullName || '',
          email: userData.email || '',
          companyName: profileData.companyName || '',
          designation: profileData.designation || '',
          linkedInUrl: profileData.linkedInUrl || '',
          officeLocation: profileData.officeLocation || '',
          hiringFocus: profileData.hiringFocus?.join(', ') || ''
        });
      } catch (error) {
        console.error('Error fetching profile data:', error);
        if (error.response?.status !== 404) {
          toast.error('Failed to load profile settings');
        } else {
          // If profile 404s, just set user data
          setFormData(prev => ({
            ...prev,
            fullName: user?.fullName || '',
            email: user?.email || ''
          }));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      // 1. Update basic user info
      const userUpdateRes = await api.put('/auth/me', {
        fullName: formData.fullName,
        email: formData.email
      });
      
      // 2. Update recruiter profile info
      const profilePayload = {
        companyName: formData.companyName,
        designation: formData.designation,
        linkedInUrl: formData.linkedInUrl,
        officeLocation: formData.officeLocation,
        hiringFocus: formData.hiringFocus.split(',').map(s => s.trim()).filter(s => s !== '')
      };
      
      await api.post('/profiles', profilePayload);
      
      // Update global user state
      if (userUpdateRes.data.success) {
        dispatch(updateUser(userUpdateRes.data.user));
      }
      
      toast.success('Settings updated successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error(error.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-20 text-center">Loading your settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10 animate-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your profile, organization, and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation */}
        <div className="space-y-1">
          {[
            { icon: User, label: 'Profile' },
            { icon: Shield, label: 'Security' },
            { icon: Bell, label: 'Notifications' },
            { icon: Mail, label: 'Outreach' },
            { icon: CreditCard, label: 'Billing' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.label
                  ? 'bg-primary/10 text-primary shadow-sm'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'Profile' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                      {formData.fullName?.charAt(0) || 'U'}
                    </div>
                    <button type="button" className="absolute -bottom-2 -right-2 p-2 bg-card border border-border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera size={16} />
                    </button>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold">{formData.fullName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formData.designation} at {formData.companyName || 'Not specified'}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase tracking-wider">
                        Enterprise Plan
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full bg-muted border border-border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-muted border border-border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Company Name
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full bg-muted border border-border rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Designation
                    </label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      className="w-full bg-muted border border-border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      LinkedIn URL
                    </label>
                    <div className="relative">
                      <FaLinkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0077b5]" size={16} />
                      <input
                        type="text"
                        name="linkedInUrl"
                        value={formData.linkedInUrl}
                        onChange={handleChange}
                        className="w-full bg-muted border border-border rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Office Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <input
                        type="text"
                        name="officeLocation"
                        value={formData.officeLocation}
                        onChange={handleChange}
                        className="w-full bg-muted border border-border rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Hiring Focus (Comma separated)
                  </label>
                  <input
                    type="text"
                    name="hiringFocus"
                    value={formData.hiringFocus}
                    onChange={handleChange}
                    placeholder="e.g. Frontend, Backend, AI"
                    className="w-full bg-muted border border-border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>

                <div className="mt-8 pt-8 border-t border-border flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => window.location.reload()}>Cancel</Button>
                  <Button type="submit" variant="primary" icon={Save} loading={saving}>
                    Save Changes
                  </Button>
                </div>
              </Card>
            </form>
          )}

          {activeTab === 'Security' && (
            <Card>
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Lock size={20} className="text-primary" />
                Password & Security
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-muted border border-border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Min. 8 characters"
                      className="w-full bg-muted border border-border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Repeat password"
                      className="w-full bg-muted border border-border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
              </div>

              <Button variant="outline" className="mt-6">
                Update Password
              </Button>
            </Card>
          )}

          <Card className="bg-red-500/5 border-red-500/10">
            <h3 className="font-bold text-lg text-red-500 mb-2">Danger Zone</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Deleting your account is permanent and cannot be undone.
            </p>

            <Button
              variant="outline"
              className="text-red-500 border-red-500/20 hover:bg-red-500/10"
            >
              Delete Account
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;