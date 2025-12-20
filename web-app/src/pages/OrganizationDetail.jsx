import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FiChevronLeft, FiFolder, FiPlus, FiMoreVertical, FiCopy, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { supabase } from '../services/supabase';

const OrganizationDetail = () => {
    const { orgId } = useParams();
    const navigate = useNavigate();
    const [organization, setOrganization] = useState(null);
    const [projects, setProjects] = useState([]);
    const [activeMenu, setActiveMenu] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load organization and projects from Supabase
    useEffect(() => {
        const loadData = async () => {
            try {
                // Load Org
                const { data: orgData, error: orgError } = await supabase
                    .from('organizations')
                    .select('*')
                    .eq('id', orgId)
                    .single();

                if (orgError) throw orgError;
                setOrganization(orgData);

                // Load Projects
                const { data: projData, error: projError } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('org_id', orgId)
                    .order('created_at', { ascending: false });

                if (projError) throw projError;
                setProjects(projData);
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (orgId) {
            loadData();
        }
    }, [orgId]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveMenu(null);
        if (activeMenu) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [activeMenu]);

    const handleDuplicateProject = async (project, e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const { data, error } = await supabase.from('projects').insert([{
                org_id: orgId,
                name: `${project.name} (Copy)`,
                description: project.description,
                doc_count: 0
            }]).select();

            if (error) throw error;
            setProjects([data[0], ...projects]);
        } catch (error) {
            console.error('Error duplicating project:', error);
            alert('Failed to duplicate project');
        }
        setActiveMenu(null);
    };

    const handleRenameProject = async (project, e) => {
        e.preventDefault();
        e.stopPropagation();
        const newName = prompt('Enter new project name:', project.name);
        if (newName && newName.trim() !== '') {
            try {
                const { error } = await supabase
                    .from('projects')
                    .update({ name: newName.trim() })
                    .eq('id', project.id);

                if (error) throw error;

                setProjects(projects.map(p =>
                    p.id === project.id ? { ...p, name: newName.trim() } : p
                ));
            } catch (error) {
                console.error('Error renaming project:', error);
                alert('Failed to rename project');
            }
        }
        setActiveMenu(null);
    };

    const handleDeleteProject = async (projectId, e) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this project?')) {
            try {
                const { error } = await supabase
                    .from('projects')
                    .delete()
                    .eq('id', projectId);

                if (error) throw error;

                setProjects(projects.filter(p => p.id !== projectId));
            } catch (error) {
                console.error('Error deleting project:', error);
                alert('Failed to delete project');
            }
        }
        setActiveMenu(null);
    };

    if (loading) {
        return <div style={{ padding: '2rem', color: 'white' }}>Loading...</div>;
    }

    if (!organization) {
        return <div style={{ padding: '2rem', color: 'white' }}>Organization not found.</div>;
    }

    return (
        <div style={{ padding: '2rem 4rem' }}>
            <header style={{ marginBottom: '3rem' }}>
                <Link to="/" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '1.5rem',
                    fontSize: '0.9rem',
                    width: 'fit-content'
                }}>
                    <FiChevronLeft /> Back to Dashboard
                </Link>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            {organization.logo && <img src={organization.logo} alt="Logo" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />}
                            <h1 style={{ fontSize: '2.5rem', margin: 0 }}>{organization.name}</h1>
                        </div>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            {organization.type && `${organization.type} • `}
                            {organization.team_strength && `Team: ${organization.team_strength}`}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate(`/org/${orgId}/new-project`)}
                        style={{
                            background: 'var(--primary)',
                            color: 'white',
                            padding: '0.8rem 1.5rem',
                            borderRadius: '12px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <FiPlus /> Create Project
                    </button>
                </div>
            </header>

            <section className="animate-fade">
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Projects</h2>
                {projects.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem 2rem',
                        color: 'var(--text-secondary)',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '16px',
                        border: '1px solid var(--glass-border)'
                    }}>
                        <FiFolder size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'white' }}>No Projects Yet</h3>
                        <p>Click "Create Project" to add your first project to this organization</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {projects.map(project => (
                            <div
                                key={project.id}
                                className="glass-card"
                                style={{
                                    padding: '1.5rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s',
                                    position: 'relative',
                                    cursor: 'pointer'
                                }}
                                onClick={() => navigate(`/project/${project.id}`)}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white'
                                    }}>
                                        <FiFolder size={20} />
                                    </div>

                                    {/* Menu Button */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setActiveMenu(activeMenu === project.id ? null : project.id);
                                        }}
                                        style={{
                                            background: 'rgba(255,255,255,0.1)',
                                            color: 'var(--text-secondary)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            padding: '0.5rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                    >
                                        <FiMoreVertical />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {activeMenu === project.id && (
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
                                                onClick={(e) => handleDuplicateProject(project, e)}
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
                                                onClick={(e) => handleRenameProject(project, e)}
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
                                                onClick={(e) => handleDeleteProject(project.id, e)}
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
                                </div>

                                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{project.name}</h3>

                                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{project.doc_count || 0} documents</span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Updated {new Date(project.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default OrganizationDetail;
