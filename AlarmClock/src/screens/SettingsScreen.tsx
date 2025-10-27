import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {
  BIBLE_BOOKS,
  getOldTestamentBooks,
  getNewTestamentBooks,
  getAllBookApiIds,
  BibleBook,
} from '../types/Settings';
import {SettingsStorage} from '../services/SettingsStorage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [useFamousVerses, setUseFamousVerses] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load settings when screen focuses
  useFocusEffect(
    useCallback(() => {
      loadSettings();
    }, []),
  );

  const loadSettings = async () => {
    try {
      const settings = await SettingsStorage.getSettings();
      setUseFamousVerses(settings.useFamousVerses);
      setSelectedBooks(settings.selectedBooks);
    } catch (error) {
      console.error('Error loading settings:', error);
      Alert.alert('Error', 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFamousVerses = async (value: boolean) => {
    try {
      setUseFamousVerses(value);
      await SettingsStorage.setUseFamousVerses(value);
    } catch (error) {
      console.error('Error toggling famous verses:', error);
      Alert.alert('Error', 'Failed to save setting');
    }
  };

  const handleToggleBook = async (bookApiId: string) => {
    try {
      let newSelectedBooks: string[];

      if (selectedBooks.includes(bookApiId)) {
        // Remove book from selection
        newSelectedBooks = selectedBooks.filter(id => id !== bookApiId);
      } else {
        // Add book to selection
        newSelectedBooks = [...selectedBooks, bookApiId];
      }

      setSelectedBooks(newSelectedBooks);
      await SettingsStorage.setSelectedBooks(newSelectedBooks);
    } catch (error) {
      console.error('Error toggling book:', error);
      Alert.alert('Error', 'Failed to save book selection');
    }
  };

  const handleSelectAll = async () => {
    try {
      const allBookIds = getAllBookApiIds();
      setSelectedBooks(allBookIds);
      await SettingsStorage.setSelectedBooks(allBookIds);
    } catch (error) {
      console.error('Error selecting all books:', error);
      Alert.alert('Error', 'Failed to select all books');
    }
  };

  const handleDeselectAll = async () => {
    try {
      setSelectedBooks([]);
      await SettingsStorage.setSelectedBooks([]);
    } catch (error) {
      console.error('Error deselecting all books:', error);
      Alert.alert('Error', 'Failed to deselect all books');
    }
  };

  const isBookSelected = (bookApiId: string): boolean => {
    return selectedBooks.includes(bookApiId);
  };

  const filterBooks = (books: BibleBook[]): BibleBook[] => {
    if (!searchQuery.trim()) {
      return books;
    }
    const query = searchQuery.toLowerCase();
    return books.filter(book =>
      book.name.toLowerCase().includes(query) ||
      book.abbreviation.toLowerCase().includes(query),
    );
  };

  const renderBookCheckbox = (book: BibleBook) => {
    const selected = isBookSelected(book.apiId);

    return (
      <TouchableOpacity
        key={book.apiId}
        style={styles.bookItem}
        onPress={() => handleToggleBook(book.apiId)}
        disabled={useFamousVerses}>
        <View style={[
          styles.checkbox,
          selected && styles.checkboxSelected,
          useFamousVerses && styles.checkboxDisabled,
        ]}>
          {selected && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={[
          styles.bookName,
          useFamousVerses && styles.bookNameDisabled,
        ]}>
          {book.name}
        </Text>
        <Text style={styles.bookInfo}>
          {book.chapters} {book.chapters === 1 ? 'chapter' : 'chapters'}
        </Text>
      </TouchableOpacity>
    );
  };

  const oldTestamentBooks = filterBooks(getOldTestamentBooks());
  const newTestamentBooks = filterBooks(getNewTestamentBooks());

  const selectedCount = selectedBooks.length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{width: 60}} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Famous Verses Toggle */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verse Source</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>Use Famous Verses Only</Text>
              <Text style={styles.settingDescription}>
                Use a curated list of 100 well-known Bible verses instead of random verses
              </Text>
            </View>
            <Switch
              value={useFamousVerses}
              onValueChange={handleToggleFamousVerses}
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={useFamousVerses ? '#2196F3' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Book Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bible Book Selection</Text>
            <Text style={styles.bookCount}>
              {selectedCount} of {BIBLE_BOOKS.length} books
            </Text>
          </View>

          {useFamousVerses && (
            <View style={styles.disabledNotice}>
              <Text style={styles.disabledNoticeText}>
                Book selection is disabled when using famous verses mode
              </Text>
            </View>
          )}

          {!useFamousVerses && selectedBooks.length === 0 && (
            <View style={[styles.disabledNotice, {backgroundColor: '#4a2a2a'}]}>
              <Text style={[styles.disabledNoticeText, {color: '#ff8888'}]}>
                ⚠️ No books selected! Please select at least one book or use "Select All"
              </Text>
            </View>
          )}

          {/* Search Bar */}
          <TextInput
            style={[styles.searchInput, useFamousVerses && styles.searchInputDisabled]}
            placeholder="Search books..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            editable={!useFamousVerses}
          />

          {/* Select All / Deselect All */}
          <View style={styles.bulkActions}>
            <TouchableOpacity
              style={[styles.bulkButton, useFamousVerses && styles.bulkButtonDisabled]}
              onPress={handleSelectAll}
              disabled={useFamousVerses}>
              <Text style={[styles.bulkButtonText, useFamousVerses && styles.bulkButtonTextDisabled]}>
                Select All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bulkButton, useFamousVerses && styles.bulkButtonDisabled]}
              onPress={handleDeselectAll}
              disabled={useFamousVerses}>
              <Text style={[styles.bulkButtonText, useFamousVerses && styles.bulkButtonTextDisabled]}>
                Deselect All
              </Text>
            </TouchableOpacity>
          </View>

          {/* Old Testament */}
          {oldTestamentBooks.length > 0 && (
            <>
              <Text style={styles.testamentTitle}>Old Testament ({oldTestamentBooks.length})</Text>
              {oldTestamentBooks.map(renderBookCheckbox)}
            </>
          )}

          {/* New Testament */}
          {newTestamentBooks.length > 0 && (
            <>
              <Text style={[styles.testamentTitle, {marginTop: 24}]}>
                New Testament ({newTestamentBooks.length})
              </Text>
              {newTestamentBooks.map(renderBookCheckbox)}
            </>
          )}

          {/* No Results */}
          {oldTestamentBooks.length === 0 && newTestamentBooks.length === 0 && searchQuery && (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>No books found matching "{searchQuery}"</Text>
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>How It Works:</Text>
          <Text style={styles.infoText}>
            • <Text style={{fontWeight: 'bold'}}>Famous Verses:</Text> Randomly selects from 100 popular Bible verses (disables book selection)
          </Text>
          <Text style={styles.infoText}>
            • <Text style={{fontWeight: 'bold'}}>Book Selection:</Text> Choose which books to include in random verse selection
          </Text>
          <Text style={styles.infoText}>
            • <Text style={{fontWeight: 'bold'}}>Select All:</Text> Checks all 66 books (default setting)
          </Text>
          <Text style={styles.infoText}>
            • <Text style={{fontWeight: 'bold'}}>Deselect All:</Text> Unchecks all books (shows warning)
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#1a1a2e',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a3e',
  },
  backButton: {
    fontSize: 16,
    color: '#2196F3',
    width: 60,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
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
    color: '#fff',
    marginBottom: 16,
  },
  bookCount: {
    fontSize: 14,
    color: '#888',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 12,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#888',
    lineHeight: 18,
  },
  disabledNotice: {
    backgroundColor: '#2a2a3e',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  disabledNoticeText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  searchInput: {
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#2a2a3e',
    marginBottom: 16,
  },
  searchInputDisabled: {
    opacity: 0.5,
  },
  bulkActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  bulkButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  bulkButtonDisabled: {
    backgroundColor: '#2a2a3e',
    opacity: 0.5,
  },
  bulkButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  bulkButtonTextDisabled: {
    color: '#666',
  },
  testamentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 12,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#2a2a3e',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  checkboxDisabled: {
    opacity: 0.5,
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookName: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
  },
  bookNameDisabled: {
    color: '#666',
  },
  bookInfo: {
    fontSize: 12,
    color: '#666',
  },
  noResults: {
    padding: 32,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
    lineHeight: 18,
  },
});

export default SettingsScreen;
