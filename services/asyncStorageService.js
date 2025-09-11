import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  CATEGORIES: 'categories',
  FUNDERS: 'funders',
  EVENTS: 'events',
  EXPENSES: 'expenses'
};

// Helper functions
const getData = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error getting ${key}:`, error);
    return [];
  }
};

const setData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
    return data;
  } catch (error) {
    console.error(`Error setting ${key}:`, error);
    throw error;
  }
};

// Initialize sample data
export const initDatabase = async () => {
  try {
    const categories = await getData(STORAGE_KEYS.CATEGORIES);
    const funders = await getData(STORAGE_KEYS.FUNDERS);
    const events = await getData(STORAGE_KEYS.EVENTS);
    const expenses = await getData(STORAGE_KEYS.EXPENSES);

    // Initialize categories if empty
    if (categories.length === 0) {
      const sampleCategories = [
        { id: 1, name: 'Food & Beverages', description: 'Meals, snacks, and drinks', createdAt: new Date().toISOString() },
        { id: 2, name: 'Decorations', description: 'Party decorations and setup', createdAt: new Date().toISOString() },
        { id: 3, name: 'Transportation', description: 'Travel and transport costs', createdAt: new Date().toISOString() },
        { id: 4, name: 'Other Expenses', description: 'Miscellaneous expenses', createdAt: new Date().toISOString() }
      ];
      await setData(STORAGE_KEYS.CATEGORIES, sampleCategories);
    }

    // Initialize funders if empty
    if (funders.length === 0) {
      const sampleFunders = [
        { id: 1, name: 'Sujith', phone: '+94 77 123 4567', email: '', createdAt: new Date().toISOString() },
        { id: 2, name: 'Nirvan', phone: '+94 77 234 5678', email: '', createdAt: new Date().toISOString() },
        { id: 3, name: 'Welfare', phone: '+94 77 345 6789', email: '', createdAt: new Date().toISOString() }
      ];
      await setData(STORAGE_KEYS.FUNDERS, sampleFunders);
    }

    // Initialize events if empty
    if (events.length === 0) {
      const sampleEvents = [
        {
          id: 1,
          name: 'Birthday Party',
          date: '2025-09-08',
          budget: 25000,
          category: 'Celebration',
          location: 'Home',
          description: 'Birthday celebration with friends and family',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Conference 2025',
          date: '2025-10-15',
          budget: 50000,
          category: 'Business',
          location: 'Convention Center',
          description: 'Annual business conference',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      await setData(STORAGE_KEYS.EVENTS, sampleEvents);
    }

    // Initialize expenses if empty
    if (expenses.length === 0) {
      const sampleExpenses = [
        {
          id: 1,
          title: 'Catering',
          amount: 60000,
          description: 'Food and drinks for birthday party',
          categoryId: 1,
          funderId: 1,
          eventId: 1,
          status: 'Spent',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Decorations',
          amount: 20000,
          description: 'Party decorations and balloons',
          categoryId: 2,
          funderId: 2,
          eventId: 1,
          status: 'Available',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 3,
          title: 'Transportation',
          amount: 10000,
          description: 'Travel costs for conference',
          categoryId: 3,
          funderId: 3,
          eventId: 2,
          status: 'Pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 4,
          title: 'Miscellaneous',
          amount: 10000,
          description: 'Other expenses',
          categoryId: 4,
          funderId: 1,
          eventId: 1,
          status: 'Outstanding',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      await setData(STORAGE_KEYS.EXPENSES, sampleExpenses);
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Category Operations
export const getCategories = async () => {
  return await getData(STORAGE_KEYS.CATEGORIES);
};

export const addCategory = async (categoryData) => {
  const categories = await getData(STORAGE_KEYS.CATEGORIES);
  const newId = Math.max(...categories.map(c => c.id), 0) + 1;
  const newCategory = {
    id: newId,
    ...categoryData,
    createdAt: new Date().toISOString()
  };
  categories.push(newCategory);
  await setData(STORAGE_KEYS.CATEGORIES, categories);
  return newCategory;
};

export const updateCategory = async (id, categoryData) => {
  const categories = await getData(STORAGE_KEYS.CATEGORIES);
  const index = categories.findIndex(c => c.id === id);
  if (index !== -1) {
    categories[index] = { ...categories[index], ...categoryData };
    await setData(STORAGE_KEYS.CATEGORIES, categories);
    return categories[index];
  }
  throw new Error('Category not found');
};

export const deleteCategory = async (id) => {
  const categories = await getData(STORAGE_KEYS.CATEGORIES);
  const filtered = categories.filter(c => c.id !== parseInt(id));
  await setData(STORAGE_KEYS.CATEGORIES, filtered);
  return id;
};

// Funder Operations
export const getFunders = async () => {
  return await getData(STORAGE_KEYS.FUNDERS);
};

export const addFunder = async (funderData) => {
  const funders = await getData(STORAGE_KEYS.FUNDERS);
  const newId = Math.max(...funders.map(f => f.id), 0) + 1;
  const newFunder = {
    id: newId,
    ...funderData,
    createdAt: new Date().toISOString()
  };
  funders.push(newFunder);
  await setData(STORAGE_KEYS.FUNDERS, funders);
  return newFunder;
};

export const updateFunder = async (id, funderData) => {
  const funders = await getData(STORAGE_KEYS.FUNDERS);
  const index = funders.findIndex(f => f.id === id);
  if (index !== -1) {
    funders[index] = { ...funders[index], ...funderData };
    await setData(STORAGE_KEYS.FUNDERS, funders);
    return funders[index];
  }
  throw new Error('Funder not found');
};

export const deleteFunder = async (id) => {
  const funders = await getData(STORAGE_KEYS.FUNDERS);
  const filtered = funders.filter(f => f.id !== parseInt(id));
  await setData(STORAGE_KEYS.FUNDERS, filtered);
  return id;
};

// Event Operations
export const getEvents = async () => {
  const events = await getData(STORAGE_KEYS.EVENTS);
  return events.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const getEvent = async (id) => {
  const events = await getData(STORAGE_KEYS.EVENTS);
  return events.find(e => e.id === parseInt(id)) || null;
};

export const addEvent = async (eventData) => {
  const events = await getData(STORAGE_KEYS.EVENTS);
  const newId = Math.max(...events.map(e => e.id), 0) + 1;
  const newEvent = {
    id: newId,
    name: eventData.name || 'Untitled Event',
    date: eventData.date || '',
    budget: eventData.budget || 0,
    category: eventData.category || '',
    location: eventData.location || '',
    description: eventData.description || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  events.push(newEvent);
  await setData(STORAGE_KEYS.EVENTS, events);
  return newEvent;
};

export const updateEvent = async (id, eventData) => {
  const events = await getData(STORAGE_KEYS.EVENTS);
  const index = events.findIndex(e => e.id === parseInt(id));
  if (index !== -1) {
    events[index] = {
      ...events[index],
      ...eventData,
      updatedAt: new Date().toISOString()
    };
    await setData(STORAGE_KEYS.EVENTS, events);
    return events[index];
  }
  throw new Error('Event not found');
};

export const deleteEvent = async (id) => {
  try {
    console.log(`Starting deletion of event ${id}`);
    
    // First, delete all expenses related to this event
    const expenses = await getData(STORAGE_KEYS.EXPENSES);
    console.log(`Found ${expenses.length} total expenses`);
    
    const relatedExpenses = expenses.filter(e => e.eventId === parseInt(id));
    console.log(`Found ${relatedExpenses.length} expenses related to event ${id}`);
    
    const filteredExpenses = expenses.filter(e => e.eventId !== parseInt(id));
    await setData(STORAGE_KEYS.EXPENSES, filteredExpenses);
    console.log(`Deleted ${relatedExpenses.length} expenses, ${filteredExpenses.length} expenses remaining`);
    
    // Then delete the event itself
    const events = await getData(STORAGE_KEYS.EVENTS);
    console.log(`Found ${events.length} total events`);
    
    const eventToDelete = events.find(e => e.id === parseInt(id));
    if (!eventToDelete) {
      throw new Error(`Event with id ${id} not found`);
    }
    
    const filteredEvents = events.filter(e => e.id !== parseInt(id));
    await setData(STORAGE_KEYS.EVENTS, filteredEvents);
    console.log(`Event ${id} deleted successfully, ${filteredEvents.length} events remaining`);
    
    return id;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// Expense Operations
export const getExpenses = async (categoryId = null) => {
  const expenses = await getData(STORAGE_KEYS.EXPENSES);
  if (categoryId) {
    return expenses.filter(e => e.categoryId === parseInt(categoryId));
  }
  return expenses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const getExpensesByEvent = async (eventId) => {
  const expenses = await getData(STORAGE_KEYS.EXPENSES);
  return expenses
    .filter(e => e.eventId === parseInt(eventId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const getExpense = async (id) => {
  const expenses = await getData(STORAGE_KEYS.EXPENSES);
  return expenses.find(e => e.id === parseInt(id)) || null;
};

export const addExpense = async (expenseData) => {
  const expenses = await getData(STORAGE_KEYS.EXPENSES);
  const newId = Math.max(...expenses.map(e => e.id), 0) + 1;
  const newExpense = {
    id: newId,
    title: expenseData.title || '',
    amount: expenseData.amount || 0,
    description: expenseData.description || '',
    categoryId: expenseData.categoryId || null,
    funderId: expenseData.funderId || null,
    eventId: expenseData.eventId || null,
    status: expenseData.status || 'Outstanding',
    isHidden: expenseData.isHidden || false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  expenses.push(newExpense);
  await setData(STORAGE_KEYS.EXPENSES, expenses);
  return newExpense;
};

export const updateExpense = async (id, expenseData) => {
  const expenses = await getData(STORAGE_KEYS.EXPENSES);
  const index = expenses.findIndex(e => e.id === parseInt(id));
  if (index !== -1) {
    expenses[index] = {
      ...expenses[index],
      ...expenseData,
      updatedAt: new Date().toISOString()
    };
    await setData(STORAGE_KEYS.EXPENSES, expenses);
    return expenses[index];
  }
  throw new Error('Expense not found');
};

export const deleteExpense = async (id) => {
  const expenses = await getData(STORAGE_KEYS.EXPENSES);
  const filtered = expenses.filter(e => e.id !== parseInt(id));
  await setData(STORAGE_KEYS.EXPENSES, filtered);
  return id;
};

export const toggleExpenseVisibility = async (id) => {
  const expenses = await getData(STORAGE_KEYS.EXPENSES);
  const index = expenses.findIndex(e => e.id === parseInt(id));
  if (index !== -1) {
    expenses[index] = {
      ...expenses[index],
      isHidden: !expenses[index].isHidden,
      updatedAt: new Date().toISOString()
    };
    await setData(STORAGE_KEYS.EXPENSES, expenses);
    return expenses[index];
  }
  throw new Error('Expense not found');
};

// Status Summary
export const getEventStatusSummary = async (eventId) => {
  const expenses = await getExpensesByEvent(eventId);
  const summary = { Pending: 0, Spent: 0, Available: 0, Outstanding: 0 };
  expenses.forEach(expense => {
    // Exclude hidden expenses from summary
    if (!expense.isHidden) {
      const status = expense.status || 'Outstanding';
      summary[status] = (summary[status] || 0) + (expense.amount || 0);
    }
  });
  return summary;
};

// Budget Summary
export const getBudgetSummary = async () => {
  const expenses = await getData(STORAGE_KEYS.EXPENSES);
  const total = expenses
    .filter(expense => !expense.isHidden) // Exclude hidden expenses
    .reduce((sum, expense) => sum + (expense.amount || 0), 0);
  return { total };
};

// Listen functions (for compatibility with Firebase code)
export const listenEvents = (callback) => {
  // Initial call
  getEvents().then(callback).catch(console.error);
  
  // Set up interval to check for changes every 2 seconds
  const interval = setInterval(() => {
    getEvents().then(callback).catch(console.error);
  }, 2000);
  
  // Return unsubscribe function
  return () => {
    clearInterval(interval);
  };
};

export const listenExpensesByEvent = (eventId, callback) => {
  // Initial call
  getExpensesByEvent(eventId).then(callback).catch(console.error);
  
  // Set up interval to check for changes every 2 seconds
  const interval = setInterval(() => {
    getExpensesByEvent(eventId).then(callback).catch(console.error);
  }, 2000);
  
  // Return unsubscribe function
  return () => {
    clearInterval(interval);
  };
};

export const listenExpenses = (callback) => {
  // Initial call
  getExpenses().then(callback).catch(console.error);
  
  // Set up interval to check for changes every 2 seconds
  const interval = setInterval(() => {
    getExpenses().then(callback).catch(console.error);
  }, 2000);
  
  // Return unsubscribe function
  return () => {
    clearInterval(interval);
  };
};

export const listenCategories = (callback) => {
  // Initial call
  getCategories().then(callback).catch(console.error);
  
  // Set up interval to check for changes every 2 seconds
  const interval = setInterval(() => {
    getCategories().then(callback).catch(console.error);
  }, 2000);
  
  // Return unsubscribe function
  return () => {
    clearInterval(interval);
  };
};

export const listenFunders = (callback) => {
  // Initial call
  getFunders().then(callback).catch(console.error);
  
  // Set up interval to check for changes every 2 seconds
  const interval = setInterval(() => {
    getFunders().then(callback).catch(console.error);
  }, 2000);
  
  // Return unsubscribe function
  return () => {
    clearInterval(interval);
  };
};