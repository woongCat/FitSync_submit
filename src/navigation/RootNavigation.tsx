import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import TabNavgation from './TabNavigation';
import IndexScreen from '../screens/IndexScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';


export type RootStackParamList = {
    Login : undefined;
    SignUp : undefined;
    Index : undefined;
    TabNav : undefined;
}

const RootStack = createNativeStackNavigator<RootStackParamList>()
type NavigationProp = NativeStackNavigationProp<RootStackParamList>

const RootNavigation : React.FC = () => {

const navigation = useNavigation<NavigationProp>();
const {isAuthenticated, isLoading} = useContext(AuthContext);

useEffect(() => {
    if(!isLoading) {
        if (isAuthenticated) {
            navigation.reset({
                index : 0,
                routes : [{name: 'TabNav'}]
            })
        } else {
            navigation.reset({
                index : 0,
                routes : [{name : 'Login'}]
            })
        }
    }
}, [isAuthenticated, isLoading, navigation]);

    return (
        <RootStack.Navigator initialRouteName="Login">
            <RootStack.Screen 
                name = "Login" 
                component={LoginScreen}
                options={{headerShown : false}}
            />
            <RootStack.Screen 
                name = "SignUp" 
                component={SignUpScreen}
            />
            <RootStack.Screen 
                name = "Index" 
                component={IndexScreen}
                options={{headerShown : false}}
            />
            <RootStack.Screen 
                name = "TabNav" 
                component={TabNavgation}
                options={{headerShown : false}}
            />
        </RootStack.Navigator>
    );
};

export default RootNavigation;