# Phase 2: Text Passage Challenge Implementation Plan

## Overview
Add a text passage typing challenge that users must complete to dismiss the alarm, ensuring they are fully awake.

## Goals
- Make it impossible to dismiss alarm without completing the typing challenge
- Provide different difficulty levels
- Create an engaging, user-friendly typing interface
- Prevent bypass attempts

## Implementation Steps

### Step 1: Create Passage Data Structure

#### 1.1 Create Passage Interface
**File**: `src/types/Passage.ts`
```typescript
export interface TextPassage {
  id: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  length: number; // character count
}

export enum PassageDifficulty {
  Easy = 'easy',      // 20-40 characters
  Medium = 'medium',  // 41-70 characters
  Hard = 'hard',      // 71-100 characters
}
```

#### 1.2 Create Passage Database
**File**: `src/data/passages.json`
```json
[
  {
    "id": "easy_001",
    "text": "The early bird catches the worm.",
    "difficulty": "easy",
    "category": "proverb",
    "length": 33
  },
  {
    "id": "medium_001",
    "text": "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
    "difficulty": "medium",
    "category": "quote",
    "length": 111
  }
]
```

Sample passages to include:
- **Easy**: Short quotes, simple facts
- **Medium**: Longer quotes, tongue twisters
- **Hard**: Complex sentences, technical terms

### Step 2: Create Passage Service

**File**: `src/services/PassageService.ts`
```typescript
import passages from '../data/passages.json';
import {TextPassage, PassageDifficulty} from '../types/Passage';

export class PassageService {
  static getRandomPassage(difficulty: PassageDifficulty): TextPassage {
    // Filter by difficulty and return random passage
  }

  static getAllPassages(): TextPassage[] {
    // Return all passages
  }

  static getPassagesByCategory(category: string): TextPassage[] {
    // Filter by category
  }
}
```

### Step 3: Create Typing Challenge Component

**File**: `src/components/TypingChallenge.tsx`

Features to implement:
- Display the passage clearly
- Text input field for typing
- Real-time character-by-character validation
- Visual feedback:
  - Correct characters in green
  - Incorrect characters in red
  - Current character highlighted
- Progress indicator
- Prevent copy/paste
- Completion callback

```typescript
interface TypingChallengeProps {
  passage: TextPassage;
  onComplete: () => void;
  onFailure?: () => void;
}
```

UI Layout:
```
┌─────────────────────────────────┐
│      Typing Challenge           │
├─────────────────────────────────┤
│                                 │
│  [Target Text Display]          │
│  "The quick brown fox..."       │
│  With character highlighting    │
│                                 │
│  [Progress: 45/100]             │
│                                 │
│  [Text Input Field]             │
│  Real-time validation           │
│                                 │
│  [Accuracy: 92%]                │
│                                 │
└─────────────────────────────────┘
```

### Step 4: Update Alarm Type

**File**: `src/types/Alarm.ts`
```typescript
export interface Alarm {
  // ... existing fields
  challengeEnabled: boolean;
  challengeDifficulty: PassageDifficulty;
}
```

### Step 5: Update Edit Alarm Screen

**File**: `src/screens/EditAlarmScreen.tsx`

Add UI section:
```typescript
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Dismiss Challenge</Text>
  <Switch
    value={challengeEnabled}
    onValueChange={setChallengeEnabled}
  />
  {challengeEnabled && (
    <Picker
      selectedValue={challengeDifficulty}
      onValueChange={setChallengeDifficulty}>
      <Picker.Item label="Easy" value="easy" />
      <Picker.Item label="Medium" value="medium" />
      <Picker.Item label="Hard" value="hard" />
    </Picker>
  )}
</View>
```

### Step 6: Update Alarm Ringing Screen

**File**: `src/screens/AlarmRingingScreen.tsx`

Replace simple dismiss button with challenge:

