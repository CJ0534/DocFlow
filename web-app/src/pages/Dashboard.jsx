import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiGrid, FiFolder, FiFileText, FiPlus, FiSettings, FiLogOut, FiSearch, FiMoreVertical, FiCopy, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('organizations');
    const [organizations, setOrganizations] = useState([]);
    const [activeMenu, setActiveMenu] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // Load organizations from Supabase
    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const { data, error } = await supabase
                    .from('organizations')
                    .select('*, projects(count)')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                // Transform data to include project count flattened
                const orgsWithCount = data.map(org => ({
                    ...org,
                    projects: org.projects?.[0]?.count || 0
                }));

                setOrganizations(orgsWithCount);
            } catch (error) {
                console.error('Error fetching organizations:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrganizations();
        }
    }, [user]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveMenu(null);
        if (activeMenu) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [activeMenu]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleDuplicate = async (org, e) => {
        e.stopPropagation();
        try {
            const { data, error } = await supabase.from('organizations').insert([{
                user_id: user.id,
                name: `${org.name} (Copy)`,
                type: org.type,
                team_strength: org.teamStrength, // Note: DB column is team_strength
                logo: org.logo
            }]).select();

            if (error) throw error;

            setOrganizations([...organizations, { ...data[0], projects: 0 }]);
        } catch (error) {
            console.error('Error duplicating organization:', error);
            alert('Failed to duplicate organization');
        }
        setActiveMenu(null);
    };

    const handleRename = async (org, e) => {
        e.stopPropagation();
        const newName = prompt('Enter new organization name:', org.name);
        if (newName && newName.trim() !== '') {
            try {
                const { error } = await supabase
                    .from('organizations')
                    .update({ name: newName.trim() })
                    .eq('id', org.id);

                if (error) throw error;

                setOrganizations(organizations.map(o =>
                    o.id === org.id ? { ...o, name: newName.trim() } : o
                ));
            } catch (error) {
                console.error('Error renaming organization:', error);
                alert('Failed to rename organization');
            }
        }
        setActiveMenu(null);
    };

    const handleDelete = async (orgId, e) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this organization?')) {
            try {
                const { error } = await supabase
                    .from('organizations')
                    .delete()
                    .eq('id', orgId);

                if (error) throw error;

                setOrganizations(organizations.filter(o => o.id !== orgId));
            } catch (error) {
                console.error('Error deleting organization:', error);
                alert('Failed to delete organization');
            }
        }
        setActiveMenu(null);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <div className="glass-card" style={{
                width: '280px',
                margin: '1rem',
                borderRadius: '24px',
                padding: '2rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 10
            }}>
                <div style={{ marginBottom: '3rem', paddingLeft: '0.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>DocFlow</h2>
                </div>

                <nav style={{ flex: 1 }}>
                    <SidebarItem
                        icon={<FiGrid />}
                        label="Organizations"
                        active={activeTab === 'organizations'}
                        onClick={() => setActiveTab('organizations')}
                    />
                    <SidebarItem
                        icon={<FiFolder />}
                        label="Recent Projects"
                        active={activeTab === 'projects'}
                        onClick={() => setActiveTab('projects')}
                    />
                    <SidebarItem
                        icon={<FiFileText />}
                        label="All Documents"
                        active={activeTab === 'documents'}
                        onClick={() => setActiveTab('documents')}
                    />

                    <div style={{ margin: '2rem 0', height: '1px', background: 'var(--glass-border)' }} />

                    <SidebarItem icon={<FiSettings />} label="Settings" onClick={() => navigate('/settings')} />
                </nav>

                <SidebarItem icon={<FiLogOut />} label="Logout" color="var(--error)" onClick={handleLogout} />
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '2rem 2rem 2rem 1rem', overflowY: 'auto' }}>
                <header style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '3rem'
                }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Dashboard</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Manage your workspace and documents</p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ position: 'relative' }}>
                            <FiSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="text"
                                placeholder="Search everything..."
                                style={{
                                    padding: '0.75rem 1rem 0.75rem 2.8rem',
                                    background: 'var(--glass)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '12px',
                                    color: 'white',
                                    width: '300px'
                                }}
                            />
                        </div>
                        <button
                            onClick={() => navigate('/org-setup')}
                            style={{
                                background: 'var(--primary)',
                                color: 'white',
                                padding: '0 1.5rem',
                                borderRadius: '12px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                border: 'none',
                                cursor: 'pointer'
                            }}>
                            <FiPlus /> New Organization
                        </button>
                    </div>
                </header>

                <section className="animate-fade">
                    {organizations.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '4rem 2rem',
                            color: 'var(--text-secondary)'
                        }}>
                            <FiGrid size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'white' }}>No Organizations Yet</h3>
                            <p>Click "New Organization" to create your first organization</p>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '1.5rem'
                        }}>
                            {organizations.map(org => (
                                <div
                                    key={org.id}
                                    className="glass-card"
                                    style={{
                                        padding: '1.5rem',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s',
                                        hover: { transform: 'translateY(-5px)' },
                                        position: 'relative'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    {/* Menu Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveMenu(activeMenu === org.id ? null : org.id);
                                        }}
                                        style={{
                                            position: 'absolute',
                                            top: '1rem',
                                            right: '1rem',
                                            background: 'rgba(255,255,255,0.1)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            padding: '0.5rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                    >
                                        <FiMoreVertical size={18} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {activeMenu === org.id && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: '3.5rem',
                                                right: '1rem',
                                                background: 'rgba(20, 20, 40, 0.95)',
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid var(--glass-border)',
                                                borderRadius: '12px',
                                                padding: '0.5rem',
                                                zIndex: 10,
                                                minWidth: '160px',
                                                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                                            }}
                                        >
                                            <button
                                                onClick={(e) => handleDuplicate(org, e)}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem 1rem',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: 'white',
                                                    textAlign: 'left',
                                                    cursor: 'pointer',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.75rem',
                                                    fontSize: '0.9rem',
                                                    transition: 'background 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <FiCopy size={16} />
                                                <span>Duplicate</span>
                                            </button>
                                            <button
                                                onClick={(e) => handleRename(org, e)}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem 1rem',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: 'white',
                                                    textAlign: 'left',
                                                    cursor: 'pointer',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.75rem',
                                                    fontSize: '0.9rem',
                                                    transition: 'background 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <FiEdit2 size={16} />
                                                <span>Rename</span>
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(org.id, e)}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem 1rem',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: '#ef4444',
                                                    textAlign: 'left',
                                                    cursor: 'pointer',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.75rem',
                                                    fontSize: '0.9rem',
                                                    transition: 'background 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <FiTrash2 size={16} />
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    )}

                                    <div
                                        onClick={() => navigate(`/org/${org.id}`)}
                                        style={{ paddingTop: '2rem' }}
                                    >
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            background: 'rgba(37, 99, 235, 0.1)',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--primary)',
                                            marginBottom: '1rem',
                                            overflow: 'hidden'
                                        }}>
                                            {org.logo ? (
                                                <img
                                                    src={org.logo}
                                                    alt={org.name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <FiGrid size={24} />
                                            )}
                                        </div>
                                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{org.name}</h3>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{org.projects || 0} projects active</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

const SidebarItem = ({ icon, label, active, onClick, color }) => (
    <div
        onClick={onClick}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.85rem 1rem',
            borderRadius: '12px',
            cursor: 'pointer',
            marginBottom: '0.5rem',
            background: active ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
            color: color || (active ? 'white' : 'var(--text-secondary)'),
            transition: 'all 0.2s',
            fontWeight: active ? '600' : '400'
        }}
        onMouseEnter={(e) => !active && (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)')}
        onMouseLeave={(e) => !active && (e.currentTarget.style.backgroundColor = 'transparent')}
    >
        <span style={{ fontSize: '1.2rem' }}>{icon}</span>
        <span>{label}</span>
    </div>
);

export default Dashboard;
