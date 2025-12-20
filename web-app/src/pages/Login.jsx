import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiAlertCircle, FiCheck } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaApple, FaMicrosoft } from 'react-icons/fa';
import '../styles/Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { error: loginError } = await login(email, password);
            if (loginError) throw loginError;
            navigate('/');
        } catch (err) {
            setError(err.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container animate-fade">
            <div className="auth-side-panel">
                <div>
                    <h2>Welcome to DocFlow</h2>
                    <p>Slogan or subtitle here.</p>
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

                    <div className="auth-tabs">
                        <div className="auth-tab" onClick={() => navigate('/register')}>Sign Up</div>
                        <div className="auth-tab active">Sign In</div>
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
                                placeholder="I"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <Link to="#" className="forgot-link">Forgot Password?</Link>
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
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

export default Login;
