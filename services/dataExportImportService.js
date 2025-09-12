import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as sqliteService from './sqliteService';

// Export all data to JSON
export const exportAllData = async () => {
  try {
    console.log('Starting data export...');
    
    // Get all data from SQLite database
    const [categoriesData, fundersData, eventsData, expensesData] = await Promise.all([
      sqliteService.getCategories(),
      sqliteService.getFunders(),
      sqliteService.getEvents(),
      sqliteService.getExpenses()
    ]);

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
    
    // Save to file
    const fileUri = FileSystem.documentDirectory + filename;
    await FileSystem.writeAsStringAsync(fileUri, jsonString);
    
    console.log('Data exported successfully:', fileUri);
    
    return {
      success: true,
      fileUri,
      filename,
      exportData
    };
  } catch (error) {
    console.error('Error exporting data:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Share exported data
export const shareExportedData = async (fileUri) => {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    
    if (!isAvailable) {
      console.log('Sharing is not available on this platform');
      return {
        success: false,
        error: 'Sharing is not available on this platform'
      };
    }
    
    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/json',
      dialogTitle: 'Share BudgetFlow Data Export'
    });
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error sharing data:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Import data from JSON string
export const importDataFromString = async (jsonString) => {
  try {
    console.log('Starting data import...');
    
    // Parse JSON
    const importData = JSON.parse(jsonString);
    
    // Validate data structure
    if (!importData.data || !importData.version) {
      throw new Error('Invalid import file format');
    }
    
    const { categories, funders, events, expenses } = importData.data;
    
    // Clear existing data and import new data
    // Note: This is a simple implementation. In production, you might want to:
    // - Merge data instead of replacing
    // - Handle ID conflicts
    // - Add validation
    
    // Import categories
    if (categories && Array.isArray(categories)) {
      for (const category of categories) {
        await sqliteService.addCategory(category);
      }
    }
    
    // Import funders
    if (funders && Array.isArray(funders)) {
      for (const funder of funders) {
        await sqliteService.addFunder(funder);
      }
    }
    
    // Import events
    if (events && Array.isArray(events)) {
      for (const event of events) {
        await sqliteService.addEvent(event);
      }
    }
    
    // Import expenses
    if (expenses && Array.isArray(expenses)) {
      for (const expense of expenses) {
        await sqliteService.addExpense(expense);
      }
    }
    
    console.log('Data imported successfully');
    
    return {
      success: true,
      summary: importData.summary || {}
    };
  } catch (error) {
    console.error('Error importing data:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Import data from file URI
export const importDataFromFile = async (fileUri) => {
  try {
    console.log('Reading import file:', fileUri);
    
    // Read file content
    const jsonString = await FileSystem.readAsStringAsync(fileUri);
    
    // Import the data
    return await importDataFromString(jsonString);
  } catch (error) {
    console.error('Error reading import file:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get data summary for display
export const getDataSummary = async () => {
  try {
    const [categories, funders, events, expenses] = await Promise.all([
      sqliteService.getCategories(),
      sqliteService.getFunders(),
      sqliteService.getEvents(),
      sqliteService.getExpenses()
    ]);
    
    return {
      categoriesCount: categories.length,
      fundersCount: funders.length,
      eventsCount: events.length,
      expensesCount: expenses.length,
      totalExpenseAmount: expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0)
    };
  } catch (error) {
    console.error('Error getting data summary:', error);
    return {
      categoriesCount: 0,
      fundersCount: 0,
      eventsCount: 0,
      expensesCount: 0,
      totalExpenseAmount: 0
    };
  }
};

// Clear all data (use with caution!)
export const clearAllData = async () => {
  try {
    console.log('Clearing all data...');
    
    // Get all items and delete them
    const [categories, funders, events, expenses] = await Promise.all([
      sqliteService.getCategories(),
      sqliteService.getFunders(),
      sqliteService.getEvents(),
      sqliteService.getExpenses()
    ]);
    
    // Delete all categories
    for (const category of categories) {
      await sqliteService.deleteCategory(category.id);
    }
    
    // Delete all funders
    for (const funder of funders) {
      await sqliteService.deleteFunder(funder.id);
    }
    
    // Delete all events
    for (const event of events) {
      await sqliteService.deleteEvent(event.id);
    }
    
    // Delete all expenses
    for (const expense of expenses) {
      await sqliteService.deleteExpense(expense.id);
    }
    
    console.log('All data cleared successfully');
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error clearing data:', error);
    return {
      success: false,
      error: error.message
    };
  }
};