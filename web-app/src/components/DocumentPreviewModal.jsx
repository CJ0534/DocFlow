import { FiX, FiFileText, FiType, FiLayout, FiMaximize2 } from 'react-icons/fi';
import '../styles/GlassModal.css'; // We'll need to ensure this exists or use inline styles

const DocumentPreviewModal = ({ isOpen, onClose, document, content }) => {
    if (!isOpen || !document) return null;

    const metadata = document.metadata || {};

    return (
        <div className="glass-modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }} onClick={onClose}>
            <div className="glass-modal-content" style={{
                background: 'var(--glass)',
                border: '1px solid var(--glass-border)',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '1000px',
                height: '85vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }} onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div style={{
                    padding: '1.5rem 2rem',
                    borderBottom: '1px solid var(--glass-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            background: 'rgba(94, 114, 228, 0.1)',
                            padding: '0.75rem',
                            borderRadius: '12px',
                            color: 'var(--primary)'
                        }}>
                            <FiFileText size={24} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{document.name}</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                Extracted on {new Date(document.last_updated || Date.now()).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                        }}
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* Body */}
                <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                    {/* Content Area */}
                    <div style={{
                        flex: 1,
                        padding: '2rem',
                        overflowY: 'auto',
                        borderRight: '1px solid var(--glass-border)',
                        background: 'rgba(0,0,0,0.2)'
                    }}>
                        {document.type?.startsWith('image/') ? (
                            // Image Preview
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: '100%'
                            }}>
                                <img
                                    src={content}
                                    alt={document.name}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
                                    }}
                                />
                            </div>
                        ) : document.type === 'application/pdf' ? (
                            // PDF Preview
                            <iframe
                                src={content}
                                title={document.name}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    border: 'none',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
                                }}
                            />
                        ) : (
                            // Text Preview
                            <div style={{
                                background: 'white',
                                color: '#1e293b',
                                padding: '3rem',
                                borderRadius: '8px',
                                minHeight: '100%',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                fontFamily: 'monospace',
                                whiteSpace: 'pre-wrap',
                                lineHeight: '1.6'
                            }}>
                                {content || "Loading content..."}
                            </div>
                        )}
                    </div>

                    {/* Metadata Sidebar */}
                    <div style={{ width: '300px', padding: '2rem', overflowY: 'auto' }}>
                        <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                            Extraction Results
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <StatCard
                                icon={<FiType />}
                                label="Total Characters"
                                value={metadata.characters || 0}
                            />
                            <StatCard
                                icon={<FiLayout />}
                                label="Total Lines"
                                value={metadata.lines || 0}
                            />
                            <StatCard
                                icon={<FiMaximize2 />}
                                label="Word Count"
                                value={metadata.words || 0}
                            />

                            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>File Details</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.5rem 1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    <span>Type:</span> <span style={{ color: 'white' }}>{document.type || 'Text'}</span>
                                    <span>Size:</span> <span style={{ color: 'white' }}>{document.size}</span>
                                    <span>Format:</span> <span style={{ color: 'white' }}>{document.file_format || 'TXT'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value }) => (
    <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--glass-border)',
        padding: '1rem',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
    }}>
        <div style={{ color: 'var(--primary)', opacity: 0.8 }}>{icon}</div>
        <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{value.toLocaleString()}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{label}</div>
        </div>
    </div>
);

export default DocumentPreviewModal;
