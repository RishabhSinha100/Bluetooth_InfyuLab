import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { registerUser } from '../auth';
import { storeToken } from '../storage';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    category: '',
    password: '',
    confirmPassword: '',
  });

  const handleRegister = async () => {
    if (form.password !== form.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    const data = new FormData();
    for (const key in form) data.append(key, form[key]);

    try {
      const res = await registerUser(data);
      const token = res.data.data.token;
      await storeToken(token);
      navigation.replace('Profile');
    } catch (err) {
      Alert.alert('Registration Failed', err.response?.data?.message || err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ✅ Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/logo.png')} // replace with your logo
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Create Account</Text>

      {Object.entries(form).map(([field, value]) => (
        <TextInput
          key={field}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          placeholderTextColor="#aaa"
          style={styles.input}
          value={value}
          secureTextEntry={field.toLowerCase().includes('password')}
          onChangeText={(text) => setForm({ ...form, [field]: text })}
        />
      ))}

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.link}>Login</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0f0f0f',
    paddingHorizontal: 30,
    paddingTop: 50,
    paddingBottom: 40,
    flexGrow: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  logo: {
    width: 90,
    height: 90,
  },
  title: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  registerButton: {
    backgroundColor: '#4ecca3',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: '#0f0f0f',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
  link: {
    color: '#4ecca3',
    fontWeight: 'bold',
  },
});
