import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import HomeScreen from "../screens/HomeScreen";
import RoutineScreen from "../screens/RoutineScreen";
import ScheduleScreen from "../screens/ScheduleScreen";
import ProfileScreen from "../screens/ProfileScreen";


type BottomTabParamsList = {
    Home: undefined;
    Schedule: undefined;
    Routine: undefined;
    Profile: undefined;
}

const BottomTab = createBottomTabNavigator<BottomTabParamsList>()

const TabNavgation : React.FC = () => {
    return (
        <BottomTab.Navigator>
            <BottomTab.Screen name="Home" component={HomeScreen} options={{headerShown : false}}/>
            <BottomTab.Screen name="Schedule" component={ScheduleScreen} options={{headerShown : false}}/>
            <BottomTab.Screen name="Routine" component={RoutineScreen} options={{headerShown : false}}/>
            <BottomTab.Screen name="Profile" component={ProfileScreen} options={{headerShown : false}}/>
        </BottomTab.Navigator>
    );
};

export default TabNavgation;