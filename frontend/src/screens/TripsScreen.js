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
import { tripService } from '../services/tripService';
import { driverService } from '../services/driverService';
import { vehicleService } from '../services/vehicleService';

export default function TripsScreen() {
  const [trips, setTrips] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  
  const [newTrip, setNewTrip] = useState({
    startLocation: '',
    endLocation: '',
    scheduledStart: '',
    scheduledEnd: '',
    distance: '',
    cargoDescription: '',
    cargoWeight: '',
    driverId: '',
    vehicleId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    const tripsResult = await tripService.getAllTrips();
    const driversResult = await driverService.getAllDrivers();
    const vehiclesResult = await vehicleService.getAllVehicles();
    
    if (tripsResult.success) {
      setTrips(tripsResult.data);
    } else {
      Alert.alert('Error', 'Could not load trips: ' + tripsResult.error);
      setTrips([
        {
          id: 1,
          startLocation: 'Madrid',
          endLocation: 'Barcelona',
          scheduledStart: '2024-12-30T08:00:00',
          scheduledEnd: '2024-12-30T14:00:00',
          distance: 600,
          estimatedDuration: 6,
          cargoDescription: 'Electronics',
          cargoWeight: 15.5,
          status: 'IN_PROGRESS',
          driver: { id: 1, firstName: 'Carlos', lastName: 'González' },
          vehicle: { id: 1, registrationNumber: 'MAD-1234-AB' }
        }
      ]);
    }
    
    if (driversResult.success) setDrivers(driversResult.data);
    if (vehiclesResult.success) setVehicles(vehiclesResult.data);
    
    setLoading(false);
  };

  const handleCreateTrip = async () => {
    if (!newTrip.startLocation || !newTrip.endLocation || !newTrip.driverId || !newTrip.vehicleId) {
      Alert.alert('Error', 'Start location, end location, driver and vehicle are required');
      return;
    }

    let scheduledStart = newTrip.scheduledStart;
    let scheduledEnd = newTrip.scheduledEnd;
    
    if (scheduledStart && !scheduledStart.includes('T')) {
      scheduledStart += 'T08:00:00';
    }
    
    if (scheduledEnd && !scheduledEnd.includes('T')) {
      scheduledEnd += 'T16:00:00';
    }

    const tripData = {
      startLocation: newTrip.startLocation,
      endLocation: newTrip.endLocation,
      scheduledStart: scheduledStart || new Date().toISOString(),
      scheduledEnd: scheduledEnd || new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      distance: parseFloat(newTrip.distance) || 100,
      estimatedDuration: parseFloat(newTrip.distance) / 100 || 6,
      cargoDescription: newTrip.cargoDescription,
      cargoWeight: parseFloat(newTrip.cargoWeight) || 5,
      driver: { id: parseInt(newTrip.driverId) },
      vehicle: { id: parseInt(newTrip.vehicleId) }
    };

    const result = await tripService.createTrip(tripData);
    
    if (result.success) {
      Alert.alert('✅ Success', 'Trip created successfully');
      setModalVisible(false);
      setNewTrip({
        startLocation: '',
        endLocation: '',
        scheduledStart: '',
        scheduledEnd: '',
        distance: '',
        cargoDescription: '',
        cargoWeight: '',
        driverId: '',
        vehicleId: ''
      });
      fetchData(); // Recargar datos
    } else {
      Alert.alert('❌ Error', result.error || 'Could not create trip');
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    const result = await tripService.updateTripStatus(id, newStatus);
    
    if (result.success) {
      Alert.alert('✅ Status Updated', `Trip #${id} is now ${newStatus}`);
      fetchData(); 
    } else {
      Alert.alert('❌ Error', result.error || 'Could not update status');
    }
  };

  const handleDeleteTrip = (id) => {
    Alert.alert(
      'Delete Trip',
      'Are you sure you want to delete this trip?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await tripService.deleteTrip(id);
            if (result.success) {
              Alert.alert('✅ Success', 'Trip deleted');
              fetchData();
            } else {
              Alert.alert('❌ Error', 'Could not delete trip: ' + result.error);
            }
          }
        }
      ]
    );
  };

  const renderTripItem = ({ item }) => (
    <View style={styles.tripCard}>
      <View style={styles.tripInfo}>
        <View style={styles.tripHeader}>
          <Text style={styles.tripTitle}>Trip #{item.id}</Text>
          <Text style={[
            styles.statusBadge,
            { 
              backgroundColor: 
                item.status === 'COMPLETED' ? '#2ecc71' :
                item.status === 'IN_PROGRESS' ? '#3498db' :
                item.status === 'SCHEDULED' ? '#f39c12' : '#e74c3c'
            }
          ]}>
            {item.status ? item.status.replace('_', ' ') : 'UNKNOWN'}
          </Text>
        </View>
        
        <Text style={styles.tripRoute}>
          🚚 {item.startLocation} → {item.endLocation}
        </Text>
        
        <Text style={styles.tripDetail}>Distance: {item.distance || 0} km</Text>
        <Text style={styles.tripDetail}>Duration: {item.estimatedDuration || 0} hours</Text>
        <Text style={styles.tripDetail}>Cargo: {item.cargoDescription || 'No description'}</Text>
        <Text style={styles.tripDetail}>Weight: {item.cargoWeight || 0} tons</Text>
        
        <View style={styles.tripMeta}>
          <Text style={styles.tripMetaText}>
            Driver: {item.driver?.firstName} {item.driver?.lastName || 'Not assigned'}
          </Text>
          <Text style={styles.tripMetaText}>
            Vehicle: {item.vehicle?.registrationNumber || 'Not assigned'}
          </Text>
        </View>
      </View>
      
      <View style={styles.tripActions}>
        {item.status === 'SCHEDULED' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.startButton]}
            onPress={() => handleUpdateStatus(item.id, 'IN_PROGRESS')}
          >
            <Text style={styles.actionText}>▶ Start</Text>
          </TouchableOpacity>
        )}
        
        {item.status === 'IN_PROGRESS' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.completeButton]}
            onPress={() => handleUpdateStatus(item.id, 'COMPLETED')}
          >
            <Text style={styles.actionText}>✓ Complete</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteTrip(item.id)}
        >
          <Text style={styles.actionText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && trips.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Connecting to backend...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trip Management</Text>
        <Text style={styles.headerSubtitle}>Track and manage all transport operations</Text>
      </View>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>➕ Schedule New Trip</Text>
      </TouchableOpacity>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{trips.length}</Text>
          <Text style={styles.statLabel}>Total Trips</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {trips.filter(t => t.status === 'IN_PROGRESS').length}
          </Text>
          <Text style={styles.statLabel}>In Progress</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {trips.filter(t => t.status === 'COMPLETED').length}
          </Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.refreshButton} onPress={fetchData}>
        <Text style={styles.refreshButtonText}>🔄 Refresh Trips</Text>
      </TouchableOpacity>

      <FlatList
        data={trips}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={renderTripItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No trips scheduled</Text>
            <Text style={styles.emptySubtext}>Press "+ Schedule New Trip" to start</Text>
          </View>
        }
        refreshing={loading}
        onRefresh={fetchData}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Schedule New Trip</Text>
            
            <ScrollView>
              <TextInput
                style={styles.modalInput}
                placeholder="Start Location *"
                value={newTrip.startLocation}
                onChangeText={(text) => setNewTrip({...newTrip, startLocation: text})}
              />
              
              <TextInput
                style={styles.modalInput}
                placeholder="End Location *"
                value={newTrip.endLocation}
                onChangeText={(text) => setNewTrip({...newTrip, endLocation: text})}
              />
              
              <TextInput
                style={styles.modalInput}
                placeholder="Distance (km)"
                value={newTrip.distance}
                onChangeText={(text) => setNewTrip({...newTrip, distance: text})}
                keyboardType="numeric"
              />
              
              <TextInput
                style={styles.modalInput}
                placeholder="Cargo Description"
                value={newTrip.cargoDescription}
                onChangeText={(text) => setNewTrip({...newTrip, cargoDescription: text})}
              />
              
              <TextInput
                style={styles.modalInput}
                placeholder="Cargo Weight (tons)"
                value={newTrip.cargoWeight}
                onChangeText={(text) => setNewTrip({...newTrip, cargoWeight: text})}
                keyboardType="decimal-pad"
              />
              
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Select Driver *</Text>
                <ScrollView horizontal style={styles.driverPicker}>
                  {drivers.map((driver) => (
                    <TouchableOpacity
                      key={driver.id}
                      style={[
                        styles.pickerOption,
                        newTrip.driverId === driver.id.toString() && styles.pickerOptionSelected
                      ]}
                      onPress={() => setNewTrip({...newTrip, driverId: driver.id.toString()})}
                    >
                      <Text style={[
                        styles.pickerOptionText,
                        newTrip.driverId === driver.id.toString() && styles.pickerOptionTextSelected
                      ]}>
                        {driver.firstName} {driver.lastName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Select Vehicle *</Text>
                <ScrollView horizontal style={styles.vehiclePicker}>
                  {vehicles.map((vehicle) => (
                    <TouchableOpacity
                      key={vehicle.id}
                      style={[
                        styles.pickerOption,
                        newTrip.vehicleId === vehicle.id.toString() && styles.pickerOptionSelected
                      ]}
                      onPress={() => setNewTrip({...newTrip, vehicleId: vehicle.id.toString()})}
                    >
                      <Text style={[
                        styles.pickerOptionText,
                        newTrip.vehicleId === vehicle.id.toString() && styles.pickerOptionTextSelected
                      ]}>
                        {vehicle.registrationNumber} ({vehicle.brand})
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              <Text style={styles.dateNote}>
                Note: Start and end times will be set automatically if not provided
              </Text>
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
                onPress={handleCreateTrip}
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
          color: trips.length > 0 && trips[0].startLocation === 'Madrid' ? '#e74c3c' : '#27ae60',
          backgroundColor: trips.length > 0 && trips[0].startLocation === 'Madrid' ? '#fdf2f2' : '#e8f6f3'
        }
      ]}>
        {trips.length > 0 && trips[0].startLocation === 'Madrid' 
          ? '⚠️ Using simulated data - Check tripService.js' 
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
  header: {
    backgroundColor: '#2c3e50',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#ecf0f1',
    marginTop: 5,
  },
  addButton: {
    backgroundColor: '#9b59b6',
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
  refreshButton: {
    backgroundColor: '#3498db',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 15,
    marginBottom: 15,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 5,
  },
  list: {
    padding: 10,
  },
  tripCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  tripInfo: {
    flex: 1,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  tripRoute: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  tripDetail: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 3,
  },
  tripMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  tripMetaText: {
    fontSize: 12,
    color: '#95a5a6',
    fontStyle: 'italic',
  },
  tripActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 10,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#2ecc71',
  },
  completeButton: {
    backgroundColor: '#3498db',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    minWidth: 40,
  },
  actionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
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
  driverPicker: {
    flexDirection: 'row',
  },
  vehiclePicker: {
    flexDirection: 'row',
  },
  pickerOption: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginRight: 8,
    backgroundColor: '#f9f9f9',
  },
  pickerOptionSelected: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  pickerOptionText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  pickerOptionTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  dateNote: {
    fontSize: 12,
    color: '#95a5a6',
    fontStyle: 'italic',
    marginBottom: 15,
    textAlign: 'center',
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