```typescript
const [showChallenge, setShowChallenge] = useState(false);
const [passage, setPassage] = useState<TextPassage | null>(null);

useEffect(() => {
  if (alarm.challengeEnabled) {
    const selectedPassage = PassageService.getRandomPassage(
      alarm.challengeDifficulty
    );
    setPassage(selectedPassage);
    setShowChallenge(true);
  }
}, []);

const handleChallengeComplete = () => {
  handleDismiss(); // Existing dismiss logic
};

return (
  <View>
    {showChallenge && passage ? (
      <TypingChallenge
        passage={passage}
        onComplete={handleChallengeComplete}
      />
    ) : (
      // Original dismiss button for non-challenge alarms
      <TouchableOpacity onPress={handleDismiss}>
        <Text>Dismiss</Text>
      </TouchableOpacity>
    )}
  </View>
);
```

### Step 7: Bypass Prevention

Implement measures to prevent cheating:

1. **Disable Back Button** (Android)
```typescript
import {BackHandler} from 'react-native';

useEffect(() => {
  const backHandler = BackHandler.addEventListener(
    'hardwareBackPress',
    () => true // Prevent back navigation
  );
  return () => backHandler.remove();
}, []);
```

2. **Keep Screen Awake**
```typescript
import KeepAwake from 'react-native-keep-awake';

<KeepAwake /> // Add to component
```

3. **Disable Copy/Paste**
```typescript
<TextInput
  {...otherProps}
  contextMenuHidden={true}
  secureTextEntry={false}
  autoCorrect={false}
  autoComplete="off"
/>
```

4. **Continue Alarm Sound**
- Don't stop alarm sound until challenge is complete
- Only silence on successful completion

### Step 8: Enhanced Features (Optional)

#### Statistics Tracking
**File**: `src/services/StatsService.ts`
- Track completion times
- Track accuracy rates
- Store history of completed challenges

#### Custom Passages
- Allow users to add their own passages
- Import passages from files
- Share passages between users

#### Adaptive Difficulty
- Adjust difficulty based on user performance
- Suggest optimal difficulty level

## Testing Strategy

### Unit Tests
- Passage selection logic
- Character validation
- Progress calculation

### Integration Tests
- Alarm triggers challenge
- Challenge completion dismisses alarm
- Settings persist correctly

### Manual Testing Scenarios
1. Create alarm with easy challenge
2. Let alarm trigger
3. Attempt to dismiss without completing challenge
4. Complete challenge successfully
5. Verify alarm is dismissed
6. Test with different difficulty levels
7. Test bypass prevention:
   - Try pressing back button
   - Try switching apps
   - Try restarting device
   - Try force closing app

## UI/UX Considerations

### Accessibility
- Font size should be large enough to read when just waking up
- High contrast colors
- Option to disable challenge for accessibility needs

### User Experience
- Clear instructions
- Immediate visual feedback
- Satisfying completion animation
- Error tolerance (allow X mistakes?)

### Edge Cases
- What if user makes too many mistakes?
- Should there be a time limit?
- Fallback if challenge is too difficult?
- Emergency dismiss option (e.g., hold button for 10 seconds?)

## Dependencies to Add

```json
{
  "react-native-keep-awake": "^4.0.0", // Keep screen on
}
```

## File Checklist

- [ ] `src/types/Passage.ts` - Passage interface
- [ ] `src/data/passages.json` - Passage database (50+ passages)
- [ ] `src/services/PassageService.ts` - Passage selection logic
- [ ] `src/components/TypingChallenge.tsx` - Main challenge UI
- [ ] `src/utils/stringUtils.ts` - String comparison helpers
- [ ] Update `src/types/Alarm.ts` - Add challenge fields
- [ ] Update `src/screens/EditAlarmScreen.tsx` - Add challenge settings
- [ ] Update `src/screens/AlarmRingingScreen.tsx` - Integrate challenge

## Implementation Timeline

- **Day 1**: Data structures and passage database
- **Day 2**: TypingChallenge component (basic)
- **Day 3**: Integration with alarm system
- **Day 4**: Bypass prevention and polish
- **Day 5**: Testing and bug fixes

## Success Criteria

- ✅ User cannot dismiss alarm without completing challenge
- ✅ Three difficulty levels working correctly
- ✅ Visual feedback is clear and immediate
- ✅ No way to bypass the challenge
- ✅ Settings persist correctly
- ✅ Works on both iOS and Android
- ✅ Smooth, responsive typing experience

---

**Ready to implement?** Start with Step 1 and work through sequentially.
