import DocumentPreviewModal from '../components/DocumentPreviewModal';
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiFile, FiUpload, FiRefreshCw, FiEye, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { supabase } from '../services/supabase';

const ProjectDetail = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Load Project
                const { data: projData, error: projError } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('id', projectId)
                    .single();

                if (projError) throw projError;
                setProject(projData);

                // Load Documents
                const { data: docData, error: docError } = await supabase
                    .from('documents')
                    .select('*')
                    .eq('project_id', projectId)
                    .order('created_at', { ascending: false });

                if (docError) throw docError;
                setDocuments(docData);
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (projectId) {
            loadData();
        }
    }, [projectId]);

    const handleRenameDocument = async (docId, currentName) => {
        const newName = prompt('Enter new document name:', currentName);
        if (newName && newName.trim() !== '') {
            try {
                const { error } = await supabase
                    .from('documents')
                    .update({ name: newName.trim() })
                    .eq('id', docId);

                if (error) throw error;

                setDocuments(documents.map(d =>
                    d.id === docId ? { ...d, name: newName.trim() } : d
                ));
            } catch (error) {
                console.error('Error renaming document:', error);
                alert('Failed to rename document');
            }
        }
    };

    const handleDeleteDocument = async (docId) => {
        if (confirm('Are you sure you want to delete this document?')) {
            try {
                const { error } = await supabase
                    .from('documents')
                    .delete()
                    .eq('id', docId);

                if (error) throw error;

                setDocuments(documents.filter(d => d.id !== docId));
            } catch (error) {
                console.error('Error deleting document:', error);
                alert('Failed to delete document');
            }
        }
    };

    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewDoc, setPreviewDoc] = useState(null);
    const [previewContent, setPreviewContent] = useState('');

    const handleExtract = async (doc) => {
        try {
            // 1. Update status to processing
            const { error: processingError } = await supabase
                .from('documents')
                .update({ status: 'processing' })
                .eq('id', doc.id);

            if (processingError) throw processingError;

            setDocuments(documents.map(d =>
                d.id === doc.id ? { ...d, status: 'processing' } : d
            ));

            // 2. Simulate processing time & fetch content
            setTimeout(async () => {
                try {
                    // Download file content for analysis
                    const { data, error: downloadError } = await supabase.storage
                        .from('documents')
                        .download(doc.storage_path);

                    if (downloadError) throw downloadError;

                    const text = await data.text();

                    // Simple analysis
                    const stats = {
                        characters: text.length,
                        lines: text.split(/\r\n|\r|\n/).length,
                        words: text.trim().split(/\s+/).length
                    };

                    // 3. Update document with results
                    const { error: updateError } = await supabase
                        .from('documents')
                        .update({
                            status: 'extracted',
                            metadata: stats
                        })
                        .eq('id', doc.id);

                    if (updateError) throw updateError;

                    setDocuments(documents.map(d =>
                        d.id === doc.id ? {
                            ...d,
                            status: 'extracted',
                            metadata: stats
                        } : d
                    ));

                } catch (err) {
                    console.error('Error during processing:', err);
                    // Revert to uploaded or set failed path
                }
            }, 2000);

        } catch (error) {
            console.error('Error starting extraction:', error);
            alert('Failed to start extraction');
        }
    };

    const handlePreview = async (doc) => {
        setPreviewDoc(doc);
        setPreviewContent('Loading content...');
        setShowPreviewModal(true);

        try {
            const { data, error } = await supabase.storage
                .from('documents')
                .download(doc.storage_path);

            if (error) throw error;

            const text = await data.text();
            setPreviewContent(text);
        } catch (error) {
            console.error('Error fetching preview:', error);
            setPreviewContent('Failed to load document content.');
        }
    };

    if (loading) {
        return <div style={{ padding: '2rem', color: 'white' }}>Loading...</div>;
    }

    if (!project) {
        return <div style={{ padding: '2rem', color: 'white' }}>Project not found.</div>;
    }

    return (
        <div style={{ padding: '2rem 4rem' }}>
            <header style={{ marginBottom: '3rem' }}>
                <Link to={`/org/${project.org_id}`} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '1.5rem',
                    fontSize: '0.9rem',
                    width: 'fit-content'
                }}>
                    <FiChevronLeft /> Back to Organization
                </Link>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{project.name}</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Project ID: {projectId}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={() => navigate(`/project/${projectId}/upload`)}
                            style={{
                                background: 'var(--glass)',
                                border: '1px solid var(--glass-border)',
                                color: 'white',
                                padding: '0.8rem 1.5rem',
                                borderRadius: '12px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                cursor: 'pointer'
                            }}
                        >
                            <FiUpload /> Upload File
                        </button>
                    </div>
                </div>
            </header>

            <section className="animate-fade">
                {documents.length === 0 ? (
                    <div className="glass-card" style={{
                        textAlign: 'center',
                        padding: '4rem 2rem',
                        color: 'var(--text-secondary)'
                    }}>
                        <FiFile size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'white' }}>No Documents Yet</h3>
                        <p>Click "Upload File" to add your first document to this project</p>
                    </div>
                ) : (
                    <div className="glass-card" style={{ overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--glass-border)' }}>
                                    <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>DOCUMENT NAME</th>
                                    <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>STATUS</th>
                                    <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>SIZE</th>
                                    <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>UPLOAD DATE</th>
                                    <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'right' }}>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {documents.map((doc, index) => (
                                    <tr key={doc.id} style={{
                                        borderBottom: index === documents.length - 1 ? 'none' : '1px solid var(--glass-border)',
                                        transition: 'background 0.2s'
                                    }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ color: 'var(--primary)' }}><FiFile size={20} /></div>
                                                <span style={{ fontWeight: '500' }}>{doc.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.15rem 1.5rem' }}>
                                            <StatusBadge status={doc.status} />
                                        </td>
                                        <td style={{ padding: '1.15rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{doc.size}</td>
                                        <td style={{ padding: '1.15rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{new Date(doc.created_at).toLocaleDateString()}</td>
                                        <td style={{ padding: '1.15rem 1.5rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                                {doc.status === 'uploaded' && (
                                                    <ActionButton
                                                        icon={<FiRefreshCw />}
                                                        label="Extract"
                                                        onClick={() => handleExtract(doc)}
                                                    />
                                                )}
                                                {doc.status === 'processing' && (
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>Processing...</span>
                                                )}
                                                {doc.status === 'extracted' && (
                                                    <ActionButton
                                                        icon={<FiEye />}
                                                        label="View"
                                                        primary
                                                        onClick={() => handlePreview(doc)}
                                                    />
                                                )}
                                                <ActionButton
                                                    icon={<FiEdit2 />}
                                                    label="Rename"
                                                    onClick={() => handleRenameDocument(doc.id, doc.name)}
                                                />
                                                <ActionButton
                                                    icon={<FiTrash2 />}
                                                    label="Delete"
                                                    color="var(--error)"
                                                    onClick={() => handleDeleteDocument(doc.id)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <DocumentPreviewModal
                isOpen={showPreviewModal}
                onClose={() => setShowPreviewModal(false)}
                document={previewDoc}
                content={previewContent}
            />
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const colors = {
        uploaded: { bg: 'rgba(94, 114, 228, 0.1)', text: '#5e72e4' },
        processing: { bg: 'rgba(251, 191, 36, 0.1)', text: '#fbbf24' },
        extracted: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981' },
        failed: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444' },
    };

    const config = colors[status] || colors.uploaded;

    return (
        <span style={{
            padding: '0.25rem 0.75rem',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            background: config.bg,
            color: config.text,
            border: `1px solid ${config.text}22`
        }}>
            {status}
        </span>
    );
};

const ActionButton = ({ icon, label, primary, color, onClick }) => (
    <button
        onClick={onClick}
        style={{
            background: primary ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
            color: color || (primary ? 'white' : 'white'),
            padding: '0.5rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.8rem',
            fontWeight: '600',
            border: primary ? 'none' : '1px solid var(--glass-border)',
            cursor: 'pointer',
            transition: 'background 0.2s'
        }}
        onMouseEnter={(e) => !primary && (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
        onMouseLeave={(e) => !primary && (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
    >
        {icon} <span>{label}</span>
    </button>
);

export default ProjectDetail;
