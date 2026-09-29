import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { testService } from '../services/testService';

export default function ConnectionTestScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [endpointResults, setEndpointResults] = useState([]);

  const testBackendConnection = async () => {
    setLoading(true);
    setResult(null);
    setEndpointResults([]);
    
   
    const response = await testService.testConnection();
    

    const otherResults = await testService.testOtherEndpoints();
    setEndpointResults(otherResults);
    
    setLoading(false);
    setResult(response);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔗 Prueba de Conexión</Text>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          <Text style={styles.bold}>Backend URL:</Text> http://10.0.2.2:8080/api
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.bold}>Endpoint principal:</Text> /dashboard/stats
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.bold}>Base de datos:</Text> H2 (embebida)
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.testButton}
        onPress={testBackendConnection}
        disabled={loading}
      >
        <Text style={styles.testButtonText}>
          {loading ? 'Probando conexión...' : '🔍 Probar Conexión Completa'}
        </Text>
      </TouchableOpacity>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Conectando con backend...</Text>
        </View>
      )}

      {result && (
        <View style={[
          styles.resultBox, 
          result.success ? styles.successBox : styles.errorBox
        ]}>
          <Text style={styles.resultTitle}>
            {result.success ? '✅ CONEXIÓN EXITOSA' : '❌ ERROR DE CONEXIÓN'}
          </Text>
          
          {result.success && result.data && (
            <>
              <Text style={styles.resultText}>{result.message}</Text>
              <View style={styles.dataBox}>
                <Text style={styles.dataTitle}>Datos recibidos:</Text>
                <Text style={styles.dataContent}>
                  {JSON.stringify(result.data, null, 2)}
                </Text>
              </View>
            </>
          )}
          
          {!result.success && (
            <View>
              <Text style={styles.errorText}>
                Error {result.status || 'Desconocido'}
              </Text>
              <Text style={styles.errorDetail}>
                {result.error}
              </Text>
              {result.details && (
                <Text style={styles.errorDetail}>
                  Detalles: {JSON.stringify(result.details)}
                </Text>
              )}
            </View>
          )}
        </View>
      )}

      {endpointResults.length > 0 && (
        <View style={styles.endpointsBox}>
          <Text style={styles.endpointsTitle}>📊 Otros Endpoints:</Text>
          
          {endpointResults.map((item, index) => (
            <View 
              key={index} 
              style={[
                styles.endpointItem,
                item.success ? styles.endpointSuccess : styles.endpointError
              ]}
            >
              <View style={styles.endpointHeader}>
                <Text style={styles.endpointMethod}>GET</Text>
                <Text style={styles.endpointPath}>{item.endpoint}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: item.success ? '#28a745' : '#dc3545' }
                ]}>
                  <Text style={styles.statusText}>
                    {item.status || 'N/A'}
                  </Text>
                </View>
              </View>
              {!item.success && item.error && (
                <Text style={styles.endpointErrorText}>
                  Error: {item.error}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      <View style={styles.troubleshootBox}>
        <Text style={styles.troubleshootTitle}>🛠️ Si hay errores:</Text>
        <Text style={styles.troubleshootItem}>1. ¿Spring Boot corre en puerto 8080?</Text>
        <Text style={styles.troubleshootItem}>2. ¿URL correcta? Android: 10.0.2.2</Text>
        <Text style={styles.troubleshootItem}>3. ¿Endpoint /api/dashboard/stats existe?</Text>
        <Text style={styles.troubleshootItem}>4. ¿Habilitaste CORS en Spring Boot?</Text>
      </View>

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Volver al Inicio</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 25,
    marginTop: 20,
  },
  infoBox: {
    backgroundColor: '#e8f4fc',
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  infoText: {
    fontSize: 15,
    color: '#2c3e50',
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  testButton: {
    backgroundColor: '#3498db',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 25,
    elevation: 3,
  },
  testButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#7f8c8d',
    fontSize: 16,
  },
  resultBox: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 25,
  },
  successBox: {
    backgroundColor: '#d4edda',
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  errorBox: {
    backgroundColor: '#f8d7da',
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 15,
  },
  dataBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  dataTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  dataContent: {
    fontSize: 14,
    color: '#495057',
    fontFamily: 'monospace',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#721c24',
    marginBottom: 10,
  },
  errorDetail: {
    fontSize: 16,
    color: '#721c24',
    marginBottom: 5,
  },
  endpointsBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 25,
    elevation: 2,
  },
  endpointsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  endpointItem: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  endpointSuccess: {
    backgroundColor: '#f8f9fa',
  },
  endpointError: {
    backgroundColor: '#fff5f5',
  },
  endpointHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  endpointMethod: {
    backgroundColor: '#6f42c1',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
  },
  endpointPath: {
    flex: 1,
    fontSize: 14,
    color: '#495057',
    fontFamily: 'monospace',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  endpointErrorText: {
    fontSize: 12,
    color: '#dc3545',
    marginTop: 5,
  },
  troubleshootBox: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  troubleshootTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 10,
  },
  troubleshootItem: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 5,
    paddingLeft: 10,
  },
  backButton: {
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});