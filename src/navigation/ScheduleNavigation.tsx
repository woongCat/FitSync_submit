import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import ScheduleScreen from '../screens/PTScheduleScreen';
import { Schedule } from '../context/PTScheduleContext';

export type ScheduleStackParamList = {
    ScheduleDetail : undefined;
    ScheduleInfo : {selectedSchedule : Schedule};
}

const ScheduleStack = createNativeStackNavigator<ScheduleStackParamList>()
type NavigationProp = NativeStackNavigationProp<ScheduleStackParamList>

const RoutineNavigation : React.FC = () => {

    const navigation = useNavigation<NavigationProp>();

    return (
        <ScheduleStack.Navigator initialRouteName="ScheduleDetail">
            <ScheduleStack.Screen
                name = "ScheduleInfo"
                component={ScheduleScreen}
                options={{headerShown : false}}
            />;

        </ScheduleStack.Navigator>
    )
};
