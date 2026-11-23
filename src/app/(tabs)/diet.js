import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Body, Button, C, Card, Chips, MacroBar, Muted, Row, Screen, Stat, Title } from '../../components/ui';
import { buildMealPlan, DIET_STYLES, DIET_TIPS, MEAL_LABEL } from '../../data/meals';
import { fmt, GOAL_LABEL } from '../../lib/calc';
import { useStore } from '../../lib/store';

const MEAL_ICON = { breakfast: '🍳', lunch: '🥙', snack: '🍎', dinner: '🍽️' };

export default function Diet() {
  const { profile, plan, saveProfile } = useStore();
  const daySeed = Number(new Date().toISOString().slice(0, 10).replace(/-/g, ''));
  const [shuffle, setShuffle] = useState(0);

  if (!plan.calories) {
    return (
      <Screen>
        <Card style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 40 }}>🥗</Text>
          <Title>Personalised diet plans</Title>
          <Muted style={{ textAlign: 'center' }}>Fill in your height, weight and age in your profile to get a calorie target and daily meal plans.</Muted>
          <Button title="Go to profile" onPress={() => router.push('/profile')} style={{ alignSelf: 'stretch' }} />
        </Card>
      </Screen>
    );
  }

  const style = profile.dietStyle || 'balanced';
  const meals = buildMealPlan(plan.calories, style, daySeed + shuffle * 7919);
  const total = meals.reduce((t, m) => ({ kcal: t.kcal + m.kcal, p: t.p + m.p, c: t.c + m.c, f: t.f + m.f }), { kcal: 0, p: 0, c: 0, f: 0 });

  return (
    <Screen>
      <Card>
        <Title right={<Muted>{GOAL_LABEL[plan.goal]}</Muted>}>Your daily targets</Title>
        <Row>
          <Stat label="Calories" value={plan.calories} unit="kcal" color={C.accent} />
          <Stat label="Maintenance" value={Math.round(plan.tdee)} unit="kcal" />
        </Row>
        <MacroBar {...plan.macros} />
        <Muted>
          BMR {Math.round(plan.bmr)} kcal × {plan.activity.factor} activity = {Math.round(plan.tdee)} kcal maintenance.
          {plan.goal === 'lose' ? ' −500 kcal for fat loss.' : plan.goal === 'gain' ? ' +300 kcal for lean gain.' : ''}
          {plan.bodyFat != null ? ' (Katch-McArdle, uses your body fat %.)' : ' (Mifflin-St Jeor.)'}
        </Muted>
      </Card>

      <Card>
        <Title>Diet style</Title>
        <Chips options={DIET_STYLES} value={style} onChange={(k) => saveProfile({ ...profile, dietStyle: k })} />
        <Muted>{DIET_STYLES.find((d) => d.key === style)?.hint}</Muted>
      </Card>

      <Title right={<Button small kind="secondary" title="🔀 New plan" onPress={() => setShuffle((n) => n + 1)} />}>Today's meal plan</Title>

      {meals.map(({ type, meal, portion, kcal, p, c, f }) => (
        <Card key={type}>
          <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: C.muted, fontWeight: '700', textTransform: 'uppercase', fontSize: 12 }}>
              {MEAL_ICON[type]}  {MEAL_LABEL[type]}
            </Text>
            <Text style={{ color: C.accent, fontWeight: '800' }}>{kcal} kcal</Text>
          </Row>
          <Body style={{ fontSize: 17, fontWeight: '700' }}>{meal.name}</Body>
          <View style={{ gap: 2 }}>
            {meal.items.map((i) => (
              <Muted key={i}>• {i}</Muted>
            ))}
          </View>
          <Muted>
            {portion !== 1 ? `Portion ×${portion}  ·  ` : ''}P {p}g · C {c}g · F {f}g
          </Muted>
        </Card>
      ))}

      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <Body>Plan total</Body>
          <Body style={{ fontWeight: '800' }}>{total.kcal} / {plan.calories} kcal</Body>
        </Row>
        <Muted>Protein {total.p}g (target {plan.macros.protein}g) · Carbs {total.c}g · Fat {total.f}g</Muted>
        <Muted>💧 Water: {fmt(plan.waterLiters)} L / day</Muted>
      </Card>

      <Card>
        <Title>Tips for your goal</Title>
        {DIET_TIPS[plan.goal].map((t) => (
          <Body key={t}>✅ {t}</Body>
        ))}
        <Muted style={{ fontSize: 11 }}>General guidance only — not medical advice. Talk to a doctor or dietitian if you have health conditions.</Muted>
      </Card>
    </Screen>
  );
}
