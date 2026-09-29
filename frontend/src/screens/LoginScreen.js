import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    
    if (username === 'admin' && password === 'admin') {
      Alert.alert('✅ Éxito', 'Login simulado correctamente');
      navigation.navigate('Home');
    } else {
      Alert.alert('❌ Error', 'Usuario: admin / Contraseña: admin');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚚 MINI TMS</Text>
      <Text style={styles.subtitle}>Versión de Prueba</Text>
      
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Usuario"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#999"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#999"
        />
        
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
        
        <Text style={styles.hint}>
          Usa: admin / admin
        </Text>
      </View>
      
      <Text style={styles.footer}>
        ✅ App funcionando - Sin backend
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#ecf0f1',
    textAlign: 'center',
    marginBottom: 50,
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  hint: {
    textAlign: 'center',
    marginTop: 15,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    color: '#95a5a6',
    fontSize: 14,
  },
});