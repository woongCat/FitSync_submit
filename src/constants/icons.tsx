import { Image, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export const icon = {
    index : ({ color } : { color : string}) => (
        <MaterialIcons name="home" size={22} color={color} />
    ),

    schedule : ({ color } : { color : string}) => (
        <MaterialIcons name="schedule" size={22} color={color} />
    ),

    routine : ({ color } : { color : string}) => (
        <MaterialIcons name="assignment" size={22} color={color} />
    ),

    analytics : ({ color } : { color : string}) => (
        <MaterialIcons name="assessment" size={22} color={color} />
    ),

    profile : ({ color } : { color : string}) => (
        <Image source={{uri : "https://xsgames.co/randomusers/avatar.php?g=pixel"}} style = {styles.userImg}/>
    )
}

const styles = StyleSheet.create({
    userImg : {
        height : 24,
        width: 24,
        borderRadius : 20
    }
})