import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { Body, Button, C, Card, Chip, Field, Muted, Row, Screen, Title } from '../components/ui';
import { EXERCISES, getExercise, MUSCLES } from '../data/exercises';
import { getProgram } from '../data/programs';
import { num, today } from '../lib/calc';
import { useStore } from '../lib/store';

const emptySet = (reps = '') => ({ reps, weight: '' });

function initialExercises(programId, dayName) {
  const day = getProgram(programId)?.days.find((d) => d.name === dayName);
  if (!day) return [];
  return day.items.map(([exerciseId, sets, reps]) => {
    const r = String(parseInt(reps, 10) || '');
    return { exerciseId, sets: Array.from({ length: sets }, () => emptySet(r)) };
  });
}

export default function LogWorkout() {
  const { program, day } = useLocalSearchParams();
  const { addWorkout, workouts } = useStore();
  const [title, setTitle] = useState(day ? `${getProgram(program)?.name ?? ''} – ${day}` : 'Workout');
  const [exercises, setExercises] = useState(() => initialExercises(program, day));
  const [picking, setPicking] = useState(exercises.length === 0);
  const [muscle, setMuscle] = useState('All');

  // Last used weight per exercise, to pre-fill placeholders.
  const lastWeight = useMemo(() => {
    const map = {};
    [...workouts].reverse().forEach((w) =>
      w.exercises.forEach((e) => {
        const top = e.sets.reduce((mx, s) => Math.max(mx, s.weight || 0), 0);
        if (top) map[e.exerciseId] = top;
      })
    );
    return map;
  }, [workouts]);

  const updateSet = (ei, si, key, value) =>
    setExercises((xs) => xs.map((x, i) => (i !== ei ? x : { ...x, sets: x.sets.map((s, j) => (j === si ? { ...s, [key]: value } : s)) })));
  const addSet = (ei) =>
    setExercises((xs) => xs.map((x, i) => (i !== ei ? x : { ...x, sets: [...x.sets, { ...(x.sets[x.sets.length - 1] || emptySet()) }] })));
  const removeSet = (ei, si) =>
    setExercises((xs) => xs.map((x, i) => (i !== ei ? x : { ...x, sets: x.sets.filter((_, j) => j !== si) })).filter((x) => x.sets.length));
  const addExercise = (id) => {
    setExercises((xs) => [...xs, { exerciseId: id, sets: [emptySet('10'), emptySet('10'), emptySet('10')] }]);
    setPicking(false);
  };

  const save = () => {
    const cleaned = exercises
      .map((x) => ({
        exerciseId: x.exerciseId,
        sets: x.sets.map((s) => ({ reps: num(s.reps) || 0, weight: num(s.weight) || 0 })).filter((s) => s.reps > 0),
      }))
      .filter((x) => x.sets.length);
    if (!cleaned.length) {
      Alert.alert('Nothing to save', 'Add at least one exercise with reps.');
      return;
    }
    addWorkout({ date: today(), title: title.trim() || 'Workout', exercises: cleaned });
    router.back();
  };

  const pickList = EXERCISES.filter((e) => muscle === 'All' || e.muscle === muscle);

  return (
    <Screen>
      <Field label="Workout name" value={title} onChangeText={setTitle} keyboardType="default" />

      {exercises.map((x, ei) => (
        <Card key={`${x.exerciseId}-${ei}`}>
          <Title right={lastWeight[x.exerciseId] ? <Muted>Last: {lastWeight[x.exerciseId]} kg</Muted> : null}>
            {getExercise(x.exerciseId)?.name}
          </Title>
          <Row>
            <Muted style={{ width: 36 }}>Set</Muted>
            <Muted style={{ flex: 1 }}>Reps</Muted>
            <Muted style={{ flex: 1 }}>Weight (kg)</Muted>
            <View style={{ width: 28 }} />
          </Row>
          {x.sets.map((s, si) => (
            <Row key={si} style={{ alignItems: 'center' }}>
              <Text style={{ color: C.accent, fontWeight: '800', width: 36 }}>{si + 1}</Text>
              <TextInput
                value={s.reps}
                onChangeText={(v) => updateSet(ei, si, 'reps', v)}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor="#5B6270"
                style={inputStyle}
              />
              <TextInput
                value={s.weight}
                onChangeText={(v) => updateSet(ei, si, 'weight', v)}
                keyboardType="decimal-pad"
                placeholder={lastWeight[x.exerciseId] ? String(lastWeight[x.exerciseId]) : 'BW'}
                placeholderTextColor="#5B6270"
                style={inputStyle}
              />
              <Pressable onPress={() => removeSet(ei, si)} hitSlop={8} style={{ width: 28, alignItems: 'center' }}>
                <Text style={{ color: C.red, fontSize: 18 }}>✕</Text>
              </Pressable>
            </Row>
          ))}
          <Button small kind="secondary" title="+ Add set" onPress={() => addSet(ei)} />
        </Card>
      ))}

      {picking ? (
        <Card>
          <Title right={exercises.length ? <Button small kind="secondary" title="Close" onPress={() => setPicking(false)} /> : null}>
            Add exercise
          </Title>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {MUSCLES.map((m) => (
              <Chip key={m} label={m} active={muscle === m} onPress={() => setMuscle(m)} />
            ))}
          </View>
          {pickList.map((e) => (
            <Pressable key={e.id} onPress={() => addExercise(e.id)} style={{ paddingVertical: 8, borderBottomWidth: 1, borderColor: C.border }}>
              <Body>{e.name}</Body>
              <Muted>{e.muscle} · {e.equipment}</Muted>
            </Pressable>
          ))}
        </Card>
      ) : (
        <Button kind="secondary" title="+ Add exercise" onPress={() => setPicking(true)} />
      )}

      <Button title="✓ Finish & save workout" onPress={save} />
    </Screen>
  );
}

const inputStyle = {
  flex: 1,
  backgroundColor: C.cardAlt,
  color: C.text,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: C.border,
  paddingVertical: 8,
  paddingHorizontal: 10,
  fontSize: 16,
};
