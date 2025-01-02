import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    Alert,
    Text,
    View,
    TouchableOpacity,
    TextInput
} from 'react-native';
import { SetStateAction, useContext, useState } from 'react';
import styles from '../style/styles';
import { RoutineStackParamList } from '../navigation/RoutineNavigation';

type ChooseOptionScreenNavigationProp = NativeStackNavigationProp<RoutineStackParamList, 'Routine'>

interface ChooseOptionScreenProps {
    navigation : ChooseOptionScreenNavigationProp
}

const ChooseOptionScreen : React.FC<ChooseOptionScreenProps> = ({navigation}) => {

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate('CameraShot')} style={styles.RoutineOptBtn}>
                <Text style={styles.bottonText}>Use Camera</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ChooseOptionScreen;