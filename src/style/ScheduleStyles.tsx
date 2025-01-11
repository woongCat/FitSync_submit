// ScheduleStyles.ts
import { StyleSheet } from 'react-native';

const ScheduleStyles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#f5f5f5',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    scheduleHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 5,
    },
    contentContainer: { 
        flex: 1, 
        backgroundColor: '#f8f9fa' 
    },
    searchContainer: { 
        flexDirection: 'row', 
        padding: 10 
    },
    searchInput: { 
        flex: 1, 
        borderWidth: 1, 
        borderRadius: 5, 
        padding: 8, 
        marginRight: 5 
    },
    searchButton: { 
        padding: 10, 
        backgroundColor: '#007bff', 
        borderRadius: 5 
    },
    searchButtonText: { 
        color: '#fff', 
        textAlign: 'center' 
    },
    scheduleCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    addButton: { 
        padding: 10, 
        backgroundColor: '#28a745', 
        margin: 10, 
        borderRadius: 5 
    },
    addButtonText: { 
        color: '#fff', 
        textAlign: 'center' 
    },
    approveButton: { 
        backgroundColor: 'green', 
        padding: 10, 
        margin: 5, 
        borderRadius: 5 
    },
    rejectButton: { 
        backgroundColor: 'red', 
        padding: 10, 
        margin: 5, 
        borderRadius: 5 
    },
    deleteButton: { 
        backgroundColor: '#f44336', 
        paddingVertical: 8, 
        paddingHorizontal: 16, 
        borderRadius: 8, 
        alignSelf: 'flex-start', 
        marginTop: 8 
    },
    deleteButtonText: { 
        color: '#fff', 
        fontSize: 14, 
        fontWeight: 'bold' 
    },
    scheduleText: { 
        fontSize: 16, 
        color: '#555', 
        marginBottom: 8 
    },
    buttonText: { 
        color: '#fff', 
        textAlign: 'center' 
    },
    confirmBtn: {
        backgroundColor: '#28a745',
        padding: 12,
        borderRadius: 6,
        marginTop: 10,
    },
    confirmBtnText: {
        color: '#ffffff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 14,
    },
    selectBtn: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 6,
        marginTop: 10,
    },
    selectBtnText: {
        color: '#ffffff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 14,
    },
    toggleDetailsButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    editButton: {
        backgroundColor: '#17a2b8',
        padding: 10,
        borderRadius: 5,
    },
    scheduleDetailText: {
        fontSize: 14,
        color: '#6c757d',
        marginTop: 5,
    },
    disabledButton: {
        fontSize: 14, // 글씨 크기
        color: '#B0B0B0', // 비활성화된 버튼 텍스트 색상 (흐린 회색)
        marginTop: 5, // 버튼 위 여백
        backgroundColor: '#E0E0E0', // 버튼 배경 색상 (연한 회색)
        padding: 8, // 버튼 내부 여백
        borderRadius: 5, // 둥근 모서리
        overflow: 'hidden', // 텍스트가 영역 밖으로 넘치지 않도록
        opacity: 0.6, // 반투명 효과
    },
    section: {
        backgroundColor: '#f0f0f0',
        color: '#333',
        textTransform: 'capitalize',
        paddingVertical: 5,
        paddingHorizontal: 10,
        fontSize: 16,
      },
      timeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    timeButton: {
        padding: 10,
        margin: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
    },
    timeButtonContainer: {
        padding: 10,
        margin: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#14e0fd',
    },
    selectedTime: {
        backgroundColor: '#007bff',
        borderColor: '#0056b3',
    },
    timeText: {
        fontSize: 16,
        color: '#000',
    },
    confirmButton: {
        marginTop: 20,
        padding: 15,
        borderRadius: 5,
        backgroundColor: '#007bff',
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    selectedTimeButton: {
        padding: 10,
        margin: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#1eb1c6',
    },
    container: {
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default ScheduleStyles;