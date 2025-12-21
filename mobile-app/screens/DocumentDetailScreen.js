import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

export default function DocumentDetailScreen({ route }) {
  const { document } = route.params;
  const extractedData = document.extracted_data;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{document.name}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={[styles.statusBadge, { backgroundColor: '#10b98120' }]}>
            <Text style={[styles.statusText, { color: '#10b981' }]}>
              {document.status || 'uploaded'}
            </Text>
          </View>
        </View>

        {extractedData && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Extraction Type</Text>
              <Text style={styles.sectionValue}>
                {extractedData.extraction_type || 'metadata_only'}
              </Text>
            </View>

            {extractedData.metadata && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Metadata</Text>
                <View style={styles.metadataContainer}>
                  <Text style={styles.metadataItem}>
                    <Text style={styles.metadataLabel}>File Size: </Text>
                    {extractedData.metadata.file_size || 'N/A'}
                  </Text>
                  <Text style={styles.metadataItem}>
                    <Text style={styles.metadataLabel}>File Format: </Text>
                    {extractedData.metadata.file_format || 'N/A'}
                  </Text>
                  <Text style={styles.metadataItem}>
                    <Text style={styles.metadataLabel}>MIME Type: </Text>
                    {extractedData.metadata.mime_type || 'N/A'}
                  </Text>
                  <Text style={styles.metadataItem}>
                    <Text style={styles.metadataLabel}>Uploaded At: </Text>
                    {extractedData.metadata.uploaded_at
                      ? new Date(extractedData.metadata.uploaded_at).toLocaleString()
                      : 'N/A'}
                  </Text>
                  <Text style={styles.metadataItem}>
                    <Text style={styles.metadataLabel}>Extracted At: </Text>
                    {extractedData.metadata.extracted_at
                      ? new Date(extractedData.metadata.extracted_at).toLocaleString()
                      : 'N/A'}
                  </Text>
                </View>
              </View>
            )}

            {extractedData.content && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Content</Text>
                {extractedData.content.text && (
                  <View style={styles.textContentContainer}>
                    <Text style={styles.textContent}>
                      {extractedData.content.text}
                    </Text>
                  </View>
                )}
                {extractedData.content.character_count !== undefined && (
                  <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>
                        {extractedData.content.character_count}
                      </Text>
                      <Text style={styles.statLabel}>Characters</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>
                        {extractedData.content.word_count}
                      </Text>
                      <Text style={styles.statLabel}>Words</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>
                        {extractedData.content.line_count}
                      </Text>
                      <Text style={styles.statLabel}>Lines</Text>
                    </View>
                  </View>
                )}
              </View>
            )}
          </>
        )}

        {!extractedData && (
          <View style={styles.section}>
            <Text style={styles.noDataText}>
              No extraction data available. Please extract this document first.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionValue: {
    fontSize: 16,
    color: '#fff',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  metadataContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  metadataItem: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
  },
  metadataLabel: {
    fontWeight: '600',
    color: '#9ca3af',
  },
  textContentContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    maxHeight: 400,
  },
  textContent: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  noDataText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

