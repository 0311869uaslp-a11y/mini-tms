import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';

export default function HomeScreen({ navigation }) {
  const menuItems = [
    {
      title: '👤 Drivers',
      screen: 'Drivers',
      color: '#2ecc71',
      count: 'Manage drivers'
    },
    {
      title: '🚚 Vehicles',
      screen: 'Vehicles',
      color: '#3498db',
      count: 'Manage vehicles'
    },
    {
      title: '📍 Trips',
      screen: 'Trips',
      color: '#9b59b6',
      count: 'Manage trips'
    },
    {
      title: '📊 Dashboard',
      screen: 'Dashboard',
      color: '#e74c3c',
      count: 'View statistics'
    },
    {
      title: '🔗 Connection Test',
      screen: 'ConnectionTest',
      color: '#f39c12',
      count: 'Test backend'
    },
    {
      title: '🧪 Test Screen',
      screen: 'Test',
      color: '#95a5a6',
      count: 'Testing'
    },
  ];

  const handleItemPress = (item) => {
    navigation.navigate(item.screen);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Navega directamente al login
            navigation.replace('Login');
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, Administrator!</Text>
        <Text style={styles.date}>Transport Management System</Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>System Overview</Text>
        
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { borderLeftColor: item.color }]}
            onPress={() => handleItemPress(item)}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardCount}>{item.count}</Text>
            </View>
            <Text style={styles.cardArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Trips')}
          >
            <Text style={styles.actionText}>➕ New Trip</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Drivers')}
          >
            <Text style={styles.actionText}>👤 Add Driver</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>

      <Text style={styles.instruction}>
        ✅ App running successfully. 
        {'\n'}Next: Connect to Spring Boot backend.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#2c3e50',
    padding: 25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  date: {
    fontSize: 16,
    color: '#bdc3c7',
    marginTop: 5,
  },
  statsContainer: {
    margin: 20,
    marginTop: 30,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  cardCount: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  cardArrow: {
    fontSize: 30,
    color: '#95a5a6',
    marginLeft: 10,
  },
  quickActions: {
    margin: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  instruction: {
    textAlign: 'center',
    margin: 20,
    marginTop: 20,
    color: '#27ae60',
    fontSize: 16,
    lineHeight: 22,
    backgroundColor: '#e8f6f3',
    padding: 15,
    borderRadius: 8,
  },
});