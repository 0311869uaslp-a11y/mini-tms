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
import { vehicleService } from '../services/vehicleService';

export default function VehiclesScreen() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  
  const [newVehicle, setNewVehicle] = useState({
    registrationNumber: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    capacity: '',
    vehicleType: 'TRUCK',
    color: ''
  });

  const vehicleTypes = ['TRUCK', 'VAN', 'CAR', 'TRAILER'];

  // Cargar vehículos REALES del backend
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    const result = await vehicleService.getAllVehicles();
    
    if (result.success) {
      setVehicles(result.data);
    } else {
      Alert.alert('Error', 'Could not load vehicles: ' + result.error);
      // Datos simulados si hay error
      setVehicles([
        {
          id: 1,
          registrationNumber: 'MAD-1234-AB',
          brand: 'Mercedes',
          model: 'Actros',
          year: 2023,
          capacity: 18.5,
          vehicleType: 'TRUCK',
          color: 'White',
          available: true,
          status: 'AVAILABLE'
        }
      ]);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!searchText.trim()) {
      fetchVehicles(); // Recargar todos si búsqueda vacía
      return;
    }

    setLoading(true);
    const result = await vehicleService.searchVehicles(searchText);
    
    if (result.success) {
      setVehicles(result.data);
    } else {
      Alert.alert('Error', 'Could not perform search');
    }
    setLoading(false);
  };

  const handleCreateVehicle = async () => {
    if (!newVehicle.registrationNumber || !newVehicle.brand || !newVehicle.model) {
      Alert.alert('Error', 'Registration number, brand and model are required');
      return;
    }

    // Convertir capacity a número
    const vehicleData = {
      ...newVehicle,
      capacity: parseFloat(newVehicle.capacity) || 0,
      year: parseInt(newVehicle.year) || new Date().getFullYear()
    };

    const result = await vehicleService.createVehicle(vehicleData);
    
    if (result.success) {
      Alert.alert('✅ Success', 'Vehicle created successfully');
      setModalVisible(false);
      setNewVehicle({
        registrationNumber: '',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        capacity: '',
        vehicleType: 'TRUCK',
        color: ''
      });
      fetchVehicles(); // Recargar con datos reales
    } else {
      Alert.alert('❌ Error', result.error || 'Could not create vehicle');
    }
  };

  const handleDeleteVehicle = (id) => {
    Alert.alert(
      'Delete Vehicle',
      'Are you sure you want to delete this vehicle?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await vehicleService.deleteVehicle(id);
            if (result.success) {
              Alert.alert('✅ Success', 'Vehicle deleted');
              fetchVehicles(); // Recargar lista
            } else {
              Alert.alert('❌ Error', 'Could not delete vehicle: ' + result.error);
            }
          }
        }
      ]
    );
  };

  const handleUpdateVehicle = (id, vehicleData) => {
    Alert.alert(
      'Edit Vehicle',
      'Edit functionality in development',
      [
        { text: 'OK' }
      ]
    );
  };

  const renderVehicleItem = ({ item }) => (
    <View style={styles.vehicleCard}>
      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleReg}>{item.registrationNumber}</Text>
        <Text style={styles.vehicleDetail}>{item.brand} {item.model} ({item.year})</Text>
        <Text style={styles.vehicleDetail}>Type: {item.vehicleType}</Text>
        <Text style={styles.vehicleDetail}>Capacity: {item.capacity} tons</Text>
        <Text style={styles.vehicleDetail}>Color: {item.color || 'N/A'}</Text>
        <Text style={[
          styles.statusBadge,
          { 
            backgroundColor: 
              item.status === 'AVAILABLE' || item.available ? '#2ecc71' : 
              item.status === 'IN_USE' || !item.available ? '#e74c3c' : '#f39c12'
          }
        ]}>
          {item.status === 'AVAILABLE' ? '✅ Available' : 
           item.status === 'IN_USE' ? '❌ In Use' : 
           item.available ? '✅ Available' : '❌ Not Available'}
        </Text>
      </View>
      
      <View style={styles.vehicleActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleUpdateVehicle(item.id, item)}
        >
          <Text style={styles.actionText}>✏️</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteVehicle(item.id)}
        >
          <Text style={styles.actionText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && vehicles.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Connecting to backend...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by registration, brand or model..."
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
        <Text style={styles.addButtonText}>➕ Add Vehicle</Text>
      </TouchableOpacity>

      <View style={styles.counter}>
        <Text style={styles.counterText}>
          {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} registered
        </Text>
        <TouchableOpacity onPress={fetchVehicles}>
          <Text style={styles.refreshText}>🔄 Refresh</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderVehicleItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No vehicles registered</Text>
            <Text style={styles.emptySubtext}>Press "+ Add Vehicle" to start</Text>
          </View>
        }
        refreshing={loading}
        onRefresh={fetchVehicles}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Vehicle</Text>
            
            <ScrollView>
              <TextInput
                style={styles.modalInput}
                placeholder="Registration Number *"
                value={newVehicle.registrationNumber}
                onChangeText={(text) => setNewVehicle({...newVehicle, registrationNumber: text})}
              />
              
              <TextInput
                style={styles.modalInput}
                placeholder="Brand *"
                value={newVehicle.brand}
                onChangeText={(text) => setNewVehicle({...newVehicle, brand: text})}
              />
              
              <TextInput
                style={styles.modalInput}
                placeholder="Model *"
                value={newVehicle.model}
                onChangeText={(text) => setNewVehicle({...newVehicle, model: text})}
              />
              
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Vehicle Type:</Text>
                <View style={styles.picker}>
                  {vehicleTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeOption,
                        newVehicle.vehicleType === type && styles.typeOptionSelected
                      ]}
                      onPress={() => setNewVehicle({...newVehicle, vehicleType: type})}
                    >
                      <Text style={[
                        styles.typeOptionText,
                        newVehicle.vehicleType === type && styles.typeOptionTextSelected
                      ]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <TextInput
                style={styles.modalInput}
                placeholder="Year"
                value={newVehicle.year.toString()}
                onChangeText={(text) => setNewVehicle({...newVehicle, year: parseInt(text) || new Date().getFullYear()})}
                keyboardType="numeric"
              />
              
              <TextInput
                style={styles.modalInput}
                placeholder="Capacity (tons)"
                value={newVehicle.capacity}
                onChangeText={(text) => setNewVehicle({...newVehicle, capacity: text})}
                keyboardType="decimal-pad"
              />
              
              <TextInput
                style={styles.modalInput}
                placeholder="Color"
                value={newVehicle.color}
                onChangeText={(text) => setNewVehicle({...newVehicle, color: text})}
              />
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleCreateVehicle}
              >
                <Text style={styles.modalButtonText}>Save to Backend</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Text style={[
        styles.note,
        { 
          color: vehicles.length > 0 && vehicles[0].registrationNumber === 'MAD-1234-AB' ? '#e74c3c' : '#27ae60',
          backgroundColor: vehicles.length > 0 && vehicles[0].registrationNumber === 'MAD-1234-AB' ? '#fdf2f2' : '#e8f6f3'
        }
      ]}>
        {vehicles.length > 0 && vehicles[0].registrationNumber === 'MAD-1234-AB' 
          ? '⚠️ Using simulated data - Check vehicleService.js' 
          : '✅ Connected to Spring Boot backend'}
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
    backgroundColor: '#3498db',
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
    backgroundColor: '#9b59b6',
    marginHorizontal: 15,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  counterText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  refreshText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  list: {
    padding: 10,
  },
  vehicleCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 2,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleReg: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  vehicleDetail: {
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
  vehicleActions: {
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
  pickerContainer: {
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 8,
    fontWeight: '600',
  },
  picker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typeOption: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  typeOptionSelected: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  typeOptionText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  typeOptionTextSelected: {
    color: 'white',
    fontWeight: 'bold',
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
    fontSize: 12,
    fontStyle: 'italic',
    margin: 10,
    borderRadius: 5,
  },
});