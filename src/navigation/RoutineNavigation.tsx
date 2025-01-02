import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useContext, useEffect } from 'react';
import RoutineScreen from '../screens/RoutineScreen';
import ChooseOptionScreen from '../screens/ChooseOptionScreen';
import FileSearchScreen from '../screens/FileSearchScreen';
import CameraShotScreen from '../screens/CameraShotScreen';


export type RoutineStackParamList = {
    Routine : undefined;
    ChooseOption : undefined;
    CameraShot : undefined;
    FileSearch : undefined;
}

const RoutineStack = createNativeStackNavigator<RoutineStackParamList>()
type NavigationProp = NativeStackNavigationProp<RoutineStackParamList>

const RoutineNavigation : React.FC = () => {

    const navigation = useNavigation<NavigationProp>();

    return (
        <RoutineStack.Navigator initialRouteName="Routine">
            <RoutineStack.Screen
                name = "Routine"
                component={RoutineScreen}
                options={{headerShown : false}}
            />
            <RoutineStack.Screen
                name = "ChooseOption"
                component={ChooseOptionScreen}
            />
            <RoutineStack.Screen
                name = "CameraShot"
                component={CameraShotScreen}
                options={{headerShown : false}}
            />
            <RoutineStack.Screen
                name = "FileSearch"
                component={FileSearchScreen}
            />
        </RoutineStack.Navigator>
    );
};

export default RoutineNavigation;