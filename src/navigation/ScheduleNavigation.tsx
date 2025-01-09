import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { useCustomerSchedule } from "../context/CustomerPTScheduleContext";

import TrainerPTScheduleScreen from '../screens/TrainerPTScheduleScreen';
import CustomerPTScheduleScreen from '../screens/CustomerPTScheduleScreen';
import LoadingScreen from '../screens/LoadingScreen';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
    const { userType } = useCustomerSchedule(); // userType 가져오기
    
    console.log(userType);

    if (!userType) {
        return <LoadingScreen />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {userType === 'trainer' ? (
                    <Stack.Screen
                        name="Trainer"
                        component={TrainerPTScheduleScreen}
                        options={{ headerShown: false }}
                    />
                ) : (
                    <Stack.Screen
                        name="Customer"
                        component={CustomerPTScheduleScreen}
                        options={{ headerShown: false }}
                    />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;