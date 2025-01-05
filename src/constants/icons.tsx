import { Image, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const icon = {
    Home : ({ color } : { color : string}) => (
        <Ionicons name='home-outline' size={22} color={color} />
    ),

    Schedule : ({ color } : { color : string}) => (
        <Ionicons name="calendar-outline" size={22} color={color} />
    ),

    Routine : ({ color } : { color : string}) => (
        <Ionicons name="list-outline" size={22} color={color} />
    ),

    Analytics : ({ color } : { color : string}) => (
        <Ionicons name="bar-chart-outline" size={22} color={color} />
    ),

    Profile : ({ color } : { color : string}) => (
        <Image source={{uri : "https://xsgames.co/randomusers/avatar.php?g=pixel"}} style = {styles.userImg}/>
    ),
    Back : ({ color } : { color : string}) => (
        <Ionicons name="arrow-back" size={22} color={color} />
    )
}

const styles = StyleSheet.create({
    userImg : {
        height : 24,
        width: 24,
        borderRadius : 10
    }
})