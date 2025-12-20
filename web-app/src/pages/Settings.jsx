import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiGrid, FiFolder, FiFileText, FiSettings, FiLogOut, FiUser, FiBell, FiHelpCircle, FiEdit2 } from 'react-icons/fi';

const Settings = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    // Initialize with user metadata or defaults
    const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [role, setRole] = useState(user?.user_metadata?.role || 'Developer - Create with code');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Update local state if user object updates (e.g. on fresh load)
    useEffect(() => {
        if (user) {
            setFullName(user.user_metadata?.full_name || '');
            setEmail(user.email || '');
            setRole(user.user_metadata?.role || 'Developer - Create with code');
        }
    }, [user]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleSaveChanges = async () => {
        setLoading(true);
        try {
            // Update profile metadata
            const { error: profileError } = await supabase.auth.updateUser({
                data: { full_name: fullName, role: role }
            });

            if (profileError) throw profileError;

            // Update password if provided
            if (newPassword) {
                const { error: passwordError } = await supabase.auth.updateUser({
                    password: newPassword
                });
                if (passwordError) throw passwordError;
            }

            alert('Changes saved successfully!');
            setNewPassword(''); // Clear password field
        } catch (error) {
            console.error('Error updating settings:', error);
            alert('Failed to save changes: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
            {/* Sidebar */}
            <div style={{
                width: '80px',
                background: 'white',
                borderRight: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '2rem 0'
            }}>
                <div style={{
                    marginBottom: '3rem',
                    width: '40px',
                    height: '40px',
                    background: '#1e3a8a',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                }}>
                    D
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <SidebarIcon icon={<FiGrid />} active onClick={() => navigate('/')} />
                    <SidebarIcon icon={<FiFolder />} onClick={() => navigate('/')} />
                    <SidebarIcon icon={<FiFileText />} onClick={() => navigate('/')} />
                    <SidebarIcon icon={<FiSettings />} active />
                </nav>

                <SidebarIcon icon={<FiLogOut />} onClick={handleLogout} color="#ef4444" />
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '2rem', maxWidth: '900px' }}>
                {/* Header */}
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '0.25rem' }}>
                        Hey {fullName.split(' ')[0]}
                    </h1>
                    <p style={{ color: '#64748b' }}>Let's get some changes done</p>
                </div>

                {/* Settings Navigation */}
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1a1a1a' }}>
                    Settings
                </h2>

                <div style={{
                    display: 'flex',
                    gap: '2rem',
                    borderBottom: '2px solid #e2e8f0',
                    marginBottom: '3rem'
                }}>
                    <TabButton label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                    <TabButton label="Organization" active={activeTab === 'organization'} onClick={() => setActiveTab('organization')} />
                    <TabButton label="Subscription" active={activeTab === 'subscription'} onClick={() => setActiveTab('subscription')} />
                </div>

                {/* Profile Tab Content */}
                {activeTab === 'profile' && (
                    <div>
                        {/* Avatar Section */}
                        <div style={{ display: 'flex', gap: '4rem', marginBottom: '3rem' }}>
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2.5rem'
                                }}>
                                    👨‍💻
                                </div>
                                <button style={{
                                    position: 'absolute',
                                    bottom: '0',
                                    right: '0',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: 'white',
                                    border: '2px solid #1e3a8a',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                }}>
                                    <FiEdit2 size={14} color="#1e3a8a" />
                                </button>
                            </div>

                            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full Name*</label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px',
                                            fontSize: '1rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email Id</label>
                                    <input
                                        type="email"
                                        value={email}
                                        disabled
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            background: '#f8fafc',
                                            color: '#64748b'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div style={{ marginBottom: '3rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>What is your role?</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    fontSize: '1rem'
                                }}
                            >
                                <option>Developer - Create with code</option>
                                <option>Designer - Visual creator</option>
                                <option>Manager - Team leader</option>
                                <option>CEO - Chief Executive</option>
                            </select>
                        </div>

                        {/* Change Password */}
                        <div style={{ marginBottom: '3rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Change Password</h3>
                            <input
                                type="password"
                                placeholder="Enter New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={handleSaveChanges}
                            style={{
                                padding: '1rem 3rem',
                                background: '#1e3a8a',
                                color: 'white',
                                borderRadius: '12px',
                                fontWeight: '600',
                                fontSize: '1rem',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            Save Changes
                        </button>
                    </div>
                )}

                {activeTab === 'organization' && (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                        <p>Organization settings coming soon...</p>
                    </div>
                )}

                {activeTab === 'subscription' && (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                        <p>Subscription settings coming soon...</p>
                    </div>
                )}
            </div>

            {/* Right Panel - AI Chat */}

        </div>
    );
};

const SidebarIcon = ({ icon, active, onClick, color }) => (
    <div
        onClick={onClick}
        style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: active ? '#1e3a8a' : 'transparent',
            color: color || (active ? 'white' : '#64748b'),
            cursor: 'pointer',
            transition: 'all 0.2s'
        }}
    >
        {icon}
    </div>
);

const TabButton = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        style={{
            padding: '0.75rem 0',
            background: 'transparent',
            border: 'none',
            borderBottom: active ? '3px solid #1e3a8a' : '3px solid transparent',
            color: active ? '#1e3a8a' : '#64748b',
            fontWeight: active ? '600' : '400',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'all 0.2s'
        }}
    >
        {label}
    </button>
);

export default Settings;
