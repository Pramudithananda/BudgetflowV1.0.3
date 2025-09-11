import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View as RNView, ActivityIndicator, Alert, TextInput, TouchableOpacity } from 'react-native';
import { Text, View } from '../../components/Themed';
import { router, useLocalSearchParams } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { getCategories, getFunders, addExpense, getEvents } from '../../services/sqliteService';
import { useTheme } from '../../context/theme';
import { t } from '../../utils/language';

export default function NewExpenseScreen() {
  const { colors, isDarkMode } = useTheme();
  const { preSelectedCategory, eventId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [funders, setFunders] = useState([]);
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(preSelectedCategory || '');
  const [selectedFunder, setSelectedFunder] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(eventId || '');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showFunderPicker, setShowFunderPicker] = useState(false);
  const [showEventPicker, setShowEventPicker] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesData, fundersData, eventsData] = await Promise.all([
        getCategories(),
        getFunders(),
        getEvents()
      ]);
      setCategories(categoriesData);
      setFunders(fundersData);
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert(t('error'), t('couldNotLoadData'));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert(t('error'), t('pleaseEnterExpenseTitle'));
      return;
    }

    if (!amount.trim() || isNaN(Number(amount))) {
      Alert.alert(t('error'), t('pleaseEnterValidAmount'));
      return;
    }

    if (!selectedCategory) {
      Alert.alert(t('error'), t('pleaseSelectCategory'));
      return;
    }

    if (!selectedEvent) {
      Alert.alert(t('error'), t('pleaseSelectEvent'));
      return;
    }

    try {
      setSaving(true);
      await addExpense({
        title: title.trim(),
        amount: Number(amount),
        description: description.trim(),
        categoryId: selectedCategory,
        funderId: selectedFunder || null,
        eventId: selectedEvent,
        status: 'Outstanding',
        createdAt: new Date(),
      });
      
      Alert.alert(t('success'), t('expenseAddedSuccessfully'), [
        { text: t('ok'), onPress: () => router.replace('/(tabs)') }
      ]);
    } catch (error) {
      console.error('Error adding expense:', error);
      Alert.alert(t('error'), t('couldNotAddExpense'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>{t('title')}</Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.text,
          }]}
          value={title}
          onChangeText={setTitle}
          placeholder={t('enterExpenseTitle')}
          placeholderTextColor={colors.text}
        />

        <Text style={styles.label}>{t('amount')}</Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.text,
          }]}
          value={amount}
          onChangeText={setAmount}
          placeholder={t('enterAmount')}
          placeholderTextColor={colors.text}
          keyboardType="numeric"
        />

        <Text style={styles.label}>{t('description')} ({t('optional')})</Text>
        <TextInput
          style={[styles.input, styles.textArea, { 
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.text,
          }]}
          value={description}
          onChangeText={setDescription}
          placeholder={t('enterExpenseDescription')}
          placeholderTextColor={colors.text}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <Text style={styles.label}>{t('event')}</Text>
        <TouchableOpacity
          style={[styles.pickerButton, { 
            backgroundColor: colors.card,
            borderColor: colors.border,
          }]}
          onPress={() => setShowEventPicker(true)}
        >
          <Text style={[styles.pickerButtonText, { color: colors.text }]}>
            {selectedEvent
              ? events.find(e => e.id === parseInt(selectedEvent))?.name
              : t('selectEvent')}
          </Text>
          <FontAwesome5 name="chevron-down" size={14} color={colors.text} />
        </TouchableOpacity>

        <Text style={styles.label}>{t('category')}</Text>
        <TouchableOpacity
          style={[styles.pickerButton, { 
            backgroundColor: colors.card,
            borderColor: colors.border,
          }]}
          onPress={() => setShowCategoryPicker(true)}
        >
          <Text style={[styles.pickerButtonText, { color: colors.text }]}>
            {selectedCategory
              ? categories.find(cat => cat.id === parseInt(selectedCategory))?.name
              : t('selectCategory')}
          </Text>
          <FontAwesome5 name="chevron-down" size={14} color={colors.text} />
        </TouchableOpacity>

        <Text style={styles.label}>{t('assignedTo')} ({t('optional')})</Text>
        <TouchableOpacity
          style={[styles.pickerButton, { 
            backgroundColor: colors.card,
            borderColor: colors.border,
          }]}
          onPress={() => setShowFunderPicker(true)}
        >
          <Text style={[styles.pickerButtonText, { color: colors.text }]}>
            {selectedFunder
              ? funders.find(f => f.id === parseInt(selectedFunder))?.name
              : t('selectFunder')}
          </Text>
          <FontAwesome5 name="chevron-down" size={14} color={colors.text} />
        </TouchableOpacity>

        <Button
          title={saving ? t('saving') : t('saveExpense')}
          onPress={handleSave}
          disabled={saving}
          style={styles.submitButton}
        />
      </View>

      {showCategoryPicker && (
        <View style={[styles.pickerOverlay, { backgroundColor: colors.overlay }]}>
          <Card style={styles.pickerCard}>
            <Text style={styles.pickerTitle}>{t('selectCategory')}</Text>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.pickerItem, { borderBottomColor: colors.border }]}
                onPress={() => {
                  setSelectedCategory(category.id);
                  setShowCategoryPicker(false);
                }}
              >
                <Text style={[styles.pickerItemText, { color: colors.text }]}>{category.name}</Text>
              </TouchableOpacity>
            ))}
            <Button
              title={t('cancel')}
              onPress={() => setShowCategoryPicker(false)}
              variant="outline"
              style={styles.pickerCancelButton}
            />
          </Card>
        </View>
      )}

      {showFunderPicker && (
        <View style={[styles.pickerOverlay, { backgroundColor: colors.overlay }]}>
          <Card style={styles.pickerCard}>
            <Text style={styles.pickerTitle}>{t('selectFunder')}</Text>
            {funders.map((funder) => (
              <TouchableOpacity
                key={funder.id}
                style={[styles.pickerItem, { borderBottomColor: colors.border }]}
                onPress={() => {
                  setSelectedFunder(funder.id);
                  setShowFunderPicker(false);
                }}
              >
                <Text style={[styles.pickerItemText, { color: colors.text }]}>{funder.name}</Text>
              </TouchableOpacity>
            ))}
            <Button
              title={t('cancel')}
              onPress={() => setShowFunderPicker(false)}
              variant="outline"
              style={styles.pickerCancelButton}
            />
          </Card>
        </View>
      )}

      {showEventPicker && (
        <View style={[styles.pickerOverlay, { backgroundColor: colors.overlay }]}>
          <Card style={styles.pickerCard}>
            <Text style={styles.pickerTitle}>{t('selectEvent')}</Text>
            {events.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={[styles.pickerItem, { borderBottomColor: colors.border }]}
                onPress={() => {
                  setSelectedEvent(event.id);
                  setShowEventPicker(false);
                }}
              >
                <Text style={[styles.pickerItemText, { color: colors.text }]}>{event.name}</Text>
              </TouchableOpacity>
            ))}
            <Button
              title={t('cancel')}
              onPress={() => setShowEventPicker(false)}
              variant="outline"
              style={styles.pickerCancelButton}
            />
          </Card>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  pickerButton: {
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
  },
  pickerButtonText: {
    fontSize: 16,
  },
  submitButton: {
    marginTop: 8,
  },
  pickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerCard: {
    width: '80%',
    maxHeight: '80%',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  pickerItem: {
    padding: 16,
    borderBottomWidth: 1,
  },
  pickerItemText: {
    fontSize: 16,
  },
  pickerCancelButton: {
    marginTop: 16,
  },
}); 