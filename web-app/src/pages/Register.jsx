import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiAlertCircle, FiCheck } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaApple, FaMicrosoft } from 'react-icons/fa';
import '../styles/Auth.css';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

    const [criteria, setCriteria] = useState({
        length: false,
        noName: false,
        numberSymbol: false,
    });

    useEffect(() => {
        setCriteria({
            length: password.length >= 8,
            noName: !email || !password.toLowerCase().includes(email.split('@')[0].toLowerCase()),
            numberSymbol: /[0-9]/.test(password) && /[!@#$%^&*]/.test(password)
        });
    }, [password, email]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!criteria.length || !criteria.numberSymbol) {
            setError("Please meet all password requirements");
            return;
        }

        setLoading(true);
        try {
            const { error: regError } = await register(email, password);
            if (regError) throw regError;
            navigate('/onboarding');
        } catch (err) {
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container animate-fade">
            <div className="auth-side-panel">
                <div>
                    <h2>Welcome to DocFlow</h2>
                    <p>Unlock the power of your documents with AI-driven extraction and management.</p>
                </div>
                <div>
                    <h2>Join the Flow</h2>
                    <p>Create an account to start organizing your projects and extracting valuable data today.</p>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '2rem' }}>
                        <div style={{ width: '8px', height: '4px', background: 'white', opacity: 0.5, borderRadius: '2px' }} />
                        <div style={{ width: '24px', height: '4px', background: 'white', opacity: 1, borderRadius: '2px' }} />
                        <div style={{ width: '8px', height: '4px', background: 'white', opacity: 0.5, borderRadius: '2px' }} />
                    </div>
                </div>
            </div>

            <div className="auth-form-panel">
                <div className="auth-form-content">
                    <div className="auth-logo">
                        <div className="auth-logo-brand">DocFlow</div>
                    </div>

                    <div className="auth-tabs">
                        <div className="auth-tab active">Sign Up</div>
                        <div className="auth-tab" onClick={() => navigate('/login')}>Sign In</div>
                    </div>

                    {error && (
                        <div style={{
                            padding: '0.75rem 1rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid #ef4444',
                            borderRadius: '10px',
                            color: '#ef4444',
                            fontSize: '0.85rem',
                            marginBottom: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <FiAlertCircle /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Create a strong password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="password-criteria">
                            <div className={`criteria-item ${criteria.length ? 'met' : ''}`}>
                                <FiCheck /> At least 8 characters
                            </div>
                            <div className={`criteria-item ${criteria.noName ? 'met' : ''}`}>
                                <FiCheck /> Cannot contain your name or email
                            </div>
                            <div className={`criteria-item ${criteria.numberSymbol ? 'met' : ''}`}>
                                <FiCheck /> Contains a number and symbol
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="social-login-divider">OR</div>

                    <div className="social-btns">
                        <button className="social-btn"><FcGoogle size={24} /></button>
                        <button className="social-btn"><FaApple size={24} /></button>
                        <button className="social-btn"><FaMicrosoft size={20} color="#00a1f1" /></button>
                    </div>

                    <p className="auth-footer">
                        By signing up to create an account I accept Company's<br />
                        <strong>Terms of use & Privacy Policy.</strong>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
