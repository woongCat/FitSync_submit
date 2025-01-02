import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    Text,
    View,
    TouchableOpacity,
    Alert,
} from 'react-native';
import styles from '../style/styles';
import { RoutineStackParamList } from '../navigation/RoutineNavigation';
import { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { requestMultiple, PERMISSIONS, openSettings } from 'react-native-permissions';

type ChooseOptionScreenNavigationProp = NativeStackNavigationProp<RoutineStackParamList, 'Routine'>

interface ChooseOptionScreenProps {
    navigation : ChooseOptionScreenNavigationProp
}

const ChooseOptionScreen : React.FC<ChooseOptionScreenProps> = ({navigation}) => {
    const [fileUri, setFileUri] = useState<string | null>(null);
    const [hasPermission, setHasPermission] = useState(false);

    //useEffect(() => {
        const requestStoragePermission = async () => {
            if (Platform.OS === 'android' && Platform.Version >= 29) {
                try {
                    await requestMultiple([PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.READ_MEDIA_IMAGES]).then((statuses) => {
                        console.log(statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE]);
                        console.log(statuses[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES]);

                        if (statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] === 'granted' && statuses[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] === 'granted') {
                            console.log('The permission is granted.');
                            setHasPermission(true);
                        } else {
                            // 사용자가 권한을 다시 활성화하도록 유도
                            Alert.alert(
                                'Permission Required',
                                'You need to go to the app settings and change the permissions to enable file access.',
                                [
                                {
                                    text: 'CANCEL',
                                    style: 'cancel',
                                },
                                {
                                    text: 'GO TO SETTINGS',
                                    onPress: () => openSettings(), // 앱 설정으로 이동
                                },
                                ]
                            );
                            setHasPermission(false);
                        }
                    });
                } catch (err) {
                    console.warn(err);
                }
            }
        };
    //    requestStoragePermission();
    //}, []);


    // 파일을 선택하는 함수
    const pickFile = async () => {
        try {
            // 파일 선택 창을 띄웁니다.
            const res = await DocumentPicker.pick({
                mode: 'open',
                type: [DocumentPicker.types.images, DocumentPicker.types.pdf], // 선택할 파일 타입을 지정
            });

            const file = res[0]; // 첫 번째 파일 선택
            setFileUri(file.uri); // 선택한 파일의 URI를 상태에 저장
            //Alert.alert('파일 선택', `선택한 파일 경로: ${file.uri}`);
            console.log('Selected file: ', file)
            navigation.navigate('Render');
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // 사용자가 파일 선택을 취소했을 경우
                console.log('파일 선택이 취소되었습니다.');
            } else {
                console.error(err);
                Alert.alert('파일 선택 오류', '파일을 선택하는 데 오류가 발생했습니다.');
            }
            navigation.navigate('Routine');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Choose Option</Text>
            <TouchableOpacity onPress={() => navigation.navigate('CameraShot')} style={styles.RoutineOptBtn}>
                <Text style={styles.bottonText}>Use Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={pickFile} style={styles.RoutineOptBtn}>
                <Text style={styles.bottonText}>Find file</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ChooseOptionScreen;