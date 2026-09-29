import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';

export default function TestScreen({ navigation }) {
  const testItems = [
    '✅ Navegación funcionando',
    '✅ Estado (State) trabajando',
    '✅ Estilos aplicados',
    '✅ Alertas funcionando',
    '🔄 Pendiente: Conexión API',
    '🔄 Pendiente: Autenticación real',
    '🔄 Pendiente: Base de datos',
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧪 Pruebas Completadas</Text>
      
      <View style={styles.list}>
        {testItems.map((item, index) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.itemText}>{item}</Text>
          </View>
        ))}
      </View>
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Volver al Inicio</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.testButton}
        onPress={() => Alert.alert('Prueba', 'Todo funciona correctamente!')}
      >
        <Text style={styles.testButtonText}>Probar Alerta</Text>
      </TouchableOpacity>
    </View>
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
    marginBottom: 30,
    marginTop: 20,
  },
  list: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 3,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  bullet: {
    fontSize: 20,
    color: '#3498db',
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  backButton: {
    backgroundColor: '#95a5a6',
    padding: 15,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  testButton: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});