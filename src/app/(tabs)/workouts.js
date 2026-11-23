import { Link, router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Body, Button, C, Card, Chip, Muted, Row, Screen, Title } from '../../components/ui';
import { EXERCISES, getExercise, MUSCLE_ICON, MUSCLES } from '../../data/exercises';
import { PROGRAMS, recommendedProgram } from '../../data/programs';
import { useStore } from '../../lib/store';

export default function Workouts() {
  const { plan } = useStore();
  const [tab, setTab] = useState('programs');
  const [muscle, setMuscle] = useState('All');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(recommendedProgram(plan.goal).id);
  const recommended = recommendedProgram(plan.goal).id;

  const list = useMemo(
    () =>
      EXERCISES.filter(
        (e) => (muscle === 'All' || e.muscle === muscle) && e.name.toLowerCase().includes(query.trim().toLowerCase())
      ),
    [muscle, query]
  );

  return (
    <Screen>
      <Row>
        <Chip label="Programs" active={tab === 'programs'} onPress={() => setTab('programs')} />
        <Chip label="Exercise library" active={tab === 'library'} onPress={() => setTab('library')} />
      </Row>

      <Button title="+ Log a custom workout" kind="secondary" onPress={() => router.push('/log-workout')} />

      {tab === 'programs' &&
        PROGRAMS.map((p) => (
          <Card key={p.id}>
            <Pressable onPress={() => setOpen(open === p.id ? null : p.id)} style={{ gap: 4 }}>
              <Title right={<Text style={{ color: C.muted }}>{open === p.id ? '▲' : '▼'}</Text>}>{p.name}</Title>
              <Muted>
                {p.level} · {p.perWeek}× / week
                {p.id === recommended ? '  ·  ⭐ Recommended for your goal' : ''}
              </Muted>
              <Body style={{ color: C.muted }}>{p.description}</Body>
            </Pressable>
            {open === p.id &&
              p.days.map((d) => (
                <View key={d.name} style={{ backgroundColor: C.cardAlt, borderRadius: 12, padding: 12, gap: 8 }}>
                  <Text style={{ color: C.accent, fontWeight: '700' }}>{d.name}</Text>
                  {d.items.map(([id, sets, reps]) => (
                    <Link key={id} href={`/exercise/${id}`} asChild>
                      <Pressable>
                        <Row style={{ justifyContent: 'space-between' }}>
                          <Body>{getExercise(id)?.name} ›</Body>
                          <Muted>{sets} × {reps}</Muted>
                        </Row>
                      </Pressable>
                    </Link>
                  ))}
                  <Button
                    small
                    title={`Start ${d.name}`}
                    onPress={() => router.push({ pathname: '/log-workout', params: { program: p.id, day: d.name } })}
                  />
                </View>
              ))}
          </Card>
        ))}

      {tab === 'library' && (
        <>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search exercises…"
            placeholderTextColor="#5B6270"
            style={{ backgroundColor: C.card, color: C.text, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: C.border, fontSize: 15 }}
          />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {MUSCLES.map((m) => (
              <Chip key={m} label={m} active={muscle === m} onPress={() => setMuscle(m)} />
            ))}
          </View>
          {list.map((e) => (
            <Link key={e.id} href={`/exercise/${e.id}`} asChild>
              <Pressable>
                <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <Text style={{ fontSize: 28 }}>{MUSCLE_ICON[e.muscle]}</Text>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Body style={{ fontWeight: '700' }}>{e.name}</Body>
                    <Muted>{e.muscle} · {e.equipment} · {e.level}</Muted>
                  </View>
                  <Text style={{ color: C.muted, fontSize: 18 }}>›</Text>
                </Card>
              </Pressable>
            </Link>
          ))}
          {!list.length && <Muted style={{ textAlign: 'center' }}>No exercises found.</Muted>}
        </>
      )}
    </Screen>
  );
}
