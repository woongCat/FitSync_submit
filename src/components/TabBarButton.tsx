import { View, Text, Pressable, StyleSheet } from "react-native";
import { icon } from "../constants/icons";

type TabBarButtonProps = {
    onPress : Function;
    onLongPress : Function;
    isFocused : boolean;
    label : string;
    routeName : string;
}

const TabBarButton = (props: TabBarButtonProps) => {
    const {onPress, onLongPress, isFocused, label, routeName} = props;
    return (
        <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabBarBtn}
        >
        {icon[routeName]({
            color: isFocused ? '#007aff' : '#000'
        })}
        <Text style={{ color: isFocused ? '#007aff' : '#000' }}>
            {label}
        </Text>
        </Pressable>
    )
}

export default TabBarButton;

const styles = StyleSheet.create({
    tabBarBtn : {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center',
        gap : 5 
    }
})