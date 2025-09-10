import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// Export all data to JSON
export const exportAllData = async () => {
  try {
    console.log('Starting data export...');
    
    // Get all data from AsyncStorage
    const [categories, funders, events, expenses] = await Promise.all([
      AsyncStorage.getItem('categories'),
      AsyncStorage.getItem('funders'),
      AsyncStorage.getItem('events'),
      AsyncStorage.getItem('expenses')
    ]);

    // Parse JSON data
    const categoriesData = categories ? JSON.parse(categories) : [];
    const fundersData = funders ? JSON.parse(funders) : [];
    const eventsData = events ? JSON.parse(events) : [];
    const expensesData = expenses ? JSON.parse(expenses) : [];

    // Create export object
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      appName: 'BudgetFlow',
      data: {
        categories: categoriesData,
        funders: fundersData,
        events: eventsData,
        expenses: expensesData
      },
      summary: {
        categoriesCount: categoriesData.length,
        fundersCount: fundersData.length,
        eventsCount: eventsData.length,
        expensesCount: expensesData.length,
        totalExpenseAmount: expensesData.reduce((sum, exp) => sum + (exp.amount || 0), 0)
      }
    };

    // Convert to JSON string
    const jsonString = JSON.stringify(exportData, null, 2);
    
    // Create filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `BudgetFlow_Export_${timestamp}.json`;
    
    // Write to file
    const fileUri = `${FileSystem.documentDirectory}${filename}`;
    await FileSystem.writeAsStringAsync(fileUri, jsonString, {
      encoding: FileSystem.EncodingType.UTF8
    });

    console.log('Data exported successfully to:', fileUri);
    return { fileUri, filename, exportData };
  } catch (error) {
    console.error('Error exporting data:', error);
    throw new Error('Failed to export data: ' + error.message);
  }
};

// Share exported data
export const shareExportedData = async (fileUri, filename) => {
  try {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: `Export BudgetFlow Data - ${filename}`,
      });
    } else {
      throw new Error('Sharing is not available on this device');
    }
  } catch (error) {
    console.error('Error sharing exported data:', error);
    throw new Error('Failed to share exported data: ' + error.message);
  }
};

// Import data from JSON string (for now, without file picker)
export const importDataFromString = async (jsonString) => {
  try {
    console.log('Starting data import from string...');
    
    // Parse JSON
    const importData = JSON.parse(jsonString);
    
    // Validate data structure
    if (!importData.data || !importData.version) {
      throw new Error('Invalid data format');
    }

    // Validate required data
    const { categories, funders, events, expenses } = importData.data;
    
    if (!Array.isArray(categories) || !Array.isArray(funders) || 
        !Array.isArray(events) || !Array.isArray(expenses)) {
      throw new Error('Invalid data structure');
    }

    // Backup current data before import
    await backupCurrentData();

    // Import new data
    await Promise.all([
      AsyncStorage.setItem('categories', JSON.stringify(categories)),
      AsyncStorage.setItem('funders', JSON.stringify(funders)),
      AsyncStorage.setItem('events', JSON.stringify(events)),
      AsyncStorage.setItem('expenses', JSON.stringify(expenses))
    ]);

    console.log('Data imported successfully');
    return { 
      success: true, 
      message: 'Data imported successfully',
      summary: importData.summary || {
        categoriesCount: categories.length,
        fundersCount: funders.length,
        eventsCount: events.length,
        expensesCount: expenses.length
      }
    };
  } catch (error) {
    console.error('Error importing data:', error);
    return { 
      success: false, 
      message: 'Failed to import data: ' + error.message 
    };
  }
};

// Backup current data before import
const backupCurrentData = async () => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const backupFilename = `BudgetFlow_Backup_${timestamp}.json`;
    
    // Get current data
    const [categories, funders, events, expenses] = await Promise.all([
      AsyncStorage.getItem('categories'),
      AsyncStorage.getItem('funders'),
      AsyncStorage.getItem('events'),
      AsyncStorage.getItem('expenses')
    ]);

    // Create backup object
    const backupData = {
      version: '1.0',
      backupDate: new Date().toISOString(),
      appName: 'BudgetFlow',
      data: {
        categories: categories ? JSON.parse(categories) : [],
        funders: funders ? JSON.parse(funders) : [],
        events: events ? JSON.parse(events) : [],
        expenses: expenses ? JSON.parse(expenses) : []
      }
    };

    // Save backup
    const backupUri = `${FileSystem.documentDirectory}${backupFilename}`;
    await FileSystem.writeAsStringAsync(backupUri, JSON.stringify(backupData, null, 2), {
      encoding: FileSystem.EncodingType.UTF8
    });

    console.log('Backup created:', backupFilename);
  } catch (error) {
    console.error('Error creating backup:', error);
    // Don't throw error for backup failure, just log it
  }
};

// Get data summary for display
export const getDataSummary = async () => {
  try {
    const [categories, funders, events, expenses] = await Promise.all([
      AsyncStorage.getItem('categories'),
      AsyncStorage.getItem('funders'),
      AsyncStorage.getItem('events'),
      AsyncStorage.getItem('expenses')
    ]);

    const categoriesData = categories ? JSON.parse(categories) : [];
    const fundersData = funders ? JSON.parse(funders) : [];
    const eventsData = events ? JSON.parse(events) : [];
    const expensesData = expenses ? JSON.parse(expenses) : [];

    return {
      categoriesCount: categoriesData.length,
      fundersCount: fundersData.length,
      eventsCount: eventsData.length,
      expensesCount: expensesData.length,
      totalExpenseAmount: expensesData.reduce((sum, exp) => sum + (exp.amount || 0), 0),
      lastModified: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting data summary:', error);
    return {
      categoriesCount: 0,
      fundersCount: 0,
      eventsCount: 0,
      expensesCount: 0,
      totalExpenseAmount: 0,
      lastModified: new Date().toISOString()
    };
  }
};

// Clear all data (for testing/reset)
export const clearAllData = async () => {
  try {
    await Promise.all([
      AsyncStorage.removeItem('categories'),
      AsyncStorage.removeItem('funders'),
      AsyncStorage.removeItem('events'),
      AsyncStorage.removeItem('expenses')
    ]);
    console.log('All data cleared');
  } catch (error) {
    console.error('Error clearing data:', error);
    throw new Error('Failed to clear data: ' + error.message);
  }
};