import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View as RNView, ActivityIndicator, RefreshControl, Alert, StatusBar } from 'react-native';
import { Text, View } from '../../components/Themed';
import { router } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import BudgetSummary from '../../components/BudgetSummary';
import Card from '../../components/Card';
import Button from '../../components/Button';
import CategoryItem from '../../components/CategoryItem';
import ExpenseItem from '../../components/ExpenseItem';
import StatusCard from '../../components/StatusCard';
import { getCategories, getExpenses, getBudgetSummary, listenExpenses, listenCategories, getEvents } from '../../services/sqliteService';
import { useTheme } from '../../context/theme';
import { t } from '../../utils/language';

export default function HomeScreen() {
  const { colors, isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [events, setEvents] = useState([]);
  const [budgetSummary, setBudgetSummary] = useState({
    totalBudget: 0,
    receivedFund: 0,
  });
  const [statusTotals, setStatusTotals] = useState({
    remaining: 0,
    pending: 0,
    received: 0,
    spent: 0,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [budgetData, expensesData, categoriesData, eventsData] = await Promise.all([
        getBudgetSummary(),
        getExpenses(),
        getCategories(),
        getEvents()
      ]);
      
      // Calculate total budget as sum of all non-hidden expenses
      const totalBudget = expensesData
        .filter(expense => !expense.isHidden)
        .reduce((sum, expense) => sum + (expense.amount || 0), 0);
      
      // Calculate received fund as sum of expenses with status "Received" (excluding hidden)
      const receivedFund = expensesData
        .filter(expense => expense.status === 'Received' && !expense.isHidden)
        .reduce((sum, expense) => sum + (expense.amount || 0), 0);
      
      setBudgetSummary({
        totalBudget,
        receivedFund,
      });
      
      // Calculate totals for each status
      const totals = {
        remaining: 0,
        pending: 0,
        received: 0,
        spent: 0,
      };
      
      expensesData.forEach(expense => {
        // Exclude hidden expenses from totals
        if (!expense.isHidden) {
          if (expense.status === 'Outstanding') {
            totals.remaining += expense.amount;
          } else if (expense.status === 'Pending') {
            totals.pending += expense.amount;
          } else if (expense.status === 'Received') {
            totals.received += expense.amount;
          } else if (expense.status === 'Spent') {
            totals.spent += expense.amount;
          }
        }
      });
      
      setStatusTotals(totals);
      
      // Calculate totals for each category (excluding hidden expenses)
      const categoriesWithTotals = categoriesData.map(category => {
        const categoryExpenses = expensesData.filter(expense => expense.categoryId === category.id && !expense.isHidden);
        const totalAmount = categoryExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
        const expenseCount = categoryExpenses.length;
        
        return {
          ...category,
          totalAmount,
          expenseCount
        };
      });
      
      setCategories(categoriesWithTotals);
      setEvents(eventsData);
      setRecentExpenses(expensesData.filter(e => !e.isHidden).slice(0, 5)); // Get only 5 most recent non-hidden expenses
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Could not load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  const unsubscribeExpenses = listenExpenses(null, (expensesLive) => {
      const expensesData = expensesLive.map(exp => ({
        ...exp,
        createdAt: exp.createdAt?.toDate ? exp.createdAt.toDate().toISOString() : exp.createdAt,
      }));
      // Recompute budget & status totals (excluding hidden expenses)
      const totalBudget = expensesData.filter(e => !e.isHidden).reduce((sum, e) => sum + (e.amount || 0), 0);
      const receivedFund = expensesData.filter(e=> e.status==='Received' && !e.isHidden).reduce((s,e)=> s + (e.amount||0),0);
      setBudgetSummary(prev => ({ ...prev, totalBudget, receivedFund }));
      const totals = { remaining:0,pending:0,received:0,spent:0 };
      expensesData.forEach(e=>{
        if(!e.isHidden) {
          if(e.status==='Outstanding') totals.remaining += e.amount||0;
          else if(e.status==='Pending') totals.pending += e.amount||0;
          else if(e.status==='Received') totals.received += e.amount||0;
          else if(e.status==='Spent') totals.spent += e.amount||0;
        }
      });
      setStatusTotals(totals);
      // Update categories amounts (requires categories state)
      setCategories(prevCats => prevCats.map(cat => {
        const catExpenses = expensesData.filter(e=> e.categoryId===cat.id && !e.isHidden);
        const totalAmount = catExpenses.reduce((s,e)=> s + (e.amount||0),0);
        return { ...cat, totalAmount, expenseCount: catExpenses.length };
      }));
      setRecentExpenses(expensesData.filter(e => !e.isHidden).slice(0,5));
      // Update events data for event names in expenses
      getEvents().then(eventsData => setEvents(eventsData));
    });
    // Listen for category additions/updates
    const unsubscribeCategories = listenCategories((catsLive) => {
      setCategories(prev => {
        // Merge updated categories while preserving computed totals (will be recomputed below anyway)
        return catsLive.map(c => prev.find(p=>p.id===c.id) ? { ...c, ...prev.find(p=>p.id===c.id) } : { ...c, totalAmount:0, expenseCount:0 });
      });
    });
    return () => {
      unsubscribeExpenses && unsubscribeExpenses();
      unsubscribeCategories && unsubscribeCategories();
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.primary}
        translucent={false}
      />
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <BudgetSummary
          totalBudget={budgetSummary.totalBudget}
          receivedFund={budgetSummary.receivedFund}
          spent={statusTotals.spent}
        />
        
        <Card style={styles.sectionCard}>
          <RNView style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('expenseStatus')}</Text>
          </RNView>
          <RNView style={styles.statusCardsContainer}>
            {/* Row 1: Outstanding, Pending */}
            <StatusCard 
              status="Outstanding" 
              amount={statusTotals.remaining || 0} 
              colors={colors}
            />
            <StatusCard 
              status="Pending" 
              amount={statusTotals.pending || 0} 
              colors={colors}
            />
            {/* Row 2: Available, Spent */}
            <StatusCard 
              status="Available" 
              amount={statusTotals.received || 0} 
              colors={colors}
            />
            <StatusCard 
              status="Spent" 
              amount={statusTotals.spent || 0} 
              colors={colors}
            />
          </RNView>
        </Card>
        
        <Card style={styles.sectionCard}>
          <RNView style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('categories')}</Text>
            <Button 
              title={t('addNewCategory')} 
              onPress={() => router.push('/new-category')}
              variant="outline"
              style={styles.addButton}
            />
          </RNView>
          
          {categories.length === 0 ? (
            <RNView style={styles.emptyState}>
              <FontAwesome5 name="list" size={24} color={colors.text} />
              <Text style={styles.emptyText}>{t('noCategoriesYet')}</Text>
              <Text style={styles.emptySubtext}>{t('addFirstCategory')}</Text>
            </RNView>
          ) : (
            categories.slice(0, 3).map((category) => (
              <CategoryItem
                key={category.id}
                name={category.name}
                totalExpenses={category.expenseCount || 0}
                totalAmount={category.totalAmount || 0}
                onPress={() => router.push(`/category/${category.id}`)}
              />
            ))
          )}
          
          {categories.length > 3 && (
            <Button
              title={t('viewAllCategories')}
              onPress={() => router.push('/category')}
              variant="outline"
              style={styles.viewAllButton}
            />
          )}
        </Card>
        
        <Card style={styles.sectionCard}>
          <RNView style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('recentExpenses')}</Text>
            <Button 
              title={t('addNewExpense')} 
              onPress={() => router.push('/new-expense')}
              variant="outline"
              style={styles.addButton}
            />
          </RNView>
          
          {recentExpenses.length === 0 ? (
            <RNView style={styles.emptyState}>
              <FontAwesome5 name="receipt" size={24} color={colors.text} />
              <Text style={styles.emptyText}>{t('noExpensesYet')}</Text>
              <Text style={styles.emptySubtext}>{t('addFirstExpense')}</Text>
            </RNView>
          ) : (
            recentExpenses.map((expense) => {
              const event = events.find(e => e.id === expense.eventId);
              return (
                <ExpenseItem
                  key={expense.id}
                  title={expense.title}
                  amount={expense.amount}
                  status={expense.status}
                  assignedTo={expense.assignedTo}
                  eventName={event?.name}
                  onPress={() => router.push(`/expense/${expense.id}`)}
                />
              );
            })
          )}
          
          {recentExpenses.length > 0 && (
            <Button
              title={t('viewAllExpenses')}
              onPress={() => router.push('/all-expenses')}
              variant="outline"
              style={styles.viewAllButton}
            />
          )}
        </Card>
      </ScrollView>
    </>
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
  sectionCard: {
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  statusCard: {
    width: '48%',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  statusAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: 14,
  },
  addButton: {
    width: 150,
  },
  viewAllButton: {
    marginTop: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 4,
  },
}); 