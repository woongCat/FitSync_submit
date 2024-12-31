import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import MenuScreen from '../screens/MenuScreen';
import { useNavigation } from '@react-navigation/native';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';


export type RootStackParamList = {
    Login : undefined,
    SignUp : undefined,
    Home : undefined,
    Menu : undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()
type NavigationProp = NativeStackNavigationProp<RootStackParamList>

const RootNavigation : React.FC = () => {

const navigation = useNavigation<NavigationProp>();
const {isAuthenticated, isLoading} = useContext(AuthContext);

useEffect(() => {
    if(!isLoading) {
        if (isAuthenticated) {
            navigation.reset({
                index : 0,
                routes : [{name: 'Home'}]
            })
        } else {
            navigation.reset({
                index : 0,
                routes : [{name : 'Login'}]
            })
        }
    }
}, [isAuthenticated, isLoading, navigation])

    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen 
                name = "Login" 
                component={LoginScreen}
                options={{headerShown : false}}
            />
            <Stack.Screen 
                name = "SignUp" 
                component={SignUpScreen}
            />
            <Stack.Screen 
                name = "Home" 
                component={HomeScreen}
                options={{headerShown : false}}
            />
            <Stack.Screen 
                name = "Menu" 
                component={MenuScreen}
                options={{headerShown : false}}
            />
        </Stack.Navigator>
    );
};

export default RootNavigation;