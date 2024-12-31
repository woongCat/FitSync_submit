import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import RootNavigation from './src/navigation/RootNavigation';
import { AuthProvider } from './src/context/AuthContext';

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigation />
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
