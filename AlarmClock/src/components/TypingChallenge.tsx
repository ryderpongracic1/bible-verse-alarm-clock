import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Vibration,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {TextPassage} from '../types/Passage';

interface TypingChallengeProps {
  passage: TextPassage;
  onComplete: () => void;
}

const TypingChallenge: React.FC<TypingChallengeProps> = ({
  passage,
  onComplete,
}) => {
  // Just use the passage text, not the reference
  const fullText = passage.text;

  const [typedText, setTypedText] = useState('');
  const [mistakes, setMistakes] = useState(0);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Auto-focus the input when component mounts
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  useEffect(() => {
    // Check if typing is complete
    if (typedText.length === fullText.length) {
      if (typedText === fullText) {
        // Success!
        onComplete();
      }
    }
  }, [typedText, fullText, onComplete]);

  const handleTextChange = (text: string) => {
    const newChar = text[text.length - 1];
    const expectedChar = fullText[text.length - 1];

    // Don't allow typing more than the passage length
    if (text.length > fullText.length) {
      return;
    }

    // Check if the new character matches
    if (newChar !== expectedChar && text.length > typedText.length) {
      // Wrong character - vibrate and increment mistakes
      Vibration.vibrate(100);
      setMistakes(prev => prev + 1);
      return; // Don't allow wrong character
    }

    setTypedText(text);
  };

  const getCharacterStyle = (index: number) => {
    if (index < typedText.length) {
      // Already typed - green
      return styles.charCorrect;
    } else if (index === typedText.length) {
      // Current character - highlighted
      return styles.charCurrent;
    } else {
      // Not yet typed - gray
      return styles.charPending;
    }
  };

  const calculateAccuracy = (): number => {
    if (typedText.length === 0) return 100;
    const totalAttempts = typedText.length + mistakes;
    return Math.round((typedText.length / totalAttempts) * 100);
  };

  const calculateProgress = (): number => {
    return Math.round((typedText.length / fullText.length) * 100);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}>
        <View style={styles.header}>
          <Text style={styles.title}>Type to Dismiss Alarm</Text>
          <Text style={styles.source}>{passage.source}</Text>
        </View>

        {/* Passage display with character highlighting - scrollable for long verses */}
        <ScrollView
          style={styles.passageContainer}
          contentContainerStyle={styles.passageContentContainer}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={true}>
          <Text style={styles.passageText}>
            {fullText.split('').map((char, index) => (
              <Text key={index} style={getCharacterStyle(index)}>
                {char}
              </Text>
            ))}
          </Text>
        </ScrollView>

        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, {width: `${calculateProgress()}%`}]}
            />
          </View>
          <Text style={styles.progressText}>
            {typedText.length} / {fullText.length} characters
          </Text>
        </View>

        {/* Text input */}
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={typedText}
          onChangeText={handleTextChange}
          placeholder="Start typing here..."
          placeholderTextColor="#666"
          autoCorrect={false}
          autoComplete="off"
          autoCapitalize="none"
          contextMenuHidden={true} // Prevent copy/paste on iOS
          selectTextOnFocus={false}
          multiline={false}
          {...(Platform.OS === 'android' && {
            importantForAutofill: 'no',
            textContentType: 'none',
          })}
        />

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Progress</Text>
            <Text style={styles.statValue}>{calculateProgress()}%</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Accuracy</Text>
            <Text style={styles.statValue}>{calculateAccuracy()}%</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Mistakes</Text>
            <Text style={styles.statValue}>{mistakes}</Text>
          </View>
        </View>

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructions}>
            Type the passage exactly as shown to dismiss the alarm.
          </Text>
          <Text style={styles.instructions}>
            Incorrect characters will vibrate and won't be accepted.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  source: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  passageContainer: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    marginBottom: 20,
    maxHeight: 250, // Allow scrolling for long verses
  },
  passageContentContainer: {
    padding: 20,
  },
  passageText: {
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: 0.5,
  },
  charCorrect: {
    color: '#4CAF50', // Green for correct
    fontWeight: '600',
  },
  charCurrent: {
    color: '#2196F3', // Blue for current
    backgroundColor: 'rgba(33, 150, 243, 0.2)',
    fontWeight: 'bold',
  },
  charPending: {
    color: '#666', // Gray for pending
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#1a1a2e',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    borderWidth: 2,
    borderColor: '#2196F3',
    marginBottom: 20,
    minHeight: 60,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  instructionsContainer: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  instructions: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
});

export default TypingChallenge;
