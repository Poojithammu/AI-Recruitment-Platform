import React, { useState, useEffect } from 'react';
import DataTable from '../../components/common/DataTable';
import StatCard from '../../components/dashboard/StatCard';
import { Users, UserCheck, UserX, UserPlus, Search, Filter, RefreshCcw, Shield, Mail, Calendar, Key, Info } from 'lucide-react';
import api from '../../api';
import toast from 'react-hot-toast';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

const UserManagement = ({ defaultRole = '', title = 'Identity Management', subtitle = 'Oversee platform users, roles, and security permissions.' }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState(defaultRole);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add', 'edit', 'view'
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'user',
    isActive: true
  });

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (roleFilter) params.role = roleFilter;
      
      const response = await api.get('/admin/users', { params });
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (type, user = null) => {
    setModalType(type);
    setSelectedUser(user);
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        password: '',
        role: user.role || 'user',
        isActive: user.isActive !== undefined ? user.isActive : true
      });
    } else {
      setFormData({
        fullName: '',
        email: '',
        password: '',
        role: defaultRole || 'user',
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'add') {
        await api.post('/auth/register', formData); // Backend usually has register, but admin might need direct create
        // Note: For now using register, but ideally admin has direct POST /api/admin/users
        toast.success('User created successfully');
      } else if (modalType === 'edit') {
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await api.put(`/admin/users/${selectedUser._id}`, updateData);
        toast.success('User updated successfully');
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      const newStatus = !user.isActive;
      await api.put(`/admin/users/${user._id}`, { isActive: newStatus });
      toast.success(`User ${newStatus ? 'activated' : 'deactivated'} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { 
      header: 'User Profile', 
      accessor: 'fullName',
      render: (val, row) => (
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => handleOpenModal('view', row)}>
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm">
            {val.charAt(0)}
          </div>
          <div>
            <p className="font-black text-sm">{val}</p>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5">
              <Mail size={10} />
              {row.email}
            </div>
          </div>
        </div>
      )
    },
    { 
      header: 'Role Authority', 
      accessor: 'role',
      render: (val) => (
        <div className="flex items-center gap-2">
          <Shield size={12} className={val === 'admin' ? 'text-red-500' : 'text-blue-500'} />
          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
            val === 'admin' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
            val === 'recruiter' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
            'bg-green-500/10 text-green-500 border border-green-500/20'
          }`}>
            {val}
          </span>
        </div>
      )
    },
    { 
      header: 'System Status', 
      accessor: 'isActive',
      render: (val, row) => (
        <button 
          onClick={() => handleToggleStatus(row)}
          className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all ${
            val ? 'bg-green-500/5 text-green-500 border-green-500/20' : 'bg-red-500/5 text-red-500 border-red-500/20'
          }`}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${val ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-[10px] font-bold uppercase tracking-tight">{val ? 'Active' : 'Deactivated'}</span>
        </button>
      )
    },
    { 
      header: 'Registration', 
      accessor: 'createdAt',
      render: (val) => (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar size={12} />
          {new Date(val).toLocaleDateString()}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-in pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight">{title}</h1>
          <p className="text-muted-foreground mt-2">{subtitle}</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" icon={RefreshCcw} onClick={fetchUsers} loading={loading}>Sync Data</Button>
          <Button variant="primary" icon={UserPlus} onClick={() => handleOpenModal('add')}>Onboard User</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Identities" value={users.length} icon={Users} color="primary" />
        <StatCard title="Verified Active" value={users.filter(u => u.isActive).length} icon={UserCheck} color="success" />
        <StatCard title="Restricted" value={users.filter(u => !u.isActive).length} icon={UserX} color="danger" />
      </div>

      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-card/50 backdrop-blur-md p-6 rounded-[32px] border border-border/50">
          <div className="relative w-full lg:w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, email or UID..."
              className="w-full pl-12 pr-6 py-3 bg-background border border-border rounded-2xl focus:ring-2 focus:ring-primary transition-all outline-none text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4 w-full lg:w-auto">
             <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-background border border-border rounded-2xl px-6 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary"
             >
                <option value="">All Authorities</option>
                <option value="admin">Administrators</option>
                <option value="recruiter">Recruiters</option>
                <option value="user">Candidates</option>
             </select>
          </div>
        </div>

        <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-sm">
          <DataTable 
            columns={columns} 
            data={filteredUsers} 
            loading={loading}
            onView={(row) => handleOpenModal('view', row)}
            onEdit={(row) => handleOpenModal('edit', row)}
            onDelete={(row) => handleDeleteUser(row._id)}
            pagination={true} 
          />
        </div>
      </div>

      {/* User Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={modalType === 'view' ? 'User Identity Details' : modalType === 'edit' ? 'Modify Identity' : 'Onboard New Identity'}
      >
        {modalType === 'view' ? (
          <div className="space-y-8">
            <div className="flex items-center gap-6 pb-8 border-b border-border">
              <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary text-3xl font-black">
                {selectedUser?.fullName.charAt(0)}
              </div>
              <div>
                <h3 className="text-2xl font-black">{selectedUser?.fullName}</h3>
                <p className="text-muted-foreground flex items-center gap-2 mt-1 font-medium">
                  <Mail size={16} /> {selectedUser?.email}
                </p>
                <div className="flex gap-2 mt-4">
                  <Badge variant="primary">{selectedUser?.role}</Badge>
                  <Badge variant={selectedUser?.isActive ? 'success' : 'danger'}>
                    {selectedUser?.isActive ? 'Active Access' : 'Restricted Access'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">User Unique ID</p>
                <p className="font-mono text-sm bg-muted p-3 rounded-xl border border-border">{selectedUser?._id}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Joined Platform</p>
                <div className="flex items-center gap-2 font-bold">
                  <Calendar size={18} className="text-primary" />
                  {new Date(selectedUser?.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Last Security Sync</p>
                <div className="flex items-center gap-2 font-bold">
                  <Shield size={18} className="text-primary" />
                  {new Date(selectedUser?.updatedAt).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-border flex gap-4">
               <Button variant="outline" onClick={() => handleOpenModal('edit', selectedUser)}>Modify Identity</Button>
               <Button variant="danger" onClick={() => { setIsModalOpen(false); handleDeleteUser(selectedUser._id); }}>Purge User</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Full Legal Name</label>
              <input 
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary transition-all font-bold"
                placeholder="Enter full name..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Email Address</label>
              <input 
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary transition-all font-bold"
                placeholder="user@example.com"
              />
            </div>
            {modalType === 'add' && (
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Access Password</label>
                <div className="relative">
                  <input 
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary transition-all font-bold pr-12"
                    placeholder="••••••••"
                  />
                  <Key size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Platform Authority</label>
                  <select 
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary transition-all font-bold"
                  >
                    <option value="admin">Administrator</option>
                    <option value="recruiter">Recruiter</option>
                    <option value="user">Candidate</option>
                    <option value="analyst">Analyst</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Access Status</label>
                  <div className="flex items-center gap-3 h-full pb-4">
                    <input 
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="w-6 h-6 rounded-lg border-border bg-muted/50 text-primary focus:ring-primary"
                    />
                    <span className="font-bold text-sm">Account Active</span>
                  </div>
               </div>
            </div>

            <div className="pt-6 flex gap-4">
              <Button type="submit" variant="primary" className="flex-1 py-4">
                {modalType === 'add' ? 'Confirm Onboarding' : 'Save Modifications'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Discard</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;
