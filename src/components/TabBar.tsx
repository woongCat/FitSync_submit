import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import TabBarButton from './TabBarButton';
import Animated, { useAnimatedStyle, useSharedValue, withReanimatedTimer, withTiming } from 'react-native-reanimated';
import { useEffect, useState } from 'react';

function TabBar({ state, descriptors, navigation } : Readonly<BottomTabBarProps>) {
    const [dimensions, setDimensions] = useState({ height: 20, width: 100});

    const buttonWidth = dimensions.width / state.routes.length;

    useEffect(() => {
        tabPositionX.value = withTiming(buttonWidth * state.index, {duration: 200});
    }, [state.index]);

    const onTabBarLayout = (e: LayoutChangeEvent) => {
        setDimensions({
            height: e.nativeEvent.layout.height,
            width: e.nativeEvent.layout.width
        });
    };

    const tabPositionX = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: tabPositionX.value }],
        };
    });
    
    return (
        <View onLayout={onTabBarLayout} style={styles.tabbar}>
            <Animated.View
                style={[animatedStyle, {
                    position: "absolute",
                    backgroundColor: "#007aff",
                    top: 0,
                    left: 20,
                    height: 2,
                    width: buttonWidth / 2,
                }]}
            />
            {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
                options.tabBarLabel ?? options.title !== undefined
                    ? options.title
                    : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
                const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
                }
            };

            const onLongPress = () => {
                navigation.emit({
                type: 'tabLongPress',
                target: route.key,
                });
            };

            return (
                <TabBarButton 
                    key={route.name}
                    onPress={onPress} 
                    onLongPress={onLongPress} 
                    isFocused={isFocused} 
                    routeName= {route.name}
                    label= {label}
                />
            );
            })}
        </View>
    );
}

export default TabBar;

const styles = StyleSheet.create({
    tabbar: {
        flexDirection: 'row',
        paddingTop : 15,
        paddingBottom : 15,
        backgroundColor : '#FFF',
    },
})