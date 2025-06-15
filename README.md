# 📲 Bluetooth Device Connector App

A simple React Native application that allows user authentication, displays user profile details, and  scanning device connection functionality.

---

## 🛠 Tech Stack

- **Framework**: React Native CLI
- **Bluetooth Library**: [`react-native-ble-plx`](https://github.com/dotintent/react-native-ble-plx)
- **Networking**: Axios
- **State Management**: React Hooks, Context API

---

## 📦 Features

### 🔐 Authentication

- User **Registration** and **Login** using backend APIs
- Secure token storage with access to protected routes
- Fetch and display **user profile** after login

### 📡 Bluetooth

- Scan for **nearby BLE devices**
- Display device name, UUID/MAC, and signal strength (RSSI)
- Connect to a selected device
- Show connection status and device details
- Disconnect functionality

---
## 🚀 How to Setup & Run
- git clone https://github.com/RishabhSinha100/Bluetooth_InfyuLab
- cd Bluetooth_InfyuLab
- cd blue
- npm install
- npm install axios
npm install @react-native-async-storage/async-storage
npm install react-native-ble-plx
- Ensure the following permissions are in android/app/src/main/AndroidManifest.xml
 <uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

-npx react-native run-android



