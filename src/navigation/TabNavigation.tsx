import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import UnifiedScheduleScreen from "../screens/PTScheduleScreen";
import ProfileScreen from "../screens/ProfileScreen";
import MyTabBar from "../components/TabBar";
import RoutineNavigation from "./RoutineNavigation";
import HomeScreen from "../screens/HomeScreen";

export type BottomTabParamsList = {
    Home: undefined;
    Schedule: undefined;
    Routine: undefined;
    Profile: undefined;
};

const BottomTab = createBottomTabNavigator();

const TabNavigation : React.FC = () => {
    return (
        <BottomTab.Navigator
            tabBar={(props) => <MyTabBar {...props} />}
        >
            <BottomTab.Screen name="Home" component={HomeScreen} options={{headerShown : false}}/>
            <BottomTab.Screen name="Schedule" component={UnifiedScheduleScreen} options={{headerShown : false}}/>
            <BottomTab.Screen name="Routine" component={RoutineNavigation} options={{headerShown : false}}/>
            <BottomTab.Screen name="Profile" component={ProfileScreen} options={{headerShown : false}}/>
        </BottomTab.Navigator>
    );
};

export default TabNavigation;