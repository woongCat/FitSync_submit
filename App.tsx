import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import RootNavigation from './src/navigation/RootNavigation';
import { AuthProvider } from './src/context/AuthContext';
import { ExerciseProvider } from './src/context/ExerciseContext';
import { RecordProvider } from './src/context/RecordContext';
import { PTScheduleProvider } from './src/context/PTScheduleContext';


function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <ExerciseProvider>
        <RecordProvider>
          <PTScheduleProvider>
            <NavigationContainer>
              <RootNavigation />
            </NavigationContainer>
          </PTScheduleProvider>
        </RecordProvider>
      </ExerciseProvider>
    </AuthProvider>
  );
}

export default App;