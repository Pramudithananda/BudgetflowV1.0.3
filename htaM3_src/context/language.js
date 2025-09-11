import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageContext = createContext();

// Translation data
const translations = {
  en: {
    // Common
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    refresh: 'Refresh',
    retry: 'Retry',
    done: 'Done',
    clear: 'Clear',
    select: 'Select',
    all: 'All',
    none: 'None',
    view: 'View',
    total: 'Total',
    amount: 'Amount',
    date: 'Date',
    name: 'Name',
    description: 'Description',
    status: 'Status',
    category: 'Category',
    funder: 'Funder',
    event: 'Event',
    expense: 'Expense',
    budget: 'Budget',
    location: 'Location',
    created: 'Created',
    updated: 'Updated',
    
    // Status
    pending: 'Pending',
    spent: 'Spent',
    available: 'Available',
    outstanding: 'Outstanding',
    received: 'Received',
    
    // Navigation
    home: 'Home',
    events: 'Events',
    categories: 'Categories',
    funders: 'Funders',
    dashboard: 'Dashboard',
    settings: 'Settings',
    
    // Home Tab
    welcomeMessage: 'Welcome to BudgetFlow',
    budgetSummary: 'Budget Summary',
    totalBudget: 'Total Budget',
    totalExpenses: 'Total Expenses',
    remainingBudget: 'Remaining Budget',
    expenseStatus: 'Expense Status',
    recentExpenses: 'Recent Expenses',
    noExpensesYet: 'No expenses yet',
    addFirstExpense: 'Add your first expense',
    categoriesOverview: 'Categories Overview',
    noCategoriesYet: 'No categories yet',
    addFirstCategory: 'Add your first category',
    dataStatus: 'Data Status',
    refreshData: 'Refresh Data',
    
    // Events Tab
    eventsManagement: 'Events Management',
    addNewEvent: 'Add New Event',
    noEventsFound: 'No events found',
    eventName: 'Event Name',
    eventDate: 'Event Date',
    eventBudget: 'Event Budget',
    eventCategory: 'Event Category',
    eventLocation: 'Event Location',
    eventDescription: 'Event Description',
    eventDetails: 'Event Details',
    editEvent: 'Edit Event',
    deleteEvent: 'Delete Event',
    addExpenseToEvent: 'Add Expense to Event',
    expenseStatusSummary: 'Expense Status Summary',
    
    // Categories Tab
    categoriesManagement: 'Categories Management',
    addNewCategory: 'Add New Category',
    noCategoriesFound: 'No categories found',
    categoryName: 'Category Name',
    totalExpenses: 'Total Expenses',
    totalAmount: 'Total Amount',
    editCategory: 'Edit Category',
    deleteCategory: 'Delete Category',
    
    // Funders Tab
    fundersManagement: 'Funders Management',
    addNewFunder: 'Add New Funder',
    noFundersFound: 'No funders found',
    funderName: 'Funder Name',
    totalFunding: 'Total Funding',
    editFunder: 'Edit Funder',
    deleteFunder: 'Delete Funder',
    
    // Dashboard Tab
    dashboardOverview: 'Dashboard Overview',
    budgetAnalysis: 'Budget Analysis',
    expenseBreakdown: 'Expense Breakdown',
    categoryBreakdown: 'Category Breakdown',
    funderBreakdown: 'Funder Breakdown',
    recentActivity: 'Recent Activity',
    generateReport: 'Generate Report',
    downloadReport: 'Download Report',
    report: 'Report',
    
    // Settings Tab
    appSettings: 'App Settings',
    notifications: 'Notifications',
    darkMode: 'Dark Mode',
    language: 'Language',
    dataManagement: 'Data Management',
    exportData: 'Export Data',
    importData: 'Import Data',
    helpSupport: 'Help & Support',
    about: 'About',
    version: 'Version',
    developerInfo: 'Developer Info',
    logOut: 'Log Out',
    confirmLogout: 'Are you sure you want to log out?',
    
    // Forms and Modals
    required: 'Required',
    optional: 'Optional',
    saveChanges: 'Save Changes',
    saving: 'Saving...',
    addNew: 'Add New',
    adding: 'Adding...',
    deleteConfirm: 'Are you sure you want to delete this item?',
    deleteSuccess: 'Item deleted successfully',
    saveSuccess: 'Saved successfully',
    addSuccess: 'Added successfully',
    updateSuccess: 'Updated successfully',
    errorSaving: 'Error saving data',
    errorLoading: 'Error loading data',
    errorDeleting: 'Error deleting data',
    noDataFound: 'No data found',
    pleaseTryAgain: 'Please try again',
    
    // Data Export/Import
    exportSuccessful: 'Export Successful',
    exportFailed: 'Export Failed',
    importSuccessful: 'Import Successful',
    importFailed: 'Import Failed',
    dataExported: 'Data exported successfully!',
    dataImported: 'Data imported successfully!',
    backupCreated: 'Backup created automatically',
    invalidDataFormat: 'Invalid data format',
    pasteJsonData: 'Paste the exported JSON data below:',
    replaceAllData: 'This will replace all your current data with the imported data. A backup will be created automatically. Continue?',
    
    // Status Descriptions
    actionRequired: 'Action Required',
    completed: 'Completed',
    readyToUse: 'Ready to Use',
    needsAttention: 'Needs Attention',
  },
  
  si: {
    // Common
    save: 'සුරකින්න',
    cancel: 'අවලංගු කරන්න',
    delete: 'මකන්න',
    edit: 'සංස්කරණය',
    add: 'එකතු කරන්න',
    loading: 'පූරණය වෙමින්...',
    error: 'දෝෂය',
    success: 'සාර්ථකය',
    confirm: 'තහවුරු කරන්න',
    yes: 'ඔව්',
    no: 'නැහැ',
    ok: 'හරි',
    close: 'වසන්න',
    back: 'ආපසු',
    next: 'ඊළඟ',
    previous: 'පෙර',
    search: 'සොයන්න',
    filter: 'පෙරණය',
    sort: 'වර්ග කරන්න',
    refresh: 'නැවුම් කරන්න',
    retry: 'නැවත උත්සාහ කරන්න',
    done: 'අවසන්',
    clear: 'මකන්න',
    select: 'තෝරන්න',
    all: 'සියල්ල',
    none: 'කිසිවක් නැත',
    view: 'බලන්න',
    total: 'මුළු',
    amount: 'ප්‍රමාණය',
    date: 'දිනය',
    name: 'නම',
    description: 'විස්තර',
    status: 'තත්වය',
    category: 'ප්‍රවර්ගය',
    funder: 'අරමුදල් සපයන්නා',
    event: 'අවස්ථාව',
    expense: 'වියදම',
    budget: 'අයවැය',
    location: 'ස්ථානය',
    created: 'සාදන ලද',
    updated: 'යාවත්කාලීන කරන ලද',
    
    // Status
    pending: 'පොරොත්තුවෙන්',
    spent: 'වියදම් කරන ලද',
    available: 'ලබා ගත හැකි',
    outstanding: 'පැවරුම්',
    received: 'ලැබුණු',
    
    // Navigation
    home: 'මුල් පිටුව',
    events: 'අවස්ථා',
    categories: 'ප්‍රවර්ග',
    funders: 'අරමුදල් සපයන්නන්',
    dashboard: 'පාලක පුවරුව',
    settings: 'සැකසුම්',
    
    // Home Tab
    welcomeMessage: 'BudgetFlow වෙත සාදරයෙන් පිළිගනිමු',
    budgetSummary: 'අයවැය සාරාංශය',
    totalBudget: 'මුළු අයවැය',
    totalExpenses: 'මුළු වියදම්',
    remainingBudget: 'ඉතිරි අයවැය',
    expenseStatus: 'වියදම් තත්වය',
    recentExpenses: 'මෑත වියදම්',
    noExpensesYet: 'තවම වියදම් නැත',
    addFirstExpense: 'ඔබේ පළමු වියදම එකතු කරන්න',
    categoriesOverview: 'ප්‍රවර්ග දළ විශ්ලේෂණය',
    noCategoriesYet: 'තවම ප්‍රවර්ග නැත',
    addFirstCategory: 'ඔබේ පළමු ප්‍රවර්ගය එකතු කරන්න',
    dataStatus: 'දත්ත තත්වය',
    refreshData: 'දත්ත නැවුම් කරන්න',
    
    // Events Tab
    eventsManagement: 'අවස්ථා කළමනාකරණය',
    addNewEvent: 'නව අවස්ථාවක් එකතු කරන්න',
    noEventsFound: 'අවස්ථා හමු නොවීය',
    eventName: 'අවස්ථාවේ නම',
    eventDate: 'අවස්ථාවේ දිනය',
    eventBudget: 'අවස්ථාවේ අයවැය',
    eventCategory: 'අවස්ථාවේ ප්‍රවර්ගය',
    eventLocation: 'අවස්ථාවේ ස්ථානය',
    eventDescription: 'අවස්ථාවේ විස්තර',
    eventDetails: 'අවස්ථා විස්තර',
    editEvent: 'අවස්ථාව සංස්කරණය',
    deleteEvent: 'අවස්ථාව මකන්න',
    addExpenseToEvent: 'අවස්ථාවට වියදමක් එකතු කරන්න',
    expenseStatusSummary: 'වියදම් තත්ව සාරාංශය',
    
    // Categories Tab
    categoriesManagement: 'ප්‍රවර්ග කළමනාකරණය',
    addNewCategory: 'නව ප්‍රවර්ගයක් එකතු කරන්න',
    noCategoriesFound: 'ප්‍රවර්ග හමු නොවීය',
    categoryName: 'ප්‍රවර්ගයේ නම',
    totalExpenses: 'මුළු වියදම්',
    totalAmount: 'මුළු ප්‍රමාණය',
    editCategory: 'ප්‍රවර්ගය සංස්කරණය',
    deleteCategory: 'ප්‍රවර්ගය මකන්න',
    
    // Funders Tab
    fundersManagement: 'අරමුදල් සපයන්නන් කළමනාකරණය',
    addNewFunder: 'නව අරමුදල් සපයන්නෙකු එකතු කරන්න',
    noFundersFound: 'අරමුදල් සපයන්නන් හමු නොවීය',
    funderName: 'අරමුදල් සපයන්නාගේ නම',
    totalFunding: 'මුළු අරමුදල්',
    editFunder: 'අරමුදල් සපයන්නා සංස්කරණය',
    deleteFunder: 'අරමුදල් සපයන්නා මකන්න',
    
    // Dashboard Tab
    dashboardOverview: 'පාලක පුවරු දළ විශ්ලේෂණය',
    budgetAnalysis: 'අයවැය විශ්ලේෂණය',
    expenseBreakdown: 'වියදම් විධිවිධානය',
    categoryBreakdown: 'ප්‍රවර්ග විධිවිධානය',
    funderBreakdown: 'අරමුදල් සපයන්නන් විධිවිධානය',
    recentActivity: 'මෑත ක්‍රියාකාරකම්',
    generateReport: 'වාර්තාවක් සාදන්න',
    downloadReport: 'වාර්තාව බාගත කරන්න',
    report: 'වාර්තාව',
    
    // Settings Tab
    appSettings: 'ඇප් සැකසුම්',
    notifications: 'දැනුම්දීම්',
    darkMode: 'අඳුරු ප්‍රකාරය',
    language: 'භාෂාව',
    dataManagement: 'දත්ත කළමනාකරණය',
    exportData: 'දත්ත අපනයනය',
    importData: 'දත්ත ආනයනය',
    helpSupport: 'උදව් සහ සහාය',
    about: 'පිළිබඳව',
    version: 'ප්‍රභේදය',
    developerInfo: 'සංවර්ධක තොරතුරු',
    logOut: 'පිටවීම',
    confirmLogout: 'ඔබට ඇත්තෙන්ම පිටවීමට අවශ්‍යද?',
    
    // Forms and Modals
    required: 'අවශ්‍ය',
    optional: 'විකල්ප',
    saveChanges: 'වෙනස්කම් සුරකින්න',
    saving: 'සුරකිමින්...',
    addNew: 'නව එකතු කරන්න',
    adding: 'එකතු කරමින්...',
    deleteConfirm: 'ඔබට ඇත්තෙන්ම මෙම අයිතමය මකන්නට අවශ්‍යද?',
    deleteSuccess: 'අයිතමය සාර්ථකව මකන ලදී',
    saveSuccess: 'සාර්ථකව සුරකින ලදී',
    addSuccess: 'සාර්ථකව එකතු කරන ලදී',
    updateSuccess: 'සාර්ථකව යාවත්කාලීන කරන ලදී',
    errorSaving: 'දත්ත සුරැකීමේ දෝෂය',
    errorLoading: 'දත්ත පූරණයේ දෝෂය',
    errorDeleting: 'දත්ත මැකීමේ දෝෂය',
    noDataFound: 'දත්ත හමු නොවීය',
    pleaseTryAgain: 'කරුණාකර නැවත උත්සාහ කරන්න',
    
    // Data Export/Import
    exportSuccessful: 'අපනයනය සාර්ථකය',
    exportFailed: 'අපනයනය අසාර්ථකය',
    importSuccessful: 'ආනයනය සාර්ථකය',
    importFailed: 'ආනයනය අසාර්ථකය',
    dataExported: 'දත්ත සාර්ථකව අපනයනය කරන ලදී!',
    dataImported: 'දත්ත සාර්ථකව ආනයනය කරන ලදී!',
    backupCreated: 'ස්වයංක්‍රීයව උපස්ථයක් සාදන ලදී',
    invalidDataFormat: 'වලංගු නොවන දත්ත ආකෘතිය',
    pasteJsonData: 'අපනයනය කරන ලද JSON දත්ත පහත අලවන්න:',
    replaceAllData: 'මෙය ඔබේ වර්තමාන දත්ත සියල්ල ආනයනය කරන ලද දත්ත සමඟ ප්‍රතිස්ථාපනය කරයි. ස්වයංක්‍රීයව උපස්ථයක් සාදනු ලැබේ. ඉදිරියට යන්නද?',
    
    // Status Descriptions
    actionRequired: 'ක්‍රියාව අවශ්‍ය',
    completed: 'සම්පූර්ණයි',
    readyToUse: 'භාවිතයට සූදානම්',
    needsAttention: 'අවධානය අවශ්‍ය',
  },
  
  ta: {
    // Common
    save: 'சேமி',
    cancel: 'ரத்து செய்',
    delete: 'நீக்கு',
    edit: 'திருத்து',
    add: 'சேர்',
    loading: 'ஏற்றுகிறது...',
    error: 'பிழை',
    success: 'வெற்றி',
    confirm: 'உறுதிப்படுத்து',
    yes: 'ஆம்',
    no: 'இல்லை',
    ok: 'சரி',
    close: 'மூடு',
    back: 'பின்',
    next: 'அடுத்து',
    previous: 'முந்தைய',
    search: 'தேடு',
    filter: 'வடிகட்டு',
    sort: 'வரிசைப்படுத்து',
    refresh: 'புதுப்பி',
    retry: 'மீண்டும் முயற்சி',
    done: 'முடிந்தது',
    clear: 'அழி',
    select: 'தேர்ந்தெடு',
    all: 'அனைத்தும்',
    none: 'எதுவுமில்லை',
    view: 'பார்க்க',
    total: 'மொத்தம்',
    amount: 'தொகை',
    date: 'தேதி',
    name: 'பெயர்',
    description: 'விளக்கம்',
    status: 'நிலை',
    category: 'வகை',
    funder: 'நிதியளிப்பவர்',
    event: 'நிகழ்வு',
    expense: 'செலவு',
    budget: 'பட்ஜெட்',
    location: 'இடம்',
    created: 'உருவாக்கப்பட்டது',
    updated: 'புதுப்பிக்கப்பட்டது',
    
    // Status
    pending: 'நிலுவையில்',
    spent: 'செலவழிக்கப்பட்டது',
    available: 'கிடைக்கும்',
    outstanding: 'நிலுவை',
    received: 'பெறப்பட்டது',
    
    // Navigation
    home: 'முகப்பு',
    events: 'நிகழ்வுகள்',
    categories: 'வகைகள்',
    funders: 'நிதியளிப்பவர்கள்',
    dashboard: 'டாஷ்போர்டு',
    settings: 'அமைப்புகள்',
    
    // Home Tab
    welcomeMessage: 'BudgetFlow-க்கு வரவேற்கிறோம்',
    budgetSummary: 'பட்ஜெட் சுருக்கம்',
    totalBudget: 'மொத்த பட்ஜெட்',
    totalExpenses: 'மொத்த செலவுகள்',
    remainingBudget: 'மீதமுள்ள பட்ஜெட்',
    expenseStatus: 'செலவு நிலை',
    recentExpenses: 'சமீபத்திய செலவுகள்',
    noExpensesYet: 'இன்னும் செலவுகள் இல்லை',
    addFirstExpense: 'உங்கள் முதல் செலவைச் சேர்க்கவும்',
    categoriesOverview: 'வகைகள் கண்ணோட்டம்',
    noCategoriesYet: 'இன்னும் வகைகள் இல்லை',
    addFirstCategory: 'உங்கள் முதல் வகையைச் சேர்க்கவும்',
    dataStatus: 'தரவு நிலை',
    refreshData: 'தரவைப் புதுப்பி',
    
    // Events Tab
    eventsManagement: 'நிகழ்வுகள் மேலாண்மை',
    addNewEvent: 'புதிய நிகழ்வைச் சேர்',
    noEventsFound: 'நிகழ்வுகள் கிடைக்கவில்லை',
    eventName: 'நிகழ்வின் பெயர்',
    eventDate: 'நிகழ்வின் தேதி',
    eventBudget: 'நிகழ்வின் பட்ஜெட்',
    eventCategory: 'நிகழ்வின் வகை',
    eventLocation: 'நிகழ்வின் இடம்',
    eventDescription: 'நிகழ்வின் விளக்கம்',
    eventDetails: 'நிகழ்வு விவரங்கள்',
    editEvent: 'நிகழ்வைத் திருத்து',
    deleteEvent: 'நிகழ்வை நீக்கு',
    addExpenseToEvent: 'நிகழ்வுக்கு செலவைச் சேர்',
    expenseStatusSummary: 'செலவு நிலை சுருக்கம்',
    
    // Categories Tab
    categoriesManagement: 'வகைகள் மேலாண்மை',
    addNewCategory: 'புதிய வகையைச் சேர்',
    noCategoriesFound: 'வகைகள் கிடைக்கவில்லை',
    categoryName: 'வகையின் பெயர்',
    totalExpenses: 'மொத்த செலவுகள்',
    totalAmount: 'மொத்த தொகை',
    editCategory: 'வகையைத் திருத்து',
    deleteCategory: 'வகையை நீக்கு',
    
    // Funders Tab
    fundersManagement: 'நிதியளிப்பவர்கள் மேலாண்மை',
    addNewFunder: 'புதிய நிதியளிப்பவரைச் சேர்',
    noFundersFound: 'நிதியளிப்பவர்கள் கிடைக்கவில்லை',
    funderName: 'நிதியளிப்பவரின் பெயர்',
    totalFunding: 'மொத்த நிதியளிப்பு',
    editFunder: 'நிதியளிப்பவரைத் திருத்து',
    deleteFunder: 'நிதியளிப்பவரை நீக்கு',
    
    // Dashboard Tab
    dashboardOverview: 'டாஷ்போர்டு கண்ணோட்டம்',
    budgetAnalysis: 'பட்ஜெட் பகுப்பாய்வு',
    expenseBreakdown: 'செலவு பிரிவு',
    categoryBreakdown: 'வகை பிரிவு',
    funderBreakdown: 'நிதியளிப்பவர்கள் பிரிவு',
    recentActivity: 'சமீபத்திய செயல்பாடு',
    generateReport: 'அறிக்கையை உருவாக்கு',
    downloadReport: 'அறிக்கையைப் பதிவிறக்கு',
    report: 'அறிக்கை',
    
    // Settings Tab
    appSettings: 'ஆப் அமைப்புகள்',
    notifications: 'அறிவிப்புகள்',
    darkMode: 'இருண்ட பயன்முறை',
    language: 'மொழி',
    dataManagement: 'தரவு மேலாண்மை',
    exportData: 'தரவை ஏற்றுமதி செய்',
    importData: 'தரவை இறக்குமதி செய்',
    helpSupport: 'உதவி மற்றும் ஆதரவு',
    about: 'பற்றி',
    version: 'பதிப்பு',
    developerInfo: 'டெவலப்பர் தகவல்',
    logOut: 'வெளியேறு',
    confirmLogout: 'நீங்கள் உண்மையில் வெளியேற விரும்புகிறீர்களா?',
    
    // Forms and Modals
    required: 'தேவை',
    optional: 'விருப்பமானது',
    saveChanges: 'மாற்றங்களைச் சேமி',
    saving: 'சேமிக்கிறது...',
    addNew: 'புதியதைச் சேர்',
    adding: 'சேர்க்கிறது...',
    deleteConfirm: 'இந்த உருப்படியை நீக்க விரும்புகிறீர்களா?',
    deleteSuccess: 'உருப்படி வெற்றிகரமாக நீக்கப்பட்டது',
    saveSuccess: 'வெற்றிகரமாக சேமிக்கப்பட்டது',
    addSuccess: 'வெற்றிகரமாக சேர்க்கப்பட்டது',
    updateSuccess: 'வெற்றிகரமாக புதுப்பிக்கப்பட்டது',
    errorSaving: 'தரவை சேமிக்கும் பிழை',
    errorLoading: 'தரவை ஏற்றும் பிழை',
    errorDeleting: 'தரவை நீக்கும் பிழை',
    noDataFound: 'தரவு கிடைக்கவில்லை',
    pleaseTryAgain: 'தயவுசெய்து மீண்டும் முயற்சிக்கவும்',
    
    // Data Export/Import
    exportSuccessful: 'ஏற்றுமதி வெற்றிகரமானது',
    exportFailed: 'ஏற்றுமதி தோல்வி',
    importSuccessful: 'இறக்குமதி வெற்றிகரமானது',
    importFailed: 'இறக்குமதி தோல்வி',
    dataExported: 'தரவு வெற்றிகரமாக ஏற்றுமதி செய்யப்பட்டது!',
    dataImported: 'தரவு வெற்றிகரமாக இறக்குமதி செய்யப்பட்டது!',
    backupCreated: 'தானியங்கி காப்பு உருவாக்கப்பட்டது',
    invalidDataFormat: 'தவறான தரவு வடிவம்',
    pasteJsonData: 'ஏற்றுமதி செய்யப்பட்ட JSON தரவை கீழே ஒட்டவும்:',
    replaceAllData: 'இது உங்கள் தற்போதைய தரவை அனைத்தையும் இறக்குமதி செய்யப்பட்ட தரவுடன் மாற்றும். தானியங்கி காப்பு உருவாக்கப்படும். தொடரவா?',
    
    // Status Descriptions
    actionRequired: 'நடவடிக்கை தேவை',
    completed: 'முடிந்தது',
    readyToUse: 'பயன்படுத்த தயார்',
    needsAttention: 'கவனம் தேவை',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
      if (savedLanguage && translations[savedLanguage]) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const changeLanguage = async (newLanguage) => {
    try {
      if (translations[newLanguage]) {
        setLanguage(newLanguage);
        await AsyncStorage.setItem('selectedLanguage', newLanguage);
      }
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key) => {
    return translations[language]?.[key] || key;
  };

  const getAvailableLanguages = () => {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'si', name: 'Sinhala', nativeName: 'සිංහල' },
      { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' }
    ];
  };

  const value = {
    language,
    changeLanguage,
    t,
    getAvailableLanguages
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};