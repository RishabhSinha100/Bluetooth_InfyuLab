import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { getUserDetails } from '../auth';
import { getToken, clearToken } from '../storage';
import BluetoothManager from './BluetoothManager';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        const res = await getUserDetails(token);
        setUser(res.data.data.userDetails);
      } catch (err) {
        console.log('Error fetching user:', err);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    await clearToken();
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>← Logout</Text>
      </TouchableOpacity>

      {user ? (
        <>
          <Text style={styles.title}>👤 {user.name}</Text>
          <Text style={styles.detail}>Email: {user.email}</Text>
          <Text style={styles.detail}>Mobile: {user.mobile}</Text>
          <Text style={styles.detail}>Category: {user.category}</Text>
        </>
      ) : (
        <ActivityIndicator size="large" color="#4ecca3" />
      )}
        <BluetoothManager />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  detail: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  logoutButton: {
    position: 'absolute',
    top: 10,
    left: 15,
  },
  logoutText: {
    color: '#4ecca3',
    fontSize: 16,
  },
});
