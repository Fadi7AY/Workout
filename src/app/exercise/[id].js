import { Stack, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { Body, C, Card, Muted, Row, Screen, Stat, Title } from '../../components/ui';
import { getExercise, MUSCLE_ICON } from '../../data/exercises';
import { PROGRAMS } from '../../data/programs';
import { useStore } from '../../lib/store';

export default function ExerciseDetail() {
  const { id } = useLocalSearchParams();
  const { workouts } = useStore();
  const e = getExercise(id);

  if (!e) {
    return (
      <Screen>
        <Muted>Exercise not found.</Muted>
      </Screen>
    );
  }

  const usedIn = PROGRAMS.filter((p) => p.days.some((d) => d.items.some(([x]) => x === e.id)));
  const history = workouts
    .map((w) => ({ date: w.date, sets: w.exercises.find((x) => x.exerciseId === e.id)?.sets }))
    .filter((h) => h.sets?.length)
    .slice(0, 5);

  return (
    <Screen>
      <Stack.Screen options={{ title: e.name }} />
      <View style={{ alignItems: 'center', paddingVertical: 12, backgroundColor: C.card, borderRadius: 16 }}>
        <Text style={{ fontSize: 64 }}>{MUSCLE_ICON[e.muscle]}</Text>
        <Text style={{ color: C.text, fontSize: 22, fontWeight: '800', textAlign: 'center' }}>{e.name}</Text>
      </View>

      <Row>
        <Stat label="Muscle" value={e.muscle} />
        <Stat label="Equipment" value={e.equipment} />
      </Row>
      <Stat label="Level" value={e.level} />

      <Card>
        <Title>How to do it</Title>
        {e.steps.map((step, i) => (
          <Row key={i} style={{ alignItems: 'flex-start' }}>
            <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: C.accentDim, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: C.accent, fontWeight: '800', fontSize: 12 }}>{i + 1}</Text>
            </View>
            <Body style={{ flex: 1 }}>{step}</Body>
          </Row>
        ))}
      </Card>

      <Card style={{ borderColor: C.orange }}>
        <Title>💡 Coach tip</Title>
        <Body>{e.tip}</Body>
      </Card>

      {usedIn.length > 0 && (
        <Card>
          <Title>In programs</Title>
          <Muted>{usedIn.map((p) => p.name).join(' · ')}</Muted>
        </Card>
      )}

      <Card>
        <Title>Your recent sets</Title>
        {!history.length && <Muted>You haven't logged this exercise yet.</Muted>}
        {history.map((h, i) => (
          <Row key={i} style={{ justifyContent: 'space-between' }}>
            <Muted>{h.date}</Muted>
            <Body>{h.sets.map((s) => `${s.reps}${s.weight ? `×${s.weight}kg` : ''}`).join('  ')}</Body>
          </Row>
        ))}
      </Card>
    </Screen>
  );
}
