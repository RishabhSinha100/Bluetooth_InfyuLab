import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, Platform, PermissionsAndroid, Alert, StyleSheet
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const manager = new BleManager();

const BluetoothManager = () => {
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const scanTimeoutRef = useRef(null);

  useEffect(() => {
    requestPermissions();

    const disconnectionListener = manager.onDeviceDisconnected((device) => {
      if (connectedDevice?.id === device.id) {
        setConnectedDevice(null);
        Alert.alert("Disconnected", "Bluetooth device disconnected");
      }
    });

    return () => {
      manager.stopDeviceScan();
      if (connectedDevice) {
        manager.cancelDeviceConnection(connectedDevice.id);
      }
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
      disconnectionListener.remove();
    };
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const permissions = [
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ];

        if (Platform.Version >= 31) {
          permissions.push(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
          );
        }

        const granted = await PermissionsAndroid.requestMultiple(permissions);
        const allGranted = Object.values(granted).every(
          permission => permission === PermissionsAndroid.RESULTS.GRANTED
        );

        if (!allGranted) {
          Alert.alert('Permissions required', 'Bluetooth permissions are needed.');
          return false;
        }
        return true;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const checkBluetoothState = async () => {
    const state = await manager.state();
    if (state !== 'PoweredOn') {
      Alert.alert('Bluetooth is off', 'Please enable Bluetooth.');
      return false;
    }
    return true;
  };

  const scanDevices = async () => {
    if (isScanning) {
      manager.stopDeviceScan();
      setIsScanning(false);
      clearTimeout(scanTimeoutRef.current);
      return;
    }

    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    const isBluetoothOn = await checkBluetoothState();
    if (!isBluetoothOn) return;

    setDevices([]);
    setIsScanning(true);

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        Alert.alert('Scan error', error.message);
        setIsScanning(false);
        return;
      }
if (device && device.name ) {
  console.log('📡 Found Connectable Device with Name:', JSON.stringify(device, null, 2));
  setDevices(prev => {
    if (!prev.some(d => d.id === device.id)) {
      return [...prev, device];
    }
    return prev;
  });
}
    });

    scanTimeoutRef.current = setTimeout(() => {
      manager.stopDeviceScan();
      setIsScanning(false);
    }, 30000);
  };

  const connectToDevice = async (device) => {
    try {
      const connected = await manager.connectToDevice(device.id);
      setConnectedDevice(connected);
      await connected.discoverAllServicesAndCharacteristics();
      Alert.alert("Connected", `Successfully connected to ${device.name}`);
    } catch (err) {
      Alert.alert("Connection Error", err.message);
    }
  };

  const disconnectDevice = async () => {
    if (connectedDevice) {
      try {
        await manager.cancelDeviceConnection(connectedDevice.id);
        setConnectedDevice(null);
        Alert.alert("Disconnected", "Device disconnected");
      } catch (err) {
        Alert.alert("Error", err.message);
      }
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.scanButton, isScanning && styles.scanningButton]}
        onPress={scanDevices}
      >
        <Text style={styles.scanButtonText}>
          {isScanning ? '🛑 Stop Scanning' : '🔍 Scan Bluetooth Devices'}
        </Text>
      </TouchableOpacity>

      {connectedDevice && (
        <View style={styles.deviceInfo}>
          <Text style={styles.connectedTitle}>Connected Device:</Text>
          <Text style={styles.deviceText}>Name: {connectedDevice.name}</Text>
          <Text style={styles.deviceText}>ID: {connectedDevice.id}</Text>
           {/* <Text style={styles.deviceText}>RSSI: {item.rssi}</Text> */}
          <TouchableOpacity style={styles.disconnectButton} onPress={disconnectDevice}>
            <Text style={{ color: '#fff' }}>Disconnect</Text>
          </TouchableOpacity>
        </View>
      )}
       

      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.deviceItem} onPress={() => connectToDevice(item)}>
            <Text style={styles.deviceName}>{item.name || 'Unnamed'}</Text>
            <Text style={styles.deviceText}>ID: {item.id}</Text>
             {/* <Text style={styles.deviceText}>RSSI: {item.rssi}</Text> */}
             {item.rssi != null && (
  <Text style={styles.deviceText}>RSSI: {item.rssi}</Text>
)}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.deviceText}>
            {isScanning ? 'Scanning for devices...' : 'No devices found.'}
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scanButton: {
    backgroundColor: '#4ecca3',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  scanningButton: {
    backgroundColor: '#ff5c5c',
  },
  scanButtonText: {
    fontWeight: 'bold',
    color: '#000',
  },
  deviceItem: {
    padding: 10,
    backgroundColor: '#1f1f1f',
    marginBottom: 8,
    borderRadius: 6,
  },
  deviceName: {
    fontWeight: 'bold',
    color: '#4ecca3',
  },
  deviceText: {
    color: '#ccc',
  },
  deviceInfo: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  connectedTitle: {
    color: '#4ecca3',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  disconnectButton: {
    backgroundColor: '#ff5c5c',
    padding: 10,
    marginTop: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
});

export default BluetoothManager;


