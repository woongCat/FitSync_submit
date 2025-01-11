import { Text, Pressable, StyleSheet } from "react-native";
import { icon } from "../constants/icons";

type TabBarButtonProps = {
    onPress : Function;
    onLongPress : Function;
    isFocused : boolean;
    label : string;
    routeName : string;
}

const TabBarButton = (props: TabBarButtonProps) => {
    const { onPress, onLongPress, isFocused, label, routeName } = props;

    // routeName에 해당하는 아이콘이 존재하는지 확인하고 없으면 기본 아이콘을 반환
    const IconComponent = icon[routeName];

    // 아이콘이 없으면 기본 아이콘을 반환
    if (!IconComponent) {
        console.warn(`Icon for route '${routeName}' not found. Defaulting to 'Home'.`);
    }

    // Profile 아이콘에 대해 width와 height 값을 설정
    const iconSize = routeName === "Profile" ? { width: 24, height: 24 } : { width: 22, height: 22 };

    return (
        <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabBarBtn}
        >
            {IconComponent
                ? IconComponent({ color: isFocused ? "#007aff" : "#000", ...iconSize })
                : icon.Home({ color: isFocused ? "#007aff" : "#000" })}
            <Text style={{ color: isFocused ? "#007aff" : "#000" }}>{label}</Text>
        </Pressable>
    );
};

export default TabBarButton; 

const styles = StyleSheet.create({
    tabBarBtn : {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center',
        gap : 5 
    }
})