import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiLayout } from 'react-icons/fi';
import { supabase } from '../services/supabase';
import '../styles/Auth.css';

const ProjectSetup = () => {
    const { orgId } = useParams();
    const [projectName, setProjectName] = useState('');
    const [projectDesc, setProjectDesc] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.from('projects').insert([{
                org_id: orgId,
                name: projectName,
                description: projectDesc,
                doc_count: 0
            }]);

            if (error) throw error;

            navigate(`/org/${orgId}`);
        } catch (error) {
            console.error('Error creating project:', error);
            alert('Failed to create project: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-side-panel">
                <div>
                    <h2>Create New Project</h2>
                    <p>Organize your documents within your organization.</p>
                </div>
                <div>
                    <h2>Project Hierarchy</h2>
                    <p>Projects help you group related documents together for easier extraction and analysis.</p>
                </div>
            </div>

            <div className="auth-form-panel">
                <div className="auth-form-content">
                    <div className="auth-logo">
                        <div className="auth-logo-brand">DocFlow</div>
                    </div>

                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Project Details</h2>
                        <p style={{ color: '#64748b' }}>Give your project a name and description.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Project Name *</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. Q4 Audit"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Description (Optional)</label>
                            <textarea
                                className="form-control"
                                placeholder="Describe the purpose of this project"
                                rows="4"
                                style={{ resize: 'none' }}
                                value={projectDesc}
                                onChange={(e) => setProjectDesc(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn-primary">
                            Create Project
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProjectSetup;
