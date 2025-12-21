import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { documentsAPI } from '../services/api';

export default function ProjectDetailScreen({ route, navigation }) {
  const { projectId, projectName } = route.params;
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(null);

  useEffect(() => {
    navigation.setOptions({ title: projectName });
    fetchDocuments();
  }, [projectId]);

  const fetchDocuments = async () => {
    try {
      const data = await documentsAPI.getByProject(projectId);
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to load documents');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDocuments();
  };

  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      setUploading(true);

      const response = await documentsAPI.upload(
        projectId,
        file.uri,
        file.name,
        file.mimeType || 'application/octet-stream'
      );

      setDocuments([response.document, ...documents]);
      Alert.alert('Success', 'Document uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleExtract = async (documentId) => {
    setExtracting(documentId);
    try {
      const response = await documentsAPI.extract(documentId);
      // Update document in list
      setDocuments(documents.map(doc =>
        doc.id === documentId
          ? { ...doc, status: 'extracted', extracted_data: response.extracted_data }
          : doc
      ));
      Alert.alert('Success', 'Document extraction completed');
    } catch (error) {
      console.error('Extract error:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to extract document');
      // Update status to failed
      setDocuments(documents.map(doc =>
        doc.id === documentId ? { ...doc, status: 'failed' } : doc
      ));
    } finally {
      setExtracting(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'uploaded':
        return '#9ca3af';
      case 'processing':
        return '#f59e0b';
      case 'extracted':
        return '#10b981';
      case 'failed':
        return '#ef4444';
      default:
        return '#9ca3af';
    }
  };

  const renderDocument = ({ item }) => (
    <TouchableOpacity
      style={styles.documentCard}
      onPress={() => {
        if (item.extracted_data) {
          navigation.navigate('DocumentDetail', { document: item });
        }
      }}
    >
      <View style={styles.documentIcon}>
        <Text style={styles.documentIconText}>
          {item.name ? item.name.charAt(0).toUpperCase() : 'D'}
        </Text>
      </View>
      <View style={styles.documentInfo}>
        <Text style={styles.documentName} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.documentMeta}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status || 'uploaded'}
            </Text>
          </View>
          {item.size && (
            <Text style={styles.documentSize}>
              {(parseInt(item.size) / 1024).toFixed(2)} KB
            </Text>
          )}
        </View>
      </View>
      {item.status === 'uploaded' && (
        <TouchableOpacity
          style={styles.extractButton}
          onPress={() => handleExtract(item.id)}
          disabled={extracting === item.id}
        >
          {extracting === item.id ? (
            <ActivityIndicator size="small" color="#2563eb" />
          ) : (
            <Text style={styles.extractButtonText}>Extract</Text>
          )}
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]}
        onPress={handleUpload}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.uploadButtonText}>+ Upload Document</Text>
        )}
      </TouchableOpacity>

      <FlatList
        data={documents}
        renderItem={renderDocument}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No documents yet</Text>
            <Text style={styles.emptySubtext}>
              Upload your first document to get started
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  uploadButton: {
    backgroundColor: '#2563eb',
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  documentIconText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2563eb',
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  documentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  documentSize: {
    fontSize: 12,
    color: '#9ca3af',
  },
  extractButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
  },
  extractButtonText: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
});

