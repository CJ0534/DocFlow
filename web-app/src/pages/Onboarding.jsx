import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const Onboarding = () => {
    const [companyName, setCompanyName] = useState('');
    const [companyType, setCompanyType] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    const roles = [
        { id: 'dev', label: 'Developer', class: 'tag-dev' },
        { id: 'designer', label: 'Designer', class: 'tag-designer' },
        { id: 'engineer', label: 'Engineer', class: 'tag-engineer' },
        { id: 'ceo', label: 'CEO', class: 'tag-ceo' },
        { id: 'pm', label: 'PM', class: 'tag-pm' },
        { id: 'cto', label: 'CTO', class: 'tag-cto' },
        { id: 'cmo', label: 'CMO', class: 'tag-cmo' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        // Typically would save this to Supabase profile
        navigate('/auth-success');
    };

    return (
        <div className="auth-container">
            <div className="auth-side-panel">
                <div>
                    <h2>Welcome to DocFlow</h2>
                    <p>Your Gateway to Effortless Management.</p>
                </div>
                <div>
                    <h2>Seamless Collaboration</h2>
                    <p>Effortlessly work together with your team to manage and extract insights from your documents.</p>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '2rem' }}>
                        <div style={{ width: '24px', height: '4px', background: 'white', opacity: 1, borderRadius: '2px' }} />
                        <div style={{ width: '8px', height: '4px', background: 'white', opacity: 0.5, borderRadius: '2px' }} />
                        <div style={{ width: '8px', height: '4px', background: 'white', opacity: 0.5, borderRadius: '2px' }} />
                    </div>
                </div>
            </div>

            <div className="auth-form-panel">
                <div className="auth-form-content">
                    <div className="auth-logo">
                        <div className="auth-logo-brand">DocFlow</div>
                    </div>

                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>About yourself</h2>
                        <p style={{ color: '#64748b' }}>Tell us what describes your role the best</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Company Name *</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Flashback Labs"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Company Type *</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="1-5"
                                value={companyType}
                                onChange={(e) => setCompanyType(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Role *</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Text here"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                            />
                            <div className="role-tags">
                                {roles.map(r => (
                                    <span
                                        key={r.id}
                                        className={`role-tag ${r.class}`}
                                        onClick={() => setRole(r.label)}
                                    >
                                        {r.label}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="btn-primary">
                            Continue
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
