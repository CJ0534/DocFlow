import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import OrganizationDetailScreen from './screens/OrganizationDetailScreen';
import ProjectDetailScreen from './screens/ProjectDetailScreen';
import DocumentDetailScreen from './screens/DocumentDetailScreen';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { testConnection } from './services/api';

const Stack = createNativeStackNavigator();

function AuthNavigator() {
  const { user, loading } = useAuth();

  // Test connection on app start
  useEffect(() => {
    const test = async () => {
      console.log('🚀 App started, testing backend connection...');
      const result = await testConnection();
      if (result.success) {
        console.log('✅ Backend connection OK');
      } else {
        console.error('❌ Backend connection failed:', result.error);
      }
    };
    test();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1a1a2e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        {user ? (
          <>
            <Stack.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="OrganizationDetail"
              component={OrganizationDetailScreen}
            />
            <Stack.Screen
              name="ProjectDetail"
              component={ProjectDetailScreen}
            />
            <Stack.Screen
              name="DocumentDetail"
              component={DocumentDetailScreen}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AuthNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
});
