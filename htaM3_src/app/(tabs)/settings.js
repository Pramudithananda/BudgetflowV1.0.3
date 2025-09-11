import { useState, useEffect } from 'react';
import { StyleSheet, View as RNView, TouchableOpacity, Switch, Alert, Linking, ActivityIndicator, ScrollView, TextInput } from 'react-native';
import { Text, View } from '../../components/Themed';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useAuth } from '../../context/auth';
import { useTheme } from '../../context/theme';
import { router } from 'expo-router';
import { exportAllData, shareExportedData, importDataFromString, getDataSummary } from '../../services/dataExportImportService';
import { t, setCurrentLanguage, getCurrentLanguage, getAvailableLanguages } from '../../utils/language';

export default function SettingsScreen() {
  const { user, logOut } = useAuth();
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [dataSummary, setDataSummary] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());

  // Load data summary on component mount
  useEffect(() => {
    loadDataSummary();
  }, []);

  const loadDataSummary = async () => {
    try {
      const summary = await getDataSummary();
      setDataSummary(summary);
    } catch (error) {
      console.error('Error loading data summary:', error);
    }
  };

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      const { fileUri, filename, exportData } = await exportAllData();
      await shareExportedData(fileUri, filename);
      
      Alert.alert(
        'Export Successful',
        `Data exported successfully!\n\nSummary:\n• ${exportData.summary.categoriesCount} Categories\n• ${exportData.summary.fundersCount} Funders\n• ${exportData.summary.eventsCount} Events\n• ${exportData.summary.expensesCount} Expenses\n• Total Amount: Rs. ${exportData.summary.totalExpenseAmount.toLocaleString()}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Export Failed', error.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportData = async () => {
    setShowImportModal(true);
  };

  const handleImportSubmit = async () => {
    if (!importText.trim()) {
      Alert.alert('Error', 'Please paste the exported JSON data');
      return;
    }

    Alert.alert(
      'Import Data',
      'This will replace all your current data with the imported data. A backup will be created automatically. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Import', 
          onPress: async () => {
            try {
              setIsImporting(true);
              const result = await importDataFromString(importText);
              
              if (result.success) {
                Alert.alert(
                  'Import Successful',
                  `Data imported successfully!\n\nSummary:\n• ${result.summary.categoriesCount} Categories\n• ${result.summary.fundersCount} Funders\n• ${result.summary.eventsCount} Events\n• ${result.summary.expensesCount} Expenses`,
                  [{ text: 'OK', onPress: () => {
                    setShowImportModal(false);
                    setImportText('');
                    loadDataSummary();
                  }}]
                );
              } else {
                Alert.alert('Import Failed', result.message);
              }
            } catch (error) {
              Alert.alert('Import Failed', error.message);
            } finally {
              setIsImporting(false);
            }
          }
        }
      ]
    );
  };

  const handleImportCancel = () => {
    setShowImportModal(false);
    setImportText('');
  };

  const handleLanguageSelect = async (languageCode) => {
    await setCurrentLanguage(languageCode);
    setCurrentLang(languageCode);
    setShowLanguageModal(false);
    // Force re-render by updating a dummy state
    setNotifications(prev => !prev);
    setNotifications(prev => !prev);
  };

  const handleLanguageCancel = () => {
    setShowLanguageModal(false);
  };


  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      Alert.alert('Error', 'Could not log out. Please try again.');
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', onPress: handleLogout, style: 'destructive' }
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.scrollContent}>
      {/* <Card style={styles.profileCard}>
        {user ? (
          <RNView style={styles.userInfo}>
            <RNView style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{user.email.charAt(0).toUpperCase()}</Text>
            </RNView>
            <RNView style={styles.userTextContainer}>
              <Text style={styles.userName}>{user.email}</Text>
              <Text style={styles.userJoined}>Member since {new Date().toLocaleDateString()}</Text>
            </RNView>
          </RNView>
        ) : (
          <RNView style={styles.loginContainer}>
            <Text style={styles.loginTitle}>Sign In to Your Account</Text>
            <Text style={styles.loginSubtitle}>Sign in to manage your event planning budget</Text>
            <Button 
              title="Sign In / Sign Up" 
              onPress={() => {}} 
              style={styles.loginButton}
            />
          </RNView>
        )}
      </Card> */}

      <Card style={styles.optionsCard}>
        <RNView style={[styles.settingItem, { borderBottomColor: colors.border }]}>
          <RNView style={styles.settingTextContainer}>
              <MaterialIcons name="notifications" size={24} color={colors.primary} />
            <Text style={[styles.settingText, { color: colors.text }]}>{t('notifications')}</Text>
          </RNView>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: isDarkMode ? '#444' : '#E0E0E0', true: isDarkMode ? '#2E7D32' : '#C8E6C9' }}
              thumbColor={notifications ? colors.primary : isDarkMode ? '#666' : '#9E9E9E'}
          />
        </RNView>

        <RNView style={[styles.settingItem, { borderBottomColor: colors.border }]}>
          <RNView style={styles.settingTextContainer}>
              <MaterialIcons name="dark-mode" size={24} color={colors.primary} />
            <Text style={[styles.settingText, { color: colors.text }]}>{t('darkMode')}</Text>
          </RNView>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: isDarkMode ? '#444' : '#E0E0E0', true: isDarkMode ? '#2E7D32' : '#C8E6C9' }}
              thumbColor={isDarkMode ? colors.primary : isDarkMode ? '#666' : '#9E9E9E'}
          />
        </RNView>

        <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]} onPress={() => setShowLanguageModal(true)}>
          <RNView style={styles.settingTextContainer}>
            <MaterialIcons name="language" size={24} color={colors.primary} />
            <Text style={[styles.settingText, { color: colors.text }]}>{t('language')}</Text>
          </RNView>
          <RNView style={styles.languageContainer}>
            <Text style={[styles.currentLanguage, { color: colors.text }]}>
              {getAvailableLanguages().find(lang => lang.code === currentLang)?.nativeName}
            </Text>
            <MaterialIcons name="chevron-right" size={24} color={colors.primary} />
          </RNView>
        </TouchableOpacity>
      </Card>

      <Card style={styles.optionsCard}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('dataManagement')}</Text>
        
        {dataSummary && (
          <RNView style={[
            styles.dataSummary,
            { 
              backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f8f8',
              borderColor: colors.border
            }
          ]}>
            <Text style={[styles.dataSummaryText, { color: colors.text }]}>
              Your data: {dataSummary.categoriesCount} Categories, {dataSummary.fundersCount} Funders, {dataSummary.eventsCount} Events, {dataSummary.expensesCount} Expenses
            </Text>
            <Text style={[styles.dataSummaryAmount, { color: colors.primary }]}>
              Total Amount: Rs. {dataSummary.totalExpenseAmount.toLocaleString()}
            </Text>
          </RNView>
        )}

        <TouchableOpacity 
          style={[
            styles.menuItem, 
            { 
              borderBottomColor: colors.border,
              backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f8f8'
            }
          ]} 
          onPress={handleExportData}
          disabled={isExporting}
        >
          <RNView style={styles.menuTextContainer}>
            <MaterialIcons name="file-download" size={24} color={colors.primary} />
            <Text style={[styles.menuText, { color: colors.text }]}>{t('exportData')}</Text>
          </RNView>
          {isExporting ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <MaterialIcons name="chevron-right" size={24} color={colors.primary} />
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.menuItem, 
            { 
              borderBottomColor: colors.border,
              backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f8f8'
            }
          ]} 
          onPress={handleImportData}
          disabled={isImporting}
        >
          <RNView style={styles.menuTextContainer}>
            <MaterialIcons name="file-upload" size={24} color={colors.primary} />
            <Text style={[styles.menuText, { color: colors.text }]}>{t('importData')}</Text>
          </RNView>
          {isImporting ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <MaterialIcons name="chevron-right" size={24} color={colors.primary} />
          )}
        </TouchableOpacity>
      </Card>

      <Card style={styles.optionsCard}>
  <TouchableOpacity style={[
            styles.menuItem, 
            { 
              borderBottomColor: colors.border,
              backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f8f8'
            }
          ]} onPress={() => router.push('/help')}>
          <RNView style={styles.menuTextContainer}>
              <MaterialIcons name="help-outline" size={24} color={colors.primary} />
            <Text style={[styles.menuText, { color: colors.text }]}>{t('helpSupport')}</Text>
          </RNView>
          <MaterialIcons name="chevron-right" size={24} color={colors.primary} />
        </TouchableOpacity>

  <TouchableOpacity style={[
            styles.menuItem, 
            { 
              borderBottomColor: colors.border,
              backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f8f8'
            }
          ]} onPress={() => router.push('/about')}>
          <RNView style={styles.menuTextContainer}>
              <MaterialIcons name="info-outline" size={24} color={colors.primary} />
            <Text style={[styles.menuText, { color: colors.text }]}>{t('about')}</Text>
          </RNView>
          <MaterialIcons name="chevron-right" size={24} color={colors.primary} />
        </TouchableOpacity>

        {user && (
          <TouchableOpacity style={[
            styles.menuItem,
            { 
              backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f8f8'
            }
          ]} onPress={confirmLogout}>
            <RNView style={styles.menuTextContainer}>
              <MaterialIcons name="logout" size={24} color="#E53935" />
              <Text style={[styles.menuText, styles.logoutText, { color: colors.text }]}>{t('logOut')}</Text>
            </RNView>
          </TouchableOpacity>
        )}
      </Card>

      <Card style={styles.optionsCard}>
        <Text style={[styles.devHeader, { color: colors.text }]}>Developer</Text>
        <RNView style={styles.devRow}>
            <MaterialIcons name="person" size={22} color={colors.primary} />
          <Text style={[styles.devText, { color: colors.text }]}>Dilshan Pathum</Text>
        </RNView>
        <TouchableOpacity style={styles.devRow} onPress={() => Linking.openURL('mailto:pathumpanagoda@gmail.com')}>
            <MaterialIcons name="email" size={22} color={colors.primary} />
          <Text style={[styles.devText, styles.devLink, { color: colors.primary }]}>pathumpanagoda@gmail.com</Text>
        </TouchableOpacity>
      </Card>

      <Text style={[styles.versionText, { color: colors.text }]}>Version 1.0.0</Text>

      {/* Language Selection Modal */}
      {showLanguageModal && (
        <RNView style={styles.modalOverlay}>
          <RNView style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t('language')}</Text>
            <Text style={[styles.modalSubtitle, { color: colors.text }]}>
              {t('select')} {t('language').toLowerCase()}:
            </Text>
            
            {getAvailableLanguages().map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  { 
                    borderColor: colors.border,
                    backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f8f8'
                  },
                  currentLang === lang.code && { 
                    backgroundColor: isDarkMode ? colors.primary + '40' : colors.primary + '20',
                    borderColor: colors.primary
                  }
                ]}
                onPress={() => handleLanguageSelect(lang.code)}
              >
                <Text style={[
                  styles.languageOptionText,
                  { color: colors.text },
                  currentLang === lang.code && { 
                    color: isDarkMode ? '#ffffff' : colors.primary, 
                    fontWeight: 'bold' 
                  }
                ]}>
                  {lang.nativeName} ({lang.name})
                </Text>
                {currentLang === lang.code && (
                  <MaterialIcons 
                    name="check" 
                    size={24} 
                    color={isDarkMode ? '#ffffff' : colors.primary} 
                  />
                )}
              </TouchableOpacity>
            ))}
            
            <RNView style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton, { borderColor: colors.border }]} 
                onPress={handleLanguageCancel}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>{t('cancel')}</Text>
              </TouchableOpacity>
            </RNView>
          </RNView>
        </RNView>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <RNView style={styles.modalOverlay}>
          <RNView style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t('importData')}</Text>
            <Text style={[styles.modalSubtitle, { color: colors.text }]}>
              {t('pasteJsonData')}
            </Text>
            
            <TextInput
              style={[styles.importTextInput, { 
                backgroundColor: colors.background, 
                color: colors.text, 
                borderColor: colors.border 
              }]}
              value={importText}
              onChangeText={setImportText}
              placeholder={t('pasteJsonData')}
              placeholderTextColor={colors.text + '80'}
              multiline
              numberOfLines={10}
              textAlignVertical="top"
            />
            
            <RNView style={styles.modalButtons}>
              <TouchableOpacity 
                style={[
                  styles.modalButton, 
                  styles.cancelButton, 
                  { 
                    borderColor: colors.border,
                    backgroundColor: isDarkMode ? '#3a3a3a' : '#f0f0f0'
                  }
                ]} 
                onPress={handleImportCancel}
              >
                <Text style={[
                  styles.cancelButtonText, 
                  { 
                    color: isDarkMode ? '#ffffff' : '#333333'
                  }
                ]}>{t('cancel')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.importButton, { backgroundColor: colors.primary }]} 
                onPress={handleImportSubmit}
                disabled={isImporting}
              >
                {isImporting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.importButtonText}>{t('importData')}</Text>
                )}
              </TouchableOpacity>
            </RNView>
          </RNView>
        </RNView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  profileCard: {
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
      backgroundColor: '#64a12d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  userTextContainer: {
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  userJoined: {
    fontSize: 14,
    color: '#757575',
  },
  loginContainer: {
    alignItems: 'center',
    padding: 16,
  },
  loginTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 16,
  },
  loginButton: {
    width: '100%',
  },
  optionsCard: {
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 12,
  },
  logoutText: {
    color: '#E53935',
  },
  versionText: {
    textAlign: 'center',
    color: '#9E9E9E',
    marginTop: 24,
  },
  devHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  devRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 12,
  },
  devText: {
    fontSize: 15,
  },
  devLink: {
    textDecorationLine: 'underline',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#64a12d',
  },
  dataSummary: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  dataSummaryText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dataSummaryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#64a12d',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#64a12d',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  importTextInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: 'monospace',
    backgroundColor: '#f8f9fa',
    marginBottom: 20,
    minHeight: 200,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  importButton: {
    backgroundColor: '#64a12d',
  },
  importButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentLanguage: {
    fontSize: 16,
    color: '#64a12d',
    fontWeight: '600',
    marginRight: 8,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
  },
  selectedLanguageOption: {
    backgroundColor: '#e8f5e8',
    borderWidth: 2,
    borderColor: '#64a12d',
  },
  languageOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedLanguageOptionText: {
    color: '#64a12d',
    fontWeight: '600',
  },
}); 