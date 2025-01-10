import {
    StyleSheet
} from 'react-native';

const styles = StyleSheet.create ({
    container : {
        flex : 1,
        color : '#f5f5f5',
        padding : 10
    },
    authContainer : {
        flex : 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding : 20
    },
    optionContainer : {
        flex : 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header : {
        fontSize : 24,
        fontWeight : 'bold',
        marginBottom : 20
    },
    topHeader : {
        flexDirection : 'row',
        padding : 16,
        alignItems : 'center',
        justifyContent: 'space-between',
        backgroundColor : '#f5f5f5'
    },
    subHeader : {
        padding : 10,
        alignItems : 'flex-start',
        backgroundColor : '#f5f5f5'
    },
    subHeaderText : {
        fontSize : 16,
        fontWeight : 'bold',
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
    LogOutBtn : {
        padding : 10,
        backgroundColor : '#999999',
        borderRadius : 24,
    },
    LogOutText : {
        color : '#ffffff',
        fontSize : 14,
        fontWeight : 'bold'
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
    RoutineOptBtn : {
        width : '80%',
        height : 50,
        backgroundColor : '#056edd',
        justifyContent : 'center',
        alignItems : 'center',
        borderRadius : 5,
        paddingHorizontal : 10,
        marginTop : 10,
        marginBottom : 10,
    },
    userInfoText : {
        fontSize : 18,
        fontWeight : 'bold'
    },
    searchInput : {
        flex : 1,
        height : 45,
        backgroundColor : '#ffffff',
        borderRadius : 20,
        paddingHorizontal : 16,
        marginLeft : 15,
    },
    exerciseCard : {
        backgroundColor : '#ffffff',
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding : 16,
    },
    exerciseCardContent : {
        flex : 1,
    },
    addExerciseBtn : {
        width : '100%',
        height : 40,
        backgroundColor : '#f5f5f5',
        justifyContent : 'center',
        alignItems : 'center',
        borderRadius : 5,
    },
    addExerciseText : {
        fontSize : 14,
        fontWeight : 'bold',
        color: '#056edd'
    },
    searchExerciseImage : {
        width : 50,
        height : 50,
    },
    exerciseName : {
        fontSize: 14,
        color: '#000',
        fontWeight: 'bold',
        marginTop: 5,
        marginBottom : 5,
    },
    exercisePart : {
        fontSize: 12,
        color: '#666',
        fontWeight: 'bold',
    },
    bodyPartFilterContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start', 
        alignItems: 'stretch',
        marginBottom : 10,
    },
    bodyPartFilterText : {
        fontSize: 12,
        color: '#000',
        fontWeight: 'bold',
        marginLeft: 5,
        paddingVertical: 5,
    },
    bodyPartButton: {
        paddingVertical: 5,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    selectedBodyPartButton: {
        backgroundColor: '#007bff',
    },
    bodyPartText: {
        fontSize: 12,
        color: '#666',
    },
    selectedBodyPartText: {
        color: '#007bff',
    },
    dateContainer : {
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
    },
    dateInput: {
        height: 40,
        flex : 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingLeft: 10,
        fontSize: 14,
        marginBottom: 10,
        marginLeft: 3,
        marginRight: 3,
        color: '#333',
    },
    RoutineCard : {
        backgroundColor : '#ffffff',
        borderRadius : 8,
        padding : 10,
        marginHorizontal : 5,
        marginVertical : 5,
        shadowColor : '#000',
        shadowOffset : {
            width : 0,
            height : 2
        },
        shadowOpacity : 0.1,
        shadowRadius : 4,
        elevation : 5,
    },
    RoutineContext : {
        flexGrow : 1,
        paddingBottom: 5
    },
    RoutineHeader: {
        flex: 3,
        alignItems: 'flex-start',
    },
    RoutineExerciseName : {
        fontSize: 16,
        fontWeight: 'bold',
    },
    RoutineDetailText : {
        fontSize: 12,
        fontWeight: 'bold',
    },
    RoutineSubText : {
        fontSize : 14,
        color: '#aaa',
        marginTop : 5,
    },
    RoutineEmptyContainer : {
        flex : 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    RoutineSetContainer : {
        flex : 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal : 5,
    },
    deleteSetsBtn : {
        flex : 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    RoutineRepsContainer : {
        flex : 6,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    RoutineWeightContainer : {
        flex : 6,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    RoutineCardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    RoutineExerciseImage : {
        flex: 1,
        height : 100,
    },
    RoutineCardSetsContainer: {
        marginTop: 10,
    },
    RoutineCardSetRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        alignItems: 'center',
    },
    RoutineCardSetText: {
        width: 40,
        textAlign: 'center',
        fontSize: 16,
    },
    RoutineCardSetInput: {
        width: 60,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        textAlign: 'center',
        marginHorizontal: 5,
    },
    setIndexContainer : {
        flex : 1,
        alignItems: 'center',
    },
    editNumBtn: {
        position : 'static',
        backgroundColor : '#056edd',
        width : 30,
        height : 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius : 5,
    },
    editNumBtnText : {
        fontSize : 18,
        fontWeight : 'bold',
        color: '#ffffff',
    },
    RepsAndWeightInputBox : {
        width : '25%',
        textAlignVertical : 'center',
        textAlign : 'center',
        marginHorizontal : 20,
        fontWeight : 'bold',
        fontSize : 15,
    },
    addSetsBtn : {
        flex : 1,
        height : 30,
        padding : 5,
        marginTop : 3,
        justifyContent : 'center',
        alignItems : 'center',
    },
    addSetsText : {
        fontSize : 14,
        color: '#056edd',
    },
    RecordCard : {
        backgroundColor : '#ffffff',
        borderRadius : 8,
        padding : 16,
        marginHorizontal : 16,
        marginVertical : 8,
        shadowColor : '#000',
        shadowOffset : {
            width : 0,
            height : 2
        },
        shadowOpacity : 0.1,
        shadowRadius : 4,
        elevation : 5,
    },
    RecordContents : {
        flex : 1,
    },
    RecordHeader : {
        fontSize : 16,
        fontWeight : 'bold',
        marginBottom : 5,
    },
    RecordDescription : {
        fontSize : 14,
        color: '#aaa',
    },
    RecordDeleteBtn : {
        position : 'absolute',
        top : 25,
        right : 10,
        backgroundColor : '#056edd',
        paddingHorizontal : 5,
        paddingVertical : 5,
        borderRadius : 4,
    },
    RecordDeleteBtnText : {
        color : '#fff',
        fontWeight : 'bold',
        fontSize : 14,
    },
    RoutineLabel : {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom : 5,
    },
    RoutineComment : {
        width: '100%',
        height : 75,
        borderWidth : 1,
        borderColor : '#ccc',
        borderRadius : 6,
        paddingHorizontal:10,
        marginBottom:10,
        textAlignVertical : 'top',
    },
    timeSlot: {
        marginVertical: 5, 
        padding: 10, 
        borderWidth: 1, 
        borderColor: '#ccc', 
        borderRadius: 5 
    },
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // 배경을 반투명하게
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        width: 300,
    },
    modalButton: {
        padding: 10,
        backgroundColor: "#007BFF",
        borderRadius: 5,
        marginBottom: 10,
    },
    modalButtonText: {
        color: "white",
        textAlign: "center",
    },
    modalCloseButton: {
        padding: 10,
        backgroundColor: "#FF0000",
        borderRadius: 5,
        marginTop: 10,
    },
    modalCloseButtonText: {
        color: "white",
        textAlign: "center",
    },
});

export default styles;