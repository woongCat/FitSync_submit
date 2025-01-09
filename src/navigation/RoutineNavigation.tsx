import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import RoutineScreen from '../screens/RoutineScreen';
import ChooseOptionScreen from '../screens/ChooseOptionScreen';
import CameraShotScreen from '../screens/CameraShotScreen';
import UpdateRoutineScreen from '../screens/UpdateRoutineScreen';
import CreateRoutineScreen from '../screens/CreateRoutineScreen';
import { Exercise } from '../context/ExerciseContext';
import { Routine, Record } from '../context/RecordContext';


export type RoutineStackParamList = {
    RoutineDetail : undefined;
    ChooseOption : undefined;
    CameraShot : undefined;
    CreateRoutine : { selectedExercise?: Exercise };
    UpdateRoutine : { selectedRoutines : Routine[] };
}

const RoutineStack = createNativeStackNavigator<RoutineStackParamList>()
type NavigationProp = NativeStackNavigationProp<RoutineStackParamList>

const RoutineNavigation : React.FC = () => {

    const navigation = useNavigation<NavigationProp>();

    return (
        <RoutineStack.Navigator initialRouteName="RoutineDetail">
            <RoutineStack.Screen
                name = "RoutineDetail"
                component={RoutineScreen}
                options={{headerShown : false}}
            />
            <RoutineStack.Screen
                name = "ChooseOption"
                component={ChooseOptionScreen}
                options={{ headerShown : false, title: 'Choose Option' }}
            />
            <RoutineStack.Screen
                name = "CameraShot"
                component={CameraShotScreen}
                options={{headerShown : false}}
            />
            <RoutineStack.Screen
                name = "CreateRoutine"
                component={CreateRoutineScreen}
                options={{ title: 'Create New Record' }}
            />
            <RoutineStack.Screen
                name = "UpdateRoutine"
                component={UpdateRoutineScreen}
                options={{headerShown : false}}
            />
        </RoutineStack.Navigator>
    );
};

export default RoutineNavigation;