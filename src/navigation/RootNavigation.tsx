import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useCustomerSchedule } from '../context/CustomerPTScheduleContext';  // useCustomerSchedule 추가
import TabNavgation from './TabNavigation';
import IndexScreen from '../screens/IndexScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import TrainerPTScheduleScreen from '../screens/TrainerPTScheduleScreen';
import CustomerPTScheduleScreen from '../screens/CustomerPTScheduleScreen';

export type RootStackParamList = {
    Login: undefined;
    SignUp: undefined;
    Index: undefined;
    TabNav: undefined;
    Trainer: undefined;
    Customer: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const RootNavigation: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const { isAuthenticated, isLoading } = useContext(AuthContext);
    const { userType } = useCustomerSchedule(); // useCustomerSchedule을 통해 userType 가져오기

    useEffect(() => {
        if (!isLoading) {
            if (isAuthenticated) {
                if (userType === 'trainer') {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Trainer' }]
                    });
                } else if (userType === 'customer') {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Customer' }]
                    });
                } else {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'TabNav' }]
                    });
                }
            } else {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }]
                });
            }
        }
    }, [isAuthenticated, isLoading, navigation, userType]); // userType 추가

    return (
        <RootStack.Navigator initialRouteName="Login">
            <RootStack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
            <RootStack.Screen
                name="SignUp"
                component={SignUpScreen}
            />
            <RootStack.Screen
                name="Index"
                component={IndexScreen}
                options={{ headerShown: false }}
            />
            <RootStack.Screen
                name="TabNav"
                component={TabNavgation}
                options={{ headerShown: false }}
            />
            <RootStack.Screen
                name="Trainer"
                component={TrainerPTScheduleScreen} // 트레이너 화면 추가
                options={{ headerShown: false }}
            />
            <RootStack.Screen
                name="Customer"
                component={CustomerPTScheduleScreen} // 고객 화면 추가
                options={{ headerShown: false }}
            />
        </RootStack.Navigator>
    );
};

export default RootNavigation;