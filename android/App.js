import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import OrganizationsScreen from './src/screens/OrganizationsScreen';
import ProjectsScreen from './src/screens/ProjectsScreen';
import DocumentsScreen from './src/screens/DocumentsScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: true }}>
                {user ? (
                    <>
                        <Stack.Screen
                            name="Organizations"
                            component={OrganizationsScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Projects"
                            component={ProjectsScreen}
                            options={{ title: 'Projects' }}
                        />
                        <Stack.Screen
                            name="Documents"
                            component={DocumentsScreen}
                            options={{ title: 'Documents' }}
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
            <AppNavigator />
        </AuthProvider>
    );
}
