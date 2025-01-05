import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    Text,
    View,
    TouchableOpacity,
    Modal,
} from 'react-native';
import styles from '../style/styles';
import { RoutineStackParamList } from '../navigation/RoutineNavigation';
import { useState } from 'react';
import SearchExercise from '../components/SearchExercise';

type CreateRoutineScreenNavigationProp = NativeStackNavigationProp<RoutineStackParamList, 'RoutineDetail'>

interface CreateRoutineScreenProps {
    navigation : CreateRoutineScreenNavigationProp
}

const CreateRoutineScreen : React.FC<CreateRoutineScreenProps> = ({navigation}) => {
    const [showModal, setShowModal] = useState(false);
    
    return (
        <View style={styles.container}>
            <Text>date</Text>

            <TouchableOpacity onPress={() => setShowModal(true)} style={styles.button}>
                <Text style={styles.bottonText}>add new exercise</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('RoutineDetail')} style={styles.button}>
                <Text style={styles.bottonText}>Confirm</Text>
            </TouchableOpacity>

            <Modal
                visible={showModal}
                animationType='slide'
                onRequestClose={() => setShowModal(false)}
            >
                <SearchExercise onCancel={() => setShowModal(false)} />
            </Modal>
        </View>
    );
};

export default CreateRoutineScreen;