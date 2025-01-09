import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import RootNavigation from './src/navigation/RootNavigation';
import { AuthProvider } from './src/context/AuthContext';
import { ExerciseProvider } from './src/context/ExerciseContext';
import { RecordProvider } from './src/context/RecordContext';
import { TrainerPTScheduleProvider } from './src/context/TrainerPTScheduleContext'; // 추가

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <ExerciseProvider>
        <RecordProvider>
          <TrainerPTScheduleProvider>
            <NavigationContainer>
              <RootNavigation />
            </NavigationContainer>
          </TrainerPTScheduleProvider>
        </RecordProvider>
      </ExerciseProvider>
    </AuthProvider>
  );
}

export default App;