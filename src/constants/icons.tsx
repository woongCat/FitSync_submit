import { Image, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export const icon = {
    Home : ({ color } : { color : string}) => (
        <Ionicons name='home-outline' size={22} color={color} />
    ),

    Schedule : ({ color } : { color : string}) => (
        <Ionicons name="calendar-outline" size={22} color={color} />
    ),

    Routine : ({ color } : { color : string}) => (
        <Ionicons name="list" size={22} color={color} />
    ),

    Analytics : ({ color } : { color : string}) => (
        <Ionicons name="bar-chart" size={30} color={color} />
    ),

    Profile : ({ width, height }: { width: number, height: number }) => (
        <Image 
            source={{uri : "https://xsgames.co/randomusers/avatar.php?g=pixel"}} 
            style={[styles.userImg, { width, height }]} // width와 height를 동적으로 적용
        />
    ),
    Back : ({ color } : { color : string}) => (
        <Ionicons name="arrow-back" size={22} color={color} />
    ),
    Date : ({ color } : { color : string}) => (
        <Ionicons name="calendar-clear-outline" size={30} color={color} style = {styles.datetime} />
    ),
    Time : ({ color } : { color : string}) => (
        <Ionicons name="time-outline" size={35} color={color} style = {styles.datetime} />
    ),
    Gym : ({ color } : { color : string}) => (
        <MaterialIcons name="location-city" size={30} color={color} style = {styles.datetime} />
    ),
    User : ({ color } : { color : string}) => (
        <Ionicons name="people" size={30} color={color} style = {styles.datetime} />
    ),
}

const styles = StyleSheet.create({
    userImg : {
        borderRadius : 15
    },
    datetime : {
        marginLeft : 2,
        marginRight : 2,
    },
})