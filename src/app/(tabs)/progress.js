import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Body, Button, C, Card, Chip, Empty, Field, LineChart, Muted, Row, Screen, Stat, Title } from '../../components/ui';
import { getExercise } from '../../data/exercises';
import { fmt, num, prettyDate, today } from '../../lib/calc';
import { confirmAction, notify } from '../../lib/dialog';
import { useStore } from '../../lib/store';

const shortDate = (iso) => iso.slice(5).replace('-', '/');

function confirm(title, onYes) {
  confirmAction(title, 'This cannot be undone.', 'Delete', onYes);
}

export default function Progress() {
  const { measurements, workouts, plan, addMeasurement, deleteMeasurement, deleteWorkout } = useStore();
  const [chart, setChart] = useState('weight');
  const [weight, setWeight] = useState('');
  const [fat, setFat] = useState('');
  const [date, setDate] = useState(today());

  const save = () => {
    const w = num(weight);
    if (!w || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      notify('Check your entry', 'Enter a weight and a date in YYYY-MM-DD format.');
      return;
    }
    addMeasurement({ date, weight: w, bodyFat: num(fat) });
    setWeight('');
    setFat('');
    setDate(today());
  };

  const weightPts = measurements.map((m) => ({ label: shortDate(m.date), value: m.weight }));
  const fatPts = measurements.filter((m) => m.bodyFat != null).map((m) => ({ label: shortDate(m.date), value: m.bodyFat }));
  const first = measurements[0];
  const last = measurements[measurements.length - 1];
  const change = first && last ? last.weight - first.weight : null;

  // Personal records: heaviest set per exercise.
  const prs = {};
  workouts.forEach((w) =>
    w.exercises.forEach((e) =>
      e.sets.forEach((s) => {
        if (s.weight && (!prs[e.exerciseId] || s.weight > prs[e.exerciseId].weight)) prs[e.exerciseId] = { weight: s.weight, reps: s.reps };
      })
    )
  );

  return (
    <Screen>
      <Row>
        <Stat label="Entries" value={measurements.length} />
        <Stat label="Change" value={change == null ? '—' : `${change > 0 ? '+' : ''}${fmt(change)}`} unit="kg" color={change == null ? C.text : change <= 0 ? C.accent : C.orange} />
        <Stat label="Workouts" value={workouts.length} />
      </Row>

      <Card>
        <Title>Chart</Title>
        <Row>
          <Chip label="Weight" active={chart === 'weight'} onPress={() => setChart('weight')} />
          <Chip label="Body fat" active={chart === 'fat'} onPress={() => setChart('fat')} />
        </Row>
        {chart === 'weight' ? (
          <LineChart points={weightPts} target={plan.target ?? undefined} unit="kg" />
        ) : (
          <LineChart points={fatPts} color={C.purple} unit="%" />
        )}
      </Card>

      <Card>
        <Title>Log measurement</Title>
        <Row>
          <Field label="Weight" unit="kg" value={weight} onChangeText={setWeight} placeholder={plan.weight ? String(plan.weight) : '75'} />
          <Field label="Body fat (optional)" unit="%" value={fat} onChangeText={setFat} placeholder="18" />
        </Row>
        <Field label="Date" value={date} onChangeText={setDate} keyboardType="numbers-and-punctuation" placeholder="YYYY-MM-DD" />
        <Button title="Save entry" onPress={save} />
      </Card>

      <Card>
        <Title>History</Title>
        {!measurements.length && <Empty>No measurements yet.</Empty>}
        {[...measurements].reverse().map((m) => (
          <Pressable key={m.date} onLongPress={() => confirm('Delete this entry?', () => deleteMeasurement(m.date))}>
            <Row style={{ justifyContent: 'space-between', paddingVertical: 4 }}>
              <Body>{prettyDate(m.date)}</Body>
              <Muted>
                {fmt(m.weight)} kg{m.bodyFat != null ? ` · ${fmt(m.bodyFat)}%` : ''}
              </Muted>
            </Row>
          </Pressable>
        ))}
        {measurements.length > 0 && <Muted style={{ fontSize: 11 }}>Long-press an entry to delete it.</Muted>}
      </Card>

      {Object.keys(prs).length > 0 && (
        <Card>
          <Title>🏆 Personal records</Title>
          {Object.entries(prs).map(([id, pr]) => (
            <Row key={id} style={{ justifyContent: 'space-between' }}>
              <Body>{getExercise(id)?.name ?? id}</Body>
              <Text style={{ color: C.orange, fontWeight: '700' }}>
                {pr.weight} kg × {pr.reps}
              </Text>
            </Row>
          ))}
        </Card>
      )}

      <Card>
        <Title>Workout log</Title>
        {!workouts.length && <Empty>No workouts logged yet.</Empty>}
        {workouts.map((w) => {
          const sets = w.exercises.reduce((n, e) => n + e.sets.length, 0);
          const volume = w.exercises.reduce((n, e) => n + e.sets.reduce((v, s) => v + (s.weight || 0) * (s.reps || 0), 0), 0);
          return (
            <Pressable key={w.id} onLongPress={() => confirm('Delete this workout?', () => deleteWorkout(w.id))}>
              <View style={{ backgroundColor: C.cardAlt, borderRadius: 12, padding: 12, gap: 4 }}>
                <Row style={{ justifyContent: 'space-between' }}>
                  <Body style={{ fontWeight: '700' }}>{w.title}</Body>
                  <Muted>{prettyDate(w.date)}</Muted>
                </Row>
                <Muted>
                  {w.exercises.length} exercises · {sets} sets{volume ? ` · ${Math.round(volume)} kg volume` : ''}
                </Muted>
                <Muted>{w.exercises.map((e) => getExercise(e.exerciseId)?.name).join(', ')}</Muted>
              </View>
            </Pressable>
          );
        })}
      </Card>
    </Screen>
  );
}
