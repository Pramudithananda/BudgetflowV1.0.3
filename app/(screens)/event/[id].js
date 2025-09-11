import { useEffect, useState, useMemo } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Text, View } from '../../../components/Themed';
import { useTheme } from '../../../context/theme';
import { getEvent, deleteEvent, listenExpensesByEvent, getEventStatusSummary, updateExpense, toggleExpenseVisibility, getExpensesByEvent } from '../../../services/asyncStorageService';
import StatusCard from '../../../components/StatusCard';

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const [event, setEvent] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ Pending: 0, Spent: 0, Available: 0, Outstanding: 0 });

  useEffect(() => {
    (async () => {
      const ev = await getEvent(String(id));
      if (!ev) {
        Alert.alert('Not found', 'Event not found', [{ text: 'OK', onPress: () => router.back() }]);
        return;
      }
      setEvent(ev);
      const sum = await getEventStatusSummary(String(id));
      setSummary(sum);
    })();
    const unsub = listenExpensesByEvent(String(id), async (list) => {
      setExpenses(list);
      const sum = await getEventStatusSummary(String(id));
      setSummary(sum);
    });
    return () => unsub && unsub();
  }, [id]);

  const grouped = useMemo(() => {
    return ['Pending', 'Available', 'Spent', 'Outstanding'].map(status => ({
      status,
      items: expenses.filter(e => (e.status || 'Outstanding') === status && !e.isHidden)
    }));
  }, [expenses]);

  const handleDelete = () => {
    Alert.alert('Delete Event', 'Are you sure? This will delete the event and all its expenses.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await deleteEvent(String(id));
          Alert.alert('Success', 'Event deleted successfully', [
            { text: 'OK', onPress: () => router.back() }
          ]);
        } catch (error) {
          console.error('Delete error:', error);
          Alert.alert('Error', 'Failed to delete event. Please try again.');
        }
      } }
    ]);
  };

  const addExpenseForEvent = () => {
    router.push(`/new-expense?eventId=${id}`);
  };

  const handleStatusChange = async (expenseId, newStatus) => {
    try {
      await updateExpense(expenseId, { status: newStatus });
    } catch (error) {
      Alert.alert('Error', 'Failed to update expense status');
    }
  };

  const editExpense = (expenseId) => {
    router.push(`/edit-expense/${expenseId}`);
  };

  const handleToggleVisibility = async (expenseId) => {
    try {
      await toggleExpenseVisibility(expenseId);
      // Force refresh the expenses list and summary
      const updatedExpenses = await getExpensesByEvent(String(id));
      setExpenses(updatedExpenses);
      const sum = await getEventStatusSummary(String(id));
      setSummary(sum);
    } catch (error) {
      Alert.alert('Error', 'Failed to toggle expense visibility');
    }
  };

  if (!event) {
    return <View style={[styles.center, { backgroundColor: colors.background }]}><Text style={{ color: colors.text }}>Loading...</Text></View>;
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: event?.name || 'Event Details',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }} 
      />
      <ScrollView contentContainerStyle={[styles.content, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{event.name}</Text>
      <Text style={{ color: colors.text, opacity: 0.8 }}>{event.date || 'No date'} • Rs. {Number(event.budget || 0).toLocaleString()}</Text>

      <View style={styles.rowWrap}>
        {/* Row 1: Outstanding, Pending */}
        <StatusCard 
          status="Outstanding" 
          amount={Number(summary.Outstanding || 0)} 
          colors={colors}
        />
        <StatusCard 
          status="Pending" 
          amount={Number(summary.Pending || 0)} 
          colors={colors}
        />
        {/* Row 2: Available, Spent */}
        <StatusCard 
          status="Available" 
          amount={Number(summary.Available || 0)} 
          colors={colors}
        />
        <StatusCard 
          status="Spent" 
          amount={Number(summary.Spent || 0)} 
          colors={colors}
        />
      </View>

      <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={() => router.push(`/edit-event/${id}`)}>
        <Text style={styles.buttonText}>Edit Event</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#e74c3c' }]} onPress={handleDelete}>
        <Text style={styles.buttonText}>Delete Event</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#4e8ef7' }]} onPress={addExpenseForEvent}>
        <Text style={styles.buttonText}>Add Expense to Event</Text>
      </TouchableOpacity>

      {grouped.map(group => (
        <View key={group.status} style={styles.group}>
          <Text style={[styles.groupTitle, { color: colors.text }]}>{group.status}</Text>
          {group.items.length === 0 && <Text style={{ color: colors.text, opacity: 0.8 }}>No expenses</Text>}
          {group.items.map(item => (
            <View key={item.id} style={[styles.expenseItem, { borderColor: colors.border }]}>
              <View style={styles.expenseInfo}>
                <Text style={[styles.expenseTitle, { color: colors.text }]}>{item.title || 'Expense'}</Text>
                <Text style={{ color: colors.text }}>Rs. {Number(item.amount || 0).toLocaleString()}</Text>
              </View>
              <View style={styles.expenseActions}>
                <TouchableOpacity 
                  style={[styles.statusButton, { backgroundColor: colors.primary }]}
                  onPress={() => editExpense(item.id)}
                >
                  <Text style={styles.statusButtonText}>Edit</Text>
                </TouchableOpacity>
                <View style={styles.checkboxContainer}>
                  <CheckBox
                    checked={!item.isHidden}
                    onPress={() => handleToggleVisibility(item.id)}
                    checkedColor={colors.primary}
                    uncheckedColor={colors.border}
                    size={20}
                  />
                  <Text style={[styles.checkboxLabel, { color: colors.text }]}>
                    {item.isHidden ? 'Hidden' : 'Visible'}
                  </Text>
                </View>
                <View style={styles.statusButtons}>
                  {['Pending', 'Available', 'Spent', 'Outstanding'].map(status => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.statusChip,
                        { 
                          backgroundColor: (item.status || 'Outstanding') === status ? colors.primary : colors.border,
                          borderColor: colors.border
                        }
                      ]}
                      onPress={() => handleStatusChange(item.id, status)}
                    >
                      <Text style={[
                        styles.statusChipText,
                        { color: (item.status || 'Outstanding') === status ? '#fff' : colors.text }
                      ]}>
                        {status}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>
      ))}

      {/* Hidden Expenses Section */}
      {expenses.some(e => e.isHidden) && (
        <View style={styles.group}>
          <Text style={[styles.groupTitle, { color: colors.text }]}>Hidden Expenses</Text>
          {expenses.filter(e => e.isHidden).map(item => (
            <View key={item.id} style={[styles.expenseItem, { borderColor: colors.border, opacity: 0.6 }]}>
              <View style={styles.expenseInfo}>
                <Text style={[styles.expenseTitle, { color: colors.text }]}>{item.title || 'Expense'}</Text>
                <Text style={{ color: colors.text }}>Rs. {Number(item.amount || 0).toLocaleString()}</Text>
              </View>
              <View style={styles.expenseActions}>
                <View style={styles.checkboxContainer}>
                  <CheckBox
                    checked={false}
                    onPress={() => handleToggleVisibility(item.id)}
                    checkedColor={colors.primary}
                    uncheckedColor={colors.border}
                    size={20}
                  />
                  <Text style={[styles.checkboxLabel, { color: colors.text }]}>
                    Show
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 6 },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 12, gap: 8 },
  card: { width: '48%', borderWidth: 1, borderRadius: 10, padding: 12, marginRight: '4%', marginBottom: 10 },
  cardTitle: { fontSize: 13, opacity: 0.8 },
  cardValue: { fontSize: 16, fontWeight: '700', marginTop: 4 },
  button: { alignItems: 'center', padding: 12, borderRadius: 10, marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: '700' },
  group: { marginTop: 16 },
  groupTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  expenseItem: { borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 8 },
  expenseInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  expenseTitle: { fontWeight: '600' },
  expenseActions: { alignItems: 'flex-end' },
  statusButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, marginBottom: 8 },
  statusButtonText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  hideButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, marginBottom: 8, borderWidth: 1 },
  hideButtonText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  statusButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  statusChip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1 },
  statusChipText: { fontSize: 10, fontWeight: '600' },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  checkboxLabel: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
});

