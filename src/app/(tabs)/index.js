import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Body, Button, C, Card, MacroBar, Muted, ProgressBar, Row, Screen, Stat, Title } from '../../components/ui';
import { getExercise } from '../../data/exercises';
import { nextDay, recommendedProgram } from '../../data/programs';
import { fmt, GOAL_LABEL } from '../../lib/calc';
import { useStore } from '../../lib/store';

function weekStart() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // Monday
  return d;
}

export default function Home() {
  const { profile, plan, measurements, workouts } = useStore();
  const hasProfile = plan.weight && plan.height;

  if (!hasProfile) {
    return (
      <Screen>
        <Card style={{ alignItems: 'center', paddingVertical: 32 }}>
          <Text style={{ fontSize: 48 }}>💪</Text>
          <Title>Welcome to FitTrack</Title>
          <Muted style={{ textAlign: 'center' }}>
            Set your height, weight, body fat and target weight to get personalised calories, workouts and meal plans.
          </Muted>
          <Button title="Set up my profile" onPress={() => router.push('/profile')} style={{ alignSelf: 'stretch' }} />
        </Card>
      </Screen>
    );
  }

  const start = measurements.length ? measurements[0].weight : plan.weight;
  const totalToGo = plan.target != null ? Math.abs(start - plan.target) : 0;
  const done = plan.target != null ? Math.abs(start - plan.weight) : 0;
  const movingRightWay = plan.target != null && (plan.target < start ? plan.weight <= start : plan.weight >= start);
  const progress = totalToGo > 0 && movingRightWay ? done / totalToGo : plan.goal === 'maintain' ? 1 : 0;

  const program = recommendedProgram(plan.goal);
  const day = nextDay(program, workouts.length);
  const ws = weekStart();
  const thisWeek = workouts.filter((w) => new Date(`${w.date}T00:00:00`) >= ws).length;

  return (
    <Screen>
      <View>
        <Text style={{ color: C.muted, fontSize: 14 }}>Hello{profile.name ? `, ${profile.name}` : ''} 👋</Text>
        <Text style={{ color: C.text, fontSize: 26, fontWeight: '800' }}>Goal: {GOAL_LABEL[plan.goal]}</Text>
      </View>

      <Card>
        <Title right={<Muted>{Math.round(progress * 100)}%</Muted>}>Weight goal</Title>
        <ProgressBar value={progress} />
        <Row>
          <Stat label="Start" value={fmt(start)} unit="kg" />
          <Stat label="Now" value={fmt(plan.weight)} unit="kg" color={C.accent} />
          <Stat label="Target" value={fmt(plan.target)} unit="kg" color={C.orange} />
        </Row>
        {plan.weeksToGoal ? (
          <Muted>
            At ~{plan.weeklyRate} kg/week you can reach your target in about {plan.weeksToGoal} weeks.
          </Muted>
        ) : null}
      </Card>

      <Row>
        <Stat label="BMI" value={fmt(plan.bmi)} sub={plan.bmiCategory} />
        <Stat label="Body fat" value={fmt(plan.bodyFat)} unit="%" sub={plan.bodyFatCategory} />
        <Stat label="This week" value={thisWeek} unit="workouts" />
      </Row>

      <Card>
        <Title right={<Muted>{plan.calories ?? '—'} kcal</Muted>}>Daily nutrition</Title>
        {plan.macros ? <MacroBar {...plan.macros} /> : <Muted>Add your age to calculate calories.</Muted>}
        <Muted>💧 Drink about {fmt(plan.waterLiters)} L of water per day.</Muted>
        <Button title="See today's meal plan" kind="secondary" onPress={() => router.push('/diet')} />
      </Card>

      <Card>
        <Title right={<Muted>{program.name}</Muted>}>Next workout: {day.name}</Title>
        {day.items.map(([id, sets, reps]) => (
          <Row key={id} style={{ justifyContent: 'space-between' }}>
            <Body>{getExercise(id)?.name}</Body>
            <Muted>{sets} × {reps}</Muted>
          </Row>
        ))}
        <Button
          title="Start & log this workout"
          onPress={() => router.push({ pathname: '/log-workout', params: { program: program.id, day: day.name } })}
        />
      </Card>
    </Screen>
  );
}
