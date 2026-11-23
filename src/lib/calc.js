// Body metrics & nutrition calculations (metric units: cm, kg).

export const ACTIVITY_LEVELS = [
  { key: 'sedentary', label: 'Sedentary', hint: 'Desk job, little exercise', factor: 1.2 },
  { key: 'light', label: 'Light', hint: '1–3 workouts / week', factor: 1.375 },
  { key: 'moderate', label: 'Moderate', hint: '3–5 workouts / week', factor: 1.55 },
  { key: 'active', label: 'Very active', hint: '6–7 workouts / week', factor: 1.725 },
  { key: 'athlete', label: 'Athlete', hint: 'Hard training twice a day', factor: 1.9 },
];

export const num = (v) => {
  const n = parseFloat(String(v ?? '').replace(',', '.'));
  return Number.isFinite(n) ? n : null;
};

export function bmi(weight, heightCm) {
  if (!weight || !heightCm) return null;
  const m = heightCm / 100;
  return weight / (m * m);
}

export function bmiCategory(value) {
  if (value == null) return '—';
  if (value < 18.5) return 'Underweight';
  if (value < 25) return 'Healthy';
  if (value < 30) return 'Overweight';
  return 'Obese';
}

// American Council on Exercise body-fat categories.
export function bodyFatCategory(fat, sex) {
  if (fat == null) return '—';
  const t = sex === 'female' ? [14, 21, 25, 32] : [6, 14, 18, 25];
  if (fat < t[0]) return 'Essential';
  if (fat < t[1]) return 'Athletic';
  if (fat < t[2]) return 'Fit';
  if (fat < t[3]) return 'Average';
  return 'High';
}

export function leanMass(weight, fat) {
  if (!weight || fat == null) return null;
  return weight * (1 - fat / 100);
}

// Katch-McArdle when body fat is known (more accurate), otherwise Mifflin-St Jeor.
export function bmr({ weight, height, age, sex, bodyFat }) {
  if (!weight) return null;
  const lbm = leanMass(weight, bodyFat);
  if (lbm) return 370 + 21.6 * lbm;
  if (!height || !age) return null;
  return 10 * weight + 6.25 * height - 5 * age + (sex === 'female' ? -161 : 5);
}

export function goalOf(weight, target) {
  if (!weight || !target) return 'maintain';
  if (target < weight - 0.5) return 'lose';
  if (target > weight + 0.5) return 'gain';
  return 'maintain';
}

export const GOAL_LABEL = { lose: 'Lose fat', gain: 'Build muscle', maintain: 'Maintain & tone' };

/** Everything the app needs derived from the raw profile. */
export function computePlan(profile) {
  const weight = num(profile.weight);
  const height = num(profile.height);
  const age = num(profile.age);
  const bodyFat = num(profile.bodyFat);
  const target = num(profile.targetWeight);
  const sex = profile.sex || 'male';
  const activity = ACTIVITY_LEVELS.find((a) => a.key === profile.activity) || ACTIVITY_LEVELS[2];

  const base = bmr({ weight, height, age, sex, bodyFat });
  const tdee = base ? base * activity.factor : null;
  const goal = goalOf(weight, target);

  let calories = null;
  if (tdee) {
    const floor = sex === 'female' ? 1200 : 1500;
    if (goal === 'lose') calories = Math.max(floor, tdee - 500);
    else if (goal === 'gain') calories = tdee + 300;
    else calories = tdee;
    calories = Math.round(calories / 10) * 10;
  }

  // Macros: protein by lean mass when known, fat 25% of calories, carbs fill the rest.
  let macros = null;
  if (calories && weight) {
    const lbm = leanMass(weight, bodyFat);
    const proteinG = Math.round(lbm ? lbm * (goal === 'maintain' ? 2.0 : 2.3) : weight * (goal === 'maintain' ? 1.6 : 1.9));
    const fatG = Math.round((calories * 0.25) / 9);
    const carbsG = Math.max(0, Math.round((calories - proteinG * 4 - fatG * 9) / 4));
    macros = { protein: proteinG, fat: fatG, carbs: carbsG };
  }

  const weeklyRate = goal === 'lose' ? 0.5 : goal === 'gain' ? 0.25 : 0;
  const weeksToGoal = weight && target && weeklyRate ? Math.ceil(Math.abs(weight - target) / weeklyRate) : null;

  const b = bmi(weight, height);
  return {
    weight, height, age, bodyFat, target, sex, activity, goal,
    bmi: b,
    bmiCategory: bmiCategory(b),
    bodyFatCategory: bodyFatCategory(bodyFat, sex),
    leanMass: leanMass(weight, bodyFat),
    bmr: base, tdee, calories, macros, weeklyRate, weeksToGoal,
    waterLiters: weight ? Math.round(weight * 0.035 * 10) / 10 : null,
  };
}

export const fmt = (v, digits = 1) => (v == null || !Number.isFinite(v) ? '—' : Number(v).toFixed(digits).replace(/\.0+$/, ''));

export const today = () => {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

export function prettyDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
