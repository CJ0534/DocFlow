import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import apiClient from '../api/client';

const DocumentsScreen = ({ route }) => {
    const { projectId, projectName } = route.params;
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);

    const fetchDocuments = async () => {
        try {
            const response = await apiClient.get(`/projects/${projectId}/documents`);
            setDocuments(response.data.documents);
        } catch (error) {
            Alert.alert('Error', 'Failed to load documents');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchDocuments();
        }, [])
    );

    const handleUpload = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
            });

            if (result.canceled) {
                return;
            }

            const file = result.assets && result.assets[0];
            if (!file) {
                Alert.alert('Error', 'No file selected');
                return;
            }

            setUploading(true);

            const formData = new FormData();
            formData.append('file', {
                uri: file.uri,
                type: file.mimeType || 'application/octet-stream',
                name: file.name,
            });

            await apiClient.post(`/projects/${projectId}/documents`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            Alert.alert('Success', 'File uploaded successfully');
            fetchDocuments();
        } catch (error) {
            Alert.alert('Error', error.response?.data?.error || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleExtract = async (documentId) => {
        try {
            const response = await apiClient.post(`/documents/${documentId}/extract`);
            Alert.alert('Success', 'Extraction completed');
            setSelectedDoc(response.data.document);
            fetchDocuments();
        } catch (error) {
            Alert.alert('Error', error.response?.data?.error || 'Extraction failed');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'uploaded': return '#f59e0b';
            case 'processing': return '#3b82f6';
            case 'extracted': return '#10b981';
            case 'failed': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const renderDocument = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.docName} numberOfLines={1}>{item.original_name}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>

            <Text style={styles.docInfo}>
                Size: {(item.file_size / 1024).toFixed(2)} KB
            </Text>
            <Text style={styles.docInfo}>
                Type: {item.mime_type || 'Unknown'}
            </Text>
            <Text style={styles.docInfo}>
                Uploaded: {new Date(item.created_at).toLocaleString()}
            </Text>

            {item.status === 'uploaded' && (
                <TouchableOpacity
                    style={styles.extractButton}
                    onPress={() => handleExtract(item.id)}
                >
                    <Text style={styles.extractButtonText}>Extract</Text>
                </TouchableOpacity>
            )}

            {item.status === 'extracted' && (
                <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => setSelectedDoc(item)}
                >
                    <Text style={styles.viewButtonText}>View Extraction</Text>
                </TouchableOpacity>
            )}

            {item.status === 'processing' && (
                <ActivityIndicator style={styles.spinner} color="#3b82f6" />
            )}

            {selectedDoc && selectedDoc.id === item.id && selectedDoc.extracted_data && (
                <View style={styles.extractionView}>
                    <Text style={styles.extractionTitle}>Extraction Results:</Text>

                    <Text style={styles.extractionLabel}>Type:</Text>
                    <Text style={styles.extractionValue}>
                        {selectedDoc.extracted_data.extraction_type}
                    </Text>

                    {selectedDoc.extracted_data.content && (
                        <>
                            <Text style={styles.extractionLabel}>Statistics:</Text>
                            <Text style={styles.extractionValue}>
                                Words: {selectedDoc.extracted_data.content.word_count}
                            </Text>
                            <Text style={styles.extractionValue}>
                                Lines: {selectedDoc.extracted_data.content.line_count}
                            </Text>
                            <Text style={styles.extractionValue}>
                                Characters: {selectedDoc.extracted_data.content.character_count}
                            </Text>

                            <Text style={styles.extractionLabel}>Preview:</Text>
                            <ScrollView style={styles.textPreview}>
                                <Text style={styles.textContent}>
                                    {selectedDoc.extracted_data.content.text?.substring(0, 500)}
                                    {selectedDoc.extracted_data.content.text?.length > 500 && '...'}
                                </Text>
                            </ScrollView>
                        </>
                    )}
                </View>
            )}
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{projectName}</Text>
                <Text style={styles.subtitle}>Documents</Text>
            </View>

            <FlatList
                data={documents}
                renderItem={renderDocument}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No documents yet. Upload one!</Text>
                }
            />

            <TouchableOpacity
                style={[styles.fab, uploading && styles.fabDisabled]}
                onPress={handleUpload}
                disabled={uploading}
            >
                {uploading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.fabText}>📄</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    list: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    docName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        flex: 1,
        marginRight: 8,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    docInfo: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    extractButton: {
        backgroundColor: '#2563eb',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginTop: 12,
    },
    extractButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    viewButton: {
        backgroundColor: '#10b981',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginTop: 12,
    },
    viewButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    spinner: {
        marginTop: 12,
    },
    extractionView: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#f9fafb',
        borderRadius: 8,
    },
    extractionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    extractionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555',
        marginTop: 8,
        marginBottom: 4,
    },
    extractionValue: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    textPreview: {
        maxHeight: 200,
        backgroundColor: '#fff',
        borderRadius: 4,
        padding: 8,
        marginTop: 8,
    },
    textContent: {
        fontSize: 13,
        color: '#444',
        fontFamily: 'monospace',
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        fontSize: 16,
        marginTop: 40,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#2563eb',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    fabDisabled: {
        opacity: 0.6,
    },
    fabText: {
        fontSize: 24,
    },
});

export default DocumentsScreen;
