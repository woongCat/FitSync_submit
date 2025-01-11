import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import RootNavigation from './src/navigation/RootNavigation';
import { AuthProvider } from './src/context/AuthContext';
import { ExerciseProvider } from './src/context/ExerciseContext';
import { RecordProvider } from './src/context/RecordContext';
import RoutineNavigation from './src/navigation/RoutineNavigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavgation from './src/navigation/TabNavigation';
import { GymProvider } from './src/context/GymContext';
import { RegistrationProvider } from './src/context/RegistrationContext';
import { AnalyticsProvider } from './src/context/AnalyticsContext';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <ExerciseProvider>
        <RecordProvider>
          <GymProvider>
            <RegistrationProvider>
              <AnalyticsProvider>
                <NavigationContainer>
                  <Stack.Navigator>
                      <Stack.Screen name="Root" component={RootNavigation} options={{headerShown : false}}/>
                      <Stack.Screen name="Tabs" component={TabNavgation} options={{headerShown : false}}/>
                      <Stack.Screen name="Routine" component={RoutineNavigation} options={{headerShown : false}}/>
                    </Stack.Navigator>
                </NavigationContainer>
              </AnalyticsProvider>
            </RegistrationProvider>
          </GymProvider>
        </RecordProvider>
      </ExerciseProvider> 
    </AuthProvider>
  );
}

export default App;
