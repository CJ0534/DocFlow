const fs = require('fs');
const path = require('path');
const { dbRun, dbGet } = require('../config/database');

async function extractDocument(document) {
    const storageDir = path.join(__dirname, '..', 'storage', document.project_id, document.id);
    const filePath = path.join(storageDir, document.original_name);

    try {
        // Create metadata
        const metadata = {
            document_id: document.id,
            project_id: document.project_id,
            filename: document.original_name,
            file_size: document.file_size,
            mime_type: document.mime_type,
            uploaded_at: document.created_at,
            extracted_at: new Date().toISOString()
        };

        // Save metadata
        const metaPath = path.join(storageDir, 'meta.json');
        fs.writeFileSync(metaPath, JSON.stringify(metadata, null, 2));

        let extractedData = {
            document_id: document.id,
            extraction_type: 'metadata_only',
            metadata
        };

        // Check if file is text-based
        const isTextFile =
            document.mime_type?.startsWith('text/') ||
            document.original_name.toLowerCase().endsWith('.txt');

        if (isTextFile) {
            // Extract text content
            const textContent = fs.readFileSync(filePath, 'utf-8');

            extractedData = {
                document_id: document.id,
                extraction_type: 'text',
                metadata,
                content: {
                    text: textContent,
                    character_count: textContent.length,
                    line_count: textContent.split('\n').length,
                    word_count: textContent.split(/\s+/).filter(w => w.length > 0).length
                }
            };
        }

        // Save extracted data
        const extractedPath = path.join(storageDir, 'extracted.json');
        fs.writeFileSync(extractedPath, JSON.stringify(extractedData, null, 2));

        // Update document status
        await dbRun('UPDATE documents SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', ['extracted', document.id]);

        // Return updated document
        const updatedDocument = await dbGet('SELECT * FROM documents WHERE id = ?', [document.id]);
        return {
            ...updatedDocument,
            extracted_data: extractedData
        };

    } catch (error) {
        console.error('Extraction error:', error);

        // Update status to failed
        await dbRun('UPDATE documents SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', ['failed', document.id]);

        throw error;
    }
}

module.exports = { extractDocument };
