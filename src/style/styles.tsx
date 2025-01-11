import {
    StyleSheet
} from 'react-native';

const styles = StyleSheet.create ({
    container : {
        flex : 1,
        color : '#f5f5f5',
        padding : 5
    },
    contentContainer : {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    authContainer : {
        flex : 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding : 30
    },
    authContext : {
        flexDirection : 'row',
    },
    authContextText : {
        fontSize : 16,
        fontWeight : 'bold',
        marginVertical : 20,
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
        padding : 10,
        alignItems : 'center',
        justifyContent: 'flex-start',
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
        backgroundColor : '#ffffff',
        borderRadius : 6,
        paddingHorizontal : 10,
        paddingVertical : 10,
        marginVertical : 10,
    },
    phoneInput : {
        width : '30%',
        height : 45, 
        borderWidth : 1,
        backgroundColor : '#ffffff',
        borderRadius : 6,
        paddingHorizontal : 10,
        paddingVertical : 10,
        marginVertical : 10,
    },
    button : {
        width : '100%',
        height : 40,
        backgroundColor : '#056edd',
        justifyContent : 'center',
        alignItems : 'center',
        borderRadius : 5,
        marginVertical : 10,
    },
    LogOutBtn : {
        paddingHorizontal : 12,
        paddingVertical : 10,
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
        marginVertical : 5,
        color : '#007aff'
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkboxRow: {
        flexDirection: 'row', // 체크박스들을 가로로 나열
        justifyContent: 'space-evenly', // 두 체크박스를 좌우에 배치
        padding : 20,
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
    userInfoDetailText : {
        fontSize : 14,
        color : '#85929e'
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
    FilterContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start', 
        alignItems: 'stretch',
        marginBottom : 10,
    },
    FilterText : {
        fontSize: 12,
        color: '#000',
        fontWeight: 'bold',
        marginLeft: 5,
        paddingVertical: 5,
    },
    FilterButton: {
        paddingVertical: 5,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    filterText: {
        fontSize: 12,
        color: '#666',
    },
    selectedFilterText: {
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
    addButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 6
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5
    },
    cancelButton: {
        backgroundColor: '#ccc',
        padding: 10,
        borderRadius: 6,
        alignItems: 'center'
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
    RecordOptionBtn : {
        position : 'absolute',
        top : 25,
        right : 10,
        backgroundColor : '#056edd',
        paddingHorizontal : 5,
        paddingVertical : 5,
        borderRadius : 4,
    },
    RecordOptionBtnText : {
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
    GymContents : {
        flex : 1,
    },
    gymItem: {
        padding: 16,
        backgroundColor : '#ffffff',
    },
    gymName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    gymLocation: {
        fontSize: 14,
        color: '#555',
    },
    gymTrainerCount: {
        fontSize: 14,
        color: '#888',
    },
    profileHeader : {
        flexDirection : 'row',
        padding : 15,
        alignItems : 'center',
        justifyContent: 'flex-start',
        marginTop : 5,
    },
    profileMenu : {
        flexDirection : 'row',
        padding : 5,
        alignItems : 'center',
        justifyContent: 'space-evenly',
    },
    profileMenuBtn : {
        flexDirection: 'column',  // Stack the icon and text vertically
        alignItems: 'center',
        marginHorizontal: 20,
    },
    profileMenuIcon : {
        width: 55, // 원의 크기 (아이콘을 포함한 크기)
        height: 55, // 원의 크기 (아이콘을 포함한 크기)
        borderRadius: 25, // 원 모양으로 만들기 위해 반지름 설정
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5, // 아이콘과 텍스트 사이의 간격
        backgroundColor : '#fff',
        shadowColor : '#000',
        shadowOffset : {
            width : 0,
            height : 2
        },
        shadowOpacity : 0.1,
        shadowRadius : 4,
        elevation : 5,
    },
    profileMenuText : {

    },
    profileContentContainer : {
        flex : 1,
        backgroundColor: '#fff',
        borderRadius: 20, // 둥근 모서리
        marginTop: 10, // profileMenuBtn과 겹치지 않도록 여백 추가
        padding: 15, // 내용과의 여백
        marginHorizontal: 5, // 양쪽 여백
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    sliderContainer: {
        marginBottom: 20,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    scheduleContainer: {
        backgroundColor: '#f9f9f9',
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    scheduleText: {
        fontSize: 16,
        color: '#333',
    },
    emptyScheduleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    emptyScheduleText: {
        fontSize: 16,
        color: '#aaa',
    },
});

export default styles;