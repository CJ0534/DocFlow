import { useNavigate } from 'react-router-dom';
import { FiCheck } from 'react-icons/fi';
import '../styles/Auth.css';

const AuthSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="success-container animate-fade">
            <div className="success-card">
                <div className="auth-logo">
                    <div className="auth-logo-brand">DocFlow</div>
                </div>

                <div className="success-icon-circle">
                    <FiCheck size={48} strokeWidth={3} />
                </div>

                <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#1a1a1a' }}>
                    Account created successfully!
                </h1>
                <p style={{ color: '#64748b', marginBottom: '2rem', lineHeight: '1.6' }}>
                    Welcome aboard!<br />
                    Start your success journey with DocFlow
                </p>

                <button
                    onClick={() => navigate('/org-setup')}
                    className="btn-primary"
                    style={{ maxWidth: '200px', margin: '0 auto' }}
                >
                    Let's Start
                </button>
            </div>
        </div>
    );
};

export default AuthSuccess;
