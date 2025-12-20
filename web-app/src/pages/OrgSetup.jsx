import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiEdit2, FiBriefcase } from 'react-icons/fi';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

const OrgSetup = () => {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [orgName, setOrgName] = useState('');
    const [orgType, setOrgType] = useState('');
    const [teamStrength, setTeamStrength] = useState('');
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleContinue = async (e) => {
        if (e) e.preventDefault();

        if (step === 1) {
            setStep(2);
        } else {
            console.log("Creating organization for user:", user?.id);
            if (!user) {
                alert("You must be logged in to create an organization.");
                return;
            }

            setLoading(true);
            try {
                const { data, error } = await supabase.from('organizations').insert([{
                    user_id: user.id,
                    name: orgName,
                    type: orgType,
                    team_strength: teamStrength,
                    logo: logoPreview || null
                }]).select();

                if (error) {
                    console.error('Supabase error:', error);
                    throw error;
                }

                console.log('Organization created:', data);
                // Navigate to dashboard
                navigate('/');
            } catch (error) {
                console.error('Error creating organization:', error);
                alert('Failed to create organization: ' + (error.message || JSON.stringify(error)));
            } finally {
                setLoading(false);
            }
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
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
                        <div style={{ width: '8px', height: '4px', background: 'white', opacity: 0.5, borderRadius: '2px' }} />
                        <div style={{ width: '8px', height: '4px', background: 'white', opacity: 0.5, borderRadius: '2px' }} />
                        <div style={{ width: '24px', height: '4px', background: 'white', opacity: 1, borderRadius: '2px' }} />
                    </div>
                </div>
            </div>

            <div className="auth-form-panel">
                <div className="auth-form-content">
                    <div className="auth-logo">
                        <div className="auth-logo-brand">DocFlow</div>
                    </div>

                    <div className="auth-step-indicator">{step} / 2</div>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Customize your Organization</h2>
                        <p style={{ color: '#64748b' }}>Setup your organization for members that may join later.</p>
                    </div>

                    {step === 1 ? (
                        <form onSubmit={handleContinue}>
                            <div className="form-group">
                                <label>Company Name *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="I"
                                    value={orgName}
                                    onChange={(e) => setOrgName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Company Type *</label>
                                <select
                                    className="form-control"
                                    value={orgType}
                                    onChange={(e) => setOrgType(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Select Company Type</option>
                                    <option value="tech">Technology</option>
                                    <option value="finance">Finance</option>
                                    <option value="healthcare">Healthcare</option>
                                    <option value="education">Education</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Team Strength *</label>
                                <select
                                    className="form-control"
                                    value={teamStrength}
                                    onChange={(e) => setTeamStrength(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Select Team Strength</option>
                                    <option value="1-5">1-5 members</option>
                                    <option value="6-20">6-20 members</option>
                                    <option value="21-100">21-100 members</option>
                                    <option value="100+">100+ members</option>
                                </select>
                            </div>

                            <button type="submit" className="btn-primary">
                                Continue
                            </button>
                        </form>
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            <input
                                type="file"
                                id="logo-upload"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleLogoChange}
                            />

                            <div
                                className="upload-placeholder"
                                style={{
                                    backgroundImage: logoPreview ? `url(${logoPreview})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                {!logoPreview && <FiBriefcase size={40} />}
                            </div>

                            <div className="action-row">
                                <label htmlFor="logo-upload" className="btn-secondary" style={{ cursor: 'pointer' }}>
                                    <FiUpload /> Upload Logo
                                </label>
                                <label htmlFor="logo-upload" className="btn-secondary" style={{ cursor: 'pointer' }}>
                                    <FiEdit2 /> Edit Logo
                                </label>
                            </div>

                            <button onClick={handleContinue} className="btn-primary" disabled={loading}>
                                {loading ? 'Creating...' : 'Continue'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrgSetup;
