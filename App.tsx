import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import RootNavigation from './src/navigation/RootNavigation';
import { AuthProvider } from './src/context/AuthContext';
import { ExerciseProvider } from './src/context/ExerciseContext';

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <ExerciseProvider>
        <NavigationContainer>
          <RootNavigation />
        </NavigationContainer>
      </ExerciseProvider>
    </AuthProvider>
  );
}

export default App;
