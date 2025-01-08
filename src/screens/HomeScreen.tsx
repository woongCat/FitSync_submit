import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { RootStackParamList } from '../navigation/RootNavigation';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import styles from '../style/styles';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TabNav'>

interface HomeScreenProps {
    navigation : HomeScreenNavigationProp
}

const HomeScreen : React.FC = () => {
    const {userName} = useContext(AuthContext);

    return (
        <View style={styles.contentContainer}>
            <View style={styles.topHeader}>
                <Text style={styles.userInfoText}>Hello, {userName}</Text>
            </View>
        </View>
    );
};

export default HomeScreen;