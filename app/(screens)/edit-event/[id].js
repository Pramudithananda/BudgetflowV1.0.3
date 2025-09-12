import { useEffect, useState, useMemo } from 'react';
import { StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Text, View } from '../../../components/Themed';
import { useTheme } from '../../../context/theme';
import { getEvent, updateEvent, listenExpensesByEvent, updateExpense, getEventStatusSummary } from '../../../services/sqliteService';
import StatusCard from '../../../components/StatusCard';

export default function EditEventScreen() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [budget, setBudget] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ Pending: 0, Spent: 0, Available: 0, Outstanding: 0 });
  const [eventName, setEventName] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const ev = await getEvent(String(id));
        if (!ev) {
          Alert.alert('Not found', 'Event not found', [{ text: 'OK', onPress: () => router.back() }]);
          return;
        }
        setName(ev.name || '');
        setEventName(ev.name || 'Edit Event');
        setDate(ev.date || '');
        setBudget(ev.budget != null ? String(ev.budget) : '');
        setCategory(ev.category || '');
        setLocation(ev.location || '');
        setDescription(ev.description || '');
        
        // Load expenses and summary
        const sum = await getEventStatusSummary(String(id));
        setSummary(sum);
      } catch (e) {
        console.error('Error loading event:', e);
        Alert.alert('Error', `Could not load event: ${e.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    })();
    
    // Listen to expense changes
    const unsub = listenExpensesByEvent(String(id), async (list) => {
      setExpenses(list);
      const sum = await getEventStatusSummary(String(id));
      setSummary(sum);
    });
    return () => unsub && unsub();
  }, [id]);

  const onSave = async () => {
    try {
      setSaving(true);
      await updateEvent(String(id), {
        name: name.trim(),
        date: date.trim(),
        budget: Number(budget) || 0,
        category: category.trim(),
        location: location.trim(),
        description: description.trim(),
      });
      Alert.alert('Success', 'Event updated', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (e) {
      Alert.alert('Error', 'Failed to update event');
    } finally {
      setSaving(false);
    }
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

  const addExpenseForEvent = () => {
    router.push(`/new-expense?eventId=${id}`);
  };

  const grouped = useMemo(() => {
    return ['Pending', 'Available', 'Spent', 'Outstanding'].map(status => ({
      status,
      items: expenses.filter(e => (e.status || 'Outstanding') === status)
    }));
  }, [expenses]);

  if (loading) {
    return <View style={[styles.container, { backgroundColor: colors.background }]}><Text style={{ color: colors.text }}>Loading...</Text></View>;
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: eventName || 'Edit Event',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }} 
      />
      <ScrollView contentContainerStyle={[styles.content, { backgroundColor: colors.background }]}>
      <Text style={[styles.label, { color: colors.text }]}>Event Name</Text>
      <TextInput value={name} onChangeText={setName} style={[styles.input, { color: colors.text, borderColor: colors.border }]} placeholder="Name" placeholderTextColor={colors.text + '80'} />

      <Text style={[styles.label, { color: colors.text }]}>Date</Text>
      <TextInput value={date} onChangeText={setDate} style={[styles.input, { color: colors.text, borderColor: colors.border }]} placeholder="YYYY-MM-DD" placeholderTextColor={colors.text + '80'} />

      <Text style={[styles.label, { color: colors.text }]}>Budget</Text>
      <TextInput value={budget} onChangeText={setBudget} keyboardType="numeric" style={[styles.input, { color: colors.text, borderColor: colors.border }]} placeholder="0" placeholderTextColor={colors.text + '80'} />

      <Text style={[styles.label, { color: colors.text }]}>Category</Text>
      <TextInput value={category} onChangeText={setCategory} style={[styles.input, { color: colors.text, borderColor: colors.border }]} placeholder="Category" placeholderTextColor={colors.text + '80'} />

      <Text style={[styles.label, { color: colors.text }]}>Location</Text>
      <TextInput value={location} onChangeText={setLocation} style={[styles.input, { color: colors.text, borderColor: colors.border }]} placeholder="Location" placeholderTextColor={colors.text + '80'} />

      <Text style={[styles.label, { color: colors.text }]}>Description</Text>
      <TextInput value={description} onChangeText={setDescription} multiline numberOfLines={3} style={[styles.textArea, { color: colors.text, borderColor: colors.border }]} placeholder="Description" placeholderTextColor={colors.text + '80'} />

      <TouchableOpacity onPress={onSave} style={[styles.button, { backgroundColor: colors.primary }]} disabled={saving}>
        <Text style={styles.buttonText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
      </TouchableOpacity>

      {/* Expense Status Summary */}
      <View style={styles.summarySection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Expense Status Summary</Text>
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
      </View>

      {/* Add Expense Button */}
      <TouchableOpacity style={[styles.button, { backgroundColor: '#4e8ef7' }]} onPress={addExpenseForEvent}>
        <Text style={styles.buttonText}>Add Expense to Event</Text>
      </TouchableOpacity>

      {/* Expense Management */}
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
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    height: 100,
    marginBottom: 12,
  },
  button: {
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  summarySection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  card: {
    width: '48%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginRight: '4%',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 13,
    opacity: 0.8,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },
  group: {
    marginTop: 16,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  expenseItem: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  expenseInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  expenseTitle: {
    fontWeight: '600',
  },
  expenseActions: {
    alignItems: 'flex-end',
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 8,
  },
  statusButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
  statusChipText: {
    fontSize: 10,
    fontWeight: '600',
  },
});

