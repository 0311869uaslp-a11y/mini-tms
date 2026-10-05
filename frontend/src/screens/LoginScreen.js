import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';

import api from '../services/api';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Validar campos vacíos
    if (!username.trim() || !password.trim()) {
      Alert.alert(
        'Error',
        'Ingresa tu usuario y contraseña.'
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.post('/auth/login', {
        username: username.trim(),
        password
      });

      if (response.data.success) {
        navigation.navigate('Home');
      } else {
        Alert.alert(
          'Error',
          response.data.message || 'Usuario o contraseña incorrectos.'
        );
      }
    } catch (error) {
      console.error('Login error:', error);

      if (error.response) {
        Alert.alert(
          'Error',
          error.response.data?.message ||
            'No fue posible iniciar sesión.'
        );
      } else if (error.request) {
        Alert.alert(
          'Error de conexión',
          'No fue posible conectarse con el servidor. Inténtalo nuevamente.'
        );
      } else {
        Alert.alert(
          'Error',
          'Ocurrió un error inesperado al iniciar sesión.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚚 MINI TMS</Text>

      <Text style={styles.subtitle}>
        Transportation Management System
      </Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Usuario"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#999"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#999"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
          onSubmitEditing={handleLogin}
        />

        <TouchableOpacity
          style={[
            styles.button,
            loading && styles.buttonDisabled
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.buttonText}>
              Iniciar Sesión
            </Text>
          )}
        </TouchableOpacity>

        <Text style={styles.hint}>
          Demo: admin / admin
        </Text>
      </View>

      <Text style={styles.footer}>
        Mini TMS • Full-Stack Demo
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

    // Sombra para web/iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
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
    justifyContent: 'center',
    marginTop: 10,
    minHeight: 52,
  },

  buttonDisabled: {
    opacity: 0.7,
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