import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Body, Button, C, Card, Chips, Field, Muted, Row, Screen, Stat, Title } from '../../components/ui';
import { ACTIVITY_LEVELS, computePlan, fmt, GOAL_LABEL } from '../../lib/calc';
import { useStore } from '../../lib/store';

export default function Profile() {
  const { profile, saveProfile, resetAll } = useStore();
  const [form, setForm] = useState(profile);
  useEffect(() => setForm(profile), [profile]);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));
  const preview = computePlan(form);

  const save = () => {
    if (!preview.weight || !preview.height) {
      Alert.alert('Missing info', 'Please enter at least your height and weight.');
      return;
    }
    if (preview.bodyFat != null && (preview.bodyFat < 3 || preview.bodyFat > 60)) {
      Alert.alert('Check body fat', 'Body fat percentage should be between 3 and 60.');
      return;
    }
    saveProfile(form);
    Alert.alert('Saved', 'Your profile and plan have been updated.');
  };

  const reset = () =>
    Alert.alert('Reset all data?', 'This deletes your profile, measurements and workouts.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: resetAll },
    ]);

  return (
    <Screen>
      <Card>
        <Title>About you</Title>
        <Field label="Name" value={form.name} onChangeText={set('name')} keyboardType="default" placeholder="Your name" />
        <Chips
          options={[{ key: 'male', label: '♂ Male' }, { key: 'female', label: '♀ Female' }]}
          value={form.sex}
          onChange={set('sex')}
        />
        <Row>
          <Field label="Age" value={form.age} onChangeText={set('age')} unit="yrs" placeholder="25" keyboardType="number-pad" />
          <Field label="Height" value={form.height} onChangeText={set('height')} unit="cm" placeholder="175" />
        </Row>
        <Row>
          <Field label="Weight" value={form.weight} onChangeText={set('weight')} unit="kg" placeholder="80" />
          <Field label="Body fat" value={form.bodyFat} onChangeText={set('bodyFat')} unit="%" placeholder="20" />
        </Row>
        <Field label="Target weight" value={form.targetWeight} onChangeText={set('targetWeight')} unit="kg" placeholder="72" />
      </Card>

      <Card>
        <Title>Activity level</Title>
        <Chips options={ACTIVITY_LEVELS} value={form.activity} onChange={set('activity')} />
        <Muted>{ACTIVITY_LEVELS.find((a) => a.key === form.activity)?.hint}</Muted>
      </Card>

      <Card>
        <Title right={<Muted>{GOAL_LABEL[preview.goal]}</Muted>}>Your numbers</Title>
        <Row>
          <Stat label="BMI" value={fmt(preview.bmi)} sub={preview.bmiCategory} />
          <Stat label="Lean mass" value={fmt(preview.leanMass)} unit="kg" sub={preview.bodyFatCategory} />
        </Row>
        <Row>
          <Stat label="Maintenance" value={preview.tdee ? Math.round(preview.tdee) : '—'} unit="kcal" />
          <Stat label="Daily target" value={preview.calories ?? '—'} unit="kcal" color={C.accent} />
        </Row>
        {preview.weeksToGoal ? (
          <Body>
            🎯 {Math.abs(preview.weight - preview.target).toFixed(1)} kg to go ≈ {preview.weeksToGoal} weeks at a healthy pace.
          </Body>
        ) : null}
      </Card>

      <Button title="Save profile" onPress={save} />
      <Button title="Reset all data" kind="danger" onPress={reset} />
      <Muted style={{ textAlign: 'center', fontSize: 11 }}>Saving also records today's weight in your progress log.</Muted>
    </Screen>
  );
}
