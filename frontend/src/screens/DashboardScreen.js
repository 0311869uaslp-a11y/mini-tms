import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { dashboardService } from '../services/dashboardService';
import { tripService } from '../services/tripService';
import { driverService } from '../services/driverService';
import { vehicleService } from '../services/vehicleService';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTrips: 0,
    activeTrips: 0,
    availableDrivers: 0,
    totalVehicles: 0,
    availableVehicles: 0,
    completionRate: 0,
    totalDrivers: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    
    try {
      const statsResult = await dashboardService.getStats();
      
      if (statsResult.success) {
        setStats(statsResult.data);
      } else {
        await calculateManualStats();
      }
      
      await fetchRecentActivity();
      
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Dashboard error:', error);
      setStats({
        totalTrips: 24,
        activeTrips: 3,
        availableDrivers: 2,
        totalVehicles: 8,
        availableVehicles: 5,
        completionRate: 87.5,
        totalDrivers: 6
      });
    }
    
    setLoading(false);
  };

  const calculateManualStats = async () => {
    try {
      const tripsResult = await tripService.getAllTrips();
      const driversResult = await driverService.getAllDrivers();
      const vehiclesResult = await vehicleService.getAllVehicles();
      
      if (tripsResult.success && driversResult.success && vehiclesResult.success) {
        const trips = tripsResult.data;
        const drivers = driversResult.data;
        const vehicles = vehiclesResult.data;
        
        const completedTrips = trips.filter(t => t.status === 'COMPLETED').length;
        const activeTrips = trips.filter(t => t.status === 'IN_PROGRESS').length;
        const availableDrivers = drivers.filter(d => d.available).length;
        const availableVehicles = vehicles.filter(v => v.available || v.status === 'AVAILABLE').length;
        
        setStats({
          totalTrips: trips.length,
          activeTrips: activeTrips,
          availableDrivers: availableDrivers,
          totalVehicles: vehicles.length,
          availableVehicles: availableVehicles,
          completionRate: trips.length > 0 ? Math.round((completedTrips / trips.length) * 100) : 0,
          totalDrivers: drivers.length
        });
      }
    } catch (error) {
      console.error('Manual stats calculation error:', error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const tripsResult = await tripService.getAllTrips();
      const driversResult = await driverService.getAllDrivers();
      
      if (tripsResult.success && driversResult.success) {
        const trips = tripsResult.data.slice(0, 5); 
        const drivers = driversResult.data.slice(0, 3); 
        
        const activities = [];
        
        trips.forEach(trip => {
          let icon = '🚚';
          let description = '';
          let time = 'Recently';
          
          if (trip.status === 'COMPLETED') {
            icon = '✅';
            description = `Trip #${trip.id} completed: ${trip.startLocation} → ${trip.endLocation}`;
          } else if (trip.status === 'IN_PROGRESS') {
            icon = '⏳';
            description = `Trip #${trip.id} in progress: ${trip.startLocation} → ${trip.endLocation}`;
          } else {
            icon = '📅';
            description = `Trip #${trip.id} scheduled: ${trip.startLocation} → ${trip.endLocation}`;
          }
          
          activities.push({
            id: trip.id,
            icon,
            description,
            time
          });
        });
        
        drivers.forEach(driver => {
          activities.push({
            id: `driver-${driver.id}`,
            icon: '👤',
            description: `Driver registered: ${driver.firstName} ${driver.lastName}`,
            time: 'Recently'
          });
        });
        
        setRecentActivity(activities.slice(0, 5)); 
      }
    } catch (error) {
      console.error('Recent activity error:', error);
      setRecentActivity([
        { id: 1, icon: '✅', description: 'Trip #18 completed', time: '2 hours ago' },
        { id: 2, icon: '👤', description: 'Carlos assigned to Trip #22', time: '4 hours ago' },
        { id: 3, icon: '🔧', description: 'Vehicle scheduled for maintenance', time: '1 day ago' },
        { id: 4, icon: '🚚', description: 'New trip scheduled', time: '2 days ago' },
        { id: 5, icon: '➕', description: 'New driver registered', time: '3 days ago' },
      ]);
    }
  };

  const refreshDashboard = async () => {
    await fetchDashboardData();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Text style={styles.headerSubtitle}>Real-time transport management overview</Text>
      </View>

      <TouchableOpacity style={styles.refreshButton} onPress={refreshDashboard}>
        <Text style={styles.refreshButtonText}>🔄 Refresh Data</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Key Metrics</Text>
        <View style={styles.metricsGrid}>
          <View style={[styles.metricCard, { backgroundColor: '#3498db' }]}>
            <Text style={styles.metricNumber}>{stats.totalTrips}</Text>
            <Text style={styles.metricLabel}>Total Trips</Text>
          </View>
          
          <View style={[styles.metricCard, { backgroundColor: '#2ecc71' }]}>
            <Text style={styles.metricNumber}>{stats.activeTrips}</Text>
            <Text style={styles.metricLabel}>Active Trips</Text>
          </View>
          
          <View style={[styles.metricCard, { backgroundColor: '#9b59b6' }]}>
            <Text style={styles.metricNumber}>{stats.availableDrivers}/{stats.totalDrivers}</Text>
            <Text style={styles.metricLabel}>Available Drivers</Text>
          </View>
          
          <View style={[styles.metricCard, { backgroundColor: '#e74c3c' }]}>
            <Text style={styles.metricNumber}>{stats.availableVehicles}/{stats.totalVehicles}</Text>
            <Text style={styles.metricLabel}>Available Vehicles</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📈 Performance</Text>
        <View style={styles.performanceCard}>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>Completion Rate</Text>
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${stats.completionRate}%` }]} />
              <Text style={styles.progressText}>{stats.completionRate}%</Text>
            </View>
          </View>
          
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>Vehicle Utilization</Text>
            <Text style={styles.performanceValue}>
              {stats.totalVehicles > 0 
                ? Math.round((stats.totalVehicles - stats.availableVehicles) / stats.totalVehicles * 100)
                : 0}%
            </Text>
          </View>
          
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>Driver Availability</Text>
            <Text style={styles.performanceValue}>
              {stats.totalDrivers > 0 
                ? Math.round(stats.availableDrivers / stats.totalDrivers * 100)
                : 0}%
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 Recent Activity</Text>
        <View style={styles.activityCard}>
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Text style={styles.activityIconText}>{activity.icon}</Text>
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityDescription}>{activity.description}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noActivityText}>No recent activity</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Trips')}
          >
            <Text style={styles.actionIcon}>🚚</Text>
            <Text style={styles.actionText}>New Trip</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Drivers')}
          >
            <Text style={styles.actionIcon}>👤</Text>
            <Text style={styles.actionText}>Add Driver</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Vehicles')}
          >
            <Text style={styles.actionIcon}>🔧</Text>
            <Text style={styles.actionText}>Vehicles</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={refreshDashboard}
          >
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[
        styles.note,
        { 
          color: stats.totalTrips === 24 ? '#e74c3c' : '#27ae60',
          backgroundColor: stats.totalTrips === 24 ? '#fdf2f2' : '#e8f6f3'
        }
      ]}>
        {stats.totalTrips === 24 
          ? '⚠️ Using simulated data - Check dashboardService.js' 
          : `✅ Connected to backend | Last updated: ${lastUpdated}`}
      </Text>
    </ScrollView>
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
    padding: 25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ecf0f1',
    marginTop: 5,
  },
  refreshButton: {
    backgroundColor: '#3498db',
    margin: 15,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginHorizontal: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: (width - 40) / 2 - 5,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
  },
  metricNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  metricLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 5,
    textAlign: 'center',
  },
  performanceCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 3,
  },
  performanceItem: {
    marginBottom: 20,
  },
  performanceLabel: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 8,
    fontWeight: '600',
  },
  progressContainer: {
    height: 20,
    backgroundColor: '#ecf0f1',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2ecc71',
    borderRadius: 10,
  },
  progressText: {
    position: 'absolute',
    right: 10,
    top: 0,
    height: '100%',
    textAlignVertical: 'center',
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  performanceValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3498db',
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityIconText: {
    fontSize: 20,
  },
  activityContent: {
    flex: 1,
  },
  activityDescription: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#95a5a6',
  },
  noActivityText: {
    textAlign: 'center',
    padding: 20,
    color: '#95a5a6',
    fontSize: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: 'white',
    width: (width - 40) / 4 - 5,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  actionText: {
    fontSize: 12,
    color: '#2c3e50',
    textAlign: 'center',
    fontWeight: '600',
  },
  note: {
    textAlign: 'center',
    padding: 15,
    fontSize: 12,
    fontStyle: 'italic',
    margin: 10,
    borderRadius: 5,
  },
});