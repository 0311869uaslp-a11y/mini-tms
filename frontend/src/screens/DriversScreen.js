import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  Modal,
  ScrollView
} from 'react-native';
import { driverService } from '../services/driverService'; 

export default function DriversScreen() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  
  const [newDriver, setNewDriver] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseNumber: ''
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    setLoading(true);
    const result = await driverService.getAllDrivers();
    
    if (result.success) {
      setDrivers(result.data);
    } else {
      Alert.alert('Error', 'No se pudieron cargar los conductores: ' + result.error);
      setDrivers([
        {
          id: 1,
          firstName: 'Carlos',
          lastName: 'González',
          email: 'carlos@transportes.com',
          phone: '555-1001',
          licenseNumber: 'LIC-001',
          available: true
        }
      ]);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!searchText.trim()) {
      fetchDrivers(); 
      return;
    }

    setLoading(true);
    const result = await driverService.searchDrivers(searchText);
    
    if (result.success) {
      setDrivers(result.data);
    } else {
      Alert.alert('Error', 'No se pudo realizar la búsqueda');
    }
    setLoading(false);
  };

  
  const handleCreateDriver = async () => {
    if (!newDriver.firstName || !newDriver.lastName || !newDriver.licenseNumber) {
      Alert.alert('Error', 'Nombre, apellido y licencia son obligatorios');
      return;
    }

    const result = await driverService.createDriver(newDriver);
    
    if (result.success) {
      Alert.alert('✅ Éxito', 'Conductor creado correctamente');
      setModalVisible(false);
      setNewDriver({ 
        firstName: '', 
        lastName: '', 
        email: '', 
        phone: '', 
        licenseNumber: '' 
      });
      fetchDrivers(); 
    } else {
      Alert.alert('❌ Error', result.error || 'No se pudo crear el conductor');
    }
  };

  
  const handleDeleteDriver = (id) => {
    Alert.alert(
      'Eliminar conductor',
      '¿Estás seguro de que quieres eliminar este conductor?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const result = await driverService.deleteDriver(id);
            if (result.success) {
              Alert.alert('✅ Éxito', 'Conductor eliminado');
              fetchDrivers(); 
            } else {
              Alert.alert('❌ Error', 'No se pudo eliminar el conductor: ' + result.error);
            }
          }
        }
      ]
    );
  };

  const renderDriverItem = ({ item }) => (
    <View style={styles.driverCard}>
      <View style={styles.driverInfo}>
        <Text style={styles.driverName}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={styles.driverDetail}>Licencia: {item.licenseNumber}</Text>
        <Text style={styles.driverDetail}>Tel: {item.phone || 'No tiene'}</Text>
        <Text style={styles.driverDetail}>Email: {item.email || 'No tiene'}</Text>
        <Text style={[
          styles.statusBadge,
          { backgroundColor: item.available ? '#2ecc71' : '#e74c3c' }
        ]}>
          {item.available ? '✅ Disponible' : '❌ No disponible'}
        </Text>
      </View>
      
      <View style={styles.driverActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => Alert.alert('Editar', `Editarías a ${item.firstName} (funcionalidad en desarrollo)`)}
        >
          <Text style={styles.actionText}>✏️</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteDriver(item.id)}
        >
          <Text style={styles.actionText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && drivers.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Conectando con backend...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre o apellido..."
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>➕ Agregar Conductor</Text>
      </TouchableOpacity>

      <View style={styles.counter}>
        <Text style={styles.counterText}>
          {drivers.length} conductor{drivers.length !== 1 ? 'es' : ''} registrado{drivers.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={drivers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderDriverItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay conductores registrados</Text>
            <Text style={styles.emptySubtext}>Presiona "+ Agregar Conductor" para comenzar</Text>
          </View>
        }
        refreshing={loading}
        onRefresh={fetchDrivers}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nuevo Conductor</Text>
            
            <ScrollView>
              <TextInput
                style={styles.modalInput}
                placeholder="Nombre *"
                value={newDriver.firstName}
                onChangeText={(text) => setNewDriver({...newDriver, firstName: text})}
              />
              
              <TextInput
                style={styles.modalInput}
                placeholder="Apellido *"
                value={newDriver.lastName}
                onChangeText={(text) => setNewDriver({...newDriver, lastName: text})}
              />
              
              <TextInput
                style={styles.modalInput}
                placeholder="Número de licencia *"
                value={newDriver.licenseNumber}
                onChangeText={(text) => setNewDriver({...newDriver, licenseNumber: text})}
              />
              
              <TextInput
                style={styles.modalInput}
                placeholder="Teléfono"
                value={newDriver.phone}
                onChangeText={(text) => setNewDriver({...newDriver, phone: text})}
                keyboardType="phone-pad"
              />
              
              <TextInput
                style={styles.modalInput}
                placeholder="Email"
                value={newDriver.email}
                onChangeText={(text) => setNewDriver({...newDriver, email: text})}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleCreateDriver}
              >
                <Text style={styles.modalButtonText}>Guardar en Backend</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Text style={styles.note}>
        {drivers.length > 0 && drivers[0].id === 1 && drivers[0].firstName === 'Carlos' 
          ? '⚠️ Usando datos simulados - Verifica que driverService.js esté creado' 
          : '✅ Conectado al backend Spring Boot'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#7f8c8d',
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  searchButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    marginLeft: 10,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontSize: 20,
  },
  addButton: {
    backgroundColor: '#2ecc71',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  counter: {
    backgroundColor: '#3498db',
    marginHorizontal: 15,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  counterText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    padding: 10,
  },
  driverCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  driverDetail: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 3,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 5,
  },
  driverActions: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 6,
    marginLeft: 5,
    width: 40,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 50,
  },
  emptyText: {
    fontSize: 20,
    color: '#95a5a6',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bdc3c7',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
  },
  saveButton: {
    backgroundColor: '#2ecc71',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  note: {
    textAlign: 'center',
    padding: 10,
    color: '#e74c3c',
    fontSize: 12,
    fontStyle: 'italic',
    backgroundColor: '#fdf2f2',
    margin: 10,
    borderRadius: 5,
  },
});