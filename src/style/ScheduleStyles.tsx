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
});

export default ScheduleStyles;