import {
    StyleSheet
} from 'react-native';

const styles = StyleSheet.create ({
    container : {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center',
        padding : 20
    },
    header : {
        fontSize : 24,
        fontWeight : 'bold',
        marginBottom : 20
    },
    input : {
        width : '100%',
        height : 45, 
        borderWidth : 1,
        borderColor : '#cccccc',
        borderRadius : 6,
        paddingHorizontal : 10,
        marginBottom : 10
    },
    button : {
        width : '100%',
        height : 40,
        backgroundColor : '#056edd',
        justifyContent : 'center',
        alignItems : 'center',
        borderRadius : 5,
    },
    bottonText : {
        color : '#ffffff',
        fontSize : 16,
        fontWeight : 'bold'
    },
    linkText : {
        marginTop : 16,
        color : '#007aff'
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkboxRow: {
        flexDirection: 'row', // 체크박스들을 가로로 나열
        justifyContent: 'space-between', // 두 체크박스를 좌우에 배치
        alignItems: 'center', // 수직 가운데 정렬
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 12, // 원 형태로 만들기
        marginRight: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checked: {
        borderColor: '#007aff',
    },
    innerChecked: {
        width: 14,
        height: 14,
        borderRadius: 7, // 원 형태로 만들기
        backgroundColor: '#007aff', // 체크된 상태에서 안쪽 원 색
    },
    checkboxLabel: {
        fontSize: 16,
        marginRight: 5,
    },
    addBtn : {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: '#007aff',
        width: 110,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    addBtnText : {
        fontSize: 16,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    contentContainer : {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    modalContainer : {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : '',
    },
    modalContent : {
        backgroundColor : '#ffffff',
        borderRadius : 8,
        padding: 20,
        width : '90%',
        maxWidth: 400,
        elevation: 5,
    }
});

export default styles;