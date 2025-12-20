import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiUpload, FiFileText, FiX, FiCheck } from 'react-icons/fi';
import { supabase } from '../services/supabase';
import '../styles/Auth.css';

const DocumentUploadScreen = () => {
    const { projectId } = useParams();
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            // Unique file path to avoid collisions
            const filePath = `${projectId}/${Date.now()}_${file.name}`;

            // 1. Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from('documents')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Insert into DB
            const { error: dbError } = await supabase.from('documents').insert([{
                project_id: projectId,
                user_id: user.id,
                name: file.name,
                size: (file.size / 1024).toFixed(2) + ' KB',
                type: file.type,
                status: 'uploaded',
                storage_path: filePath,
                file_format: file.name.split('.').pop()
            }]);

            if (dbError) throw dbError;

            // 3. Increment project's doc_count
            const { error: updateError } = await supabase.rpc('increment_doc_count', {
                project_id_param: projectId
            });

            if (updateError) {
                console.warn('Failed to update doc count:', updateError);
                // Don't throw - document is already uploaded
            }

            navigate(`/project/${projectId}`);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-side-panel">
                <div>
                    <h2>Upload Documents</h2>
                    <p>Add files to your project for processing.</p>
                </div>
                <div>
                    <h2>AI Power</h2>
                    <p>Once uploaded, DocFlow will automatically extract metadata and text content from your files.</p>
                </div>
            </div>

            <div className="auth-form-panel">
                <div className="auth-form-content">
                    <div className="auth-logo">
                        <div className="auth-logo-brand">DocFlow</div>
                    </div>

                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Select Document</h2>
                        <p style={{ color: '#64748b' }}>Choose the file you want to add to this project.</p>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <label className="upload-placeholder" style={{ cursor: 'pointer' }}>
                            <input type="file" style={{ display: 'none' }} onChange={handleFileChange} />
                            {file ? <FiCheck size={40} color="#10b981" /> : <FiFileText size={40} />}
                        </label>

                        {file && (
                            <div style={{ marginBottom: '1rem' }}>
                                <p style={{ fontWeight: '600', color: '#1a1a1a' }}>{file.name}</p>
                                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                        )}

                        <div className="action-row">
                            <label className="btn-secondary" style={{ cursor: 'pointer' }}>
                                <input type="file" style={{ display: 'none' }} onChange={handleFileChange} />
                                <FiUpload /> {file ? 'Replace File' : 'Choose File'}
                            </label>
                            {file && (
                                <button className="btn-secondary" onClick={() => setFile(null)}>
                                    <FiX /> Clear
                                </button>
                            )}
                        </div>

                        <button
                            onClick={handleUpload}
                            disabled={!file || isUploading}
                            className="btn-primary"
                        >
                            {isUploading ? 'Uploading...' : 'Upload Document'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentUploadScreen;
