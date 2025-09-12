import { useEffect, useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, View } from '../../components/Themed';
import { useTheme } from '../../context/theme';
import { router } from 'expo-router';
import { listenEvents, addEvent, initDatabase } from '../../services/sqliteService';
import { t } from '../../utils/language';

export default function EventsTab() {
  const { colors } = useTheme();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      try {
        await initDatabase();
        const unsub = listenEvents((list) => {
          setEvents(list);
          setLoading(false);
        });
        return () => unsub && unsub();
      } catch (error) {
        console.error('Error initializing events:', error);
        setLoading(false);
      }
    };
    
    initializeData();
  }, []);

  const handleAddQuick = async () => {
    try {
      setLoading(true);
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const created = await addEvent({ name: 'New Event', date: `${yyyy}-${mm}-${dd}`, budget: 0 });
      router.push(`/edit-event/${created.id}`);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={{ color: colors.text }}>{t('noEventsYet')}</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, { borderColor: colors.border }]}
            onPress={() => router.push(`/event/${item.id}`)}
          >
            <Text style={[styles.title, { color: colors.text }]}>{item.name || t('untitledEvent')}</Text>
            <Text style={{ color: colors.text, opacity: 0.8 }}>{item.date || t('noDate')}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={[styles.fab, { backgroundColor: colors.primary }]} onPress={handleAddQuick}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    lineHeight: 28,
  },
});

