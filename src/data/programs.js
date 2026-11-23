// Workout programs. Each day lists [exerciseId, sets, reps].

export const PROGRAMS = [
  {
    id: 'full-body',
    name: 'Beginner Full Body',
    goal: ['maintain', 'lose', 'gain'],
    level: 'Beginner',
    perWeek: 3,
    description: 'Three full-body sessions a week. The best place to start.',
    days: [
      { name: 'Day A', items: [['goblet-squat', 3, '10'], ['push-up', 3, '8-12'], ['db-row', 3, '10'], ['db-shoulder-press', 2, '10'], ['plank', 3, '30s']] },
      { name: 'Day B', items: [['rdl', 3, '10'], ['incline-db-press', 3, '10'], ['lat-pulldown', 3, '10'], ['lunge', 2, '10/leg'], ['crunch', 3, '15']] },
      { name: 'Day C', items: [['leg-press', 3, '12'], ['bench-press', 3, '8'], ['face-pull', 3, '15'], ['bicep-curl', 2, '12'], ['tricep-pushdown', 2, '12']] },
    ],
  },
  {
    id: 'ppl',
    name: 'Push / Pull / Legs',
    goal: ['gain', 'maintain'],
    level: 'Intermediate',
    perWeek: 6,
    description: 'Classic muscle-building split. Run it once or twice per week.',
    days: [
      { name: 'Push', items: [['bench-press', 4, '6-8'], ['ohp', 3, '8'], ['incline-db-press', 3, '10'], ['lateral-raise', 3, '15'], ['tricep-pushdown', 3, '12']] },
      { name: 'Pull', items: [['deadlift', 3, '5'], ['pull-up', 3, 'max'], ['bent-row', 3, '8'], ['face-pull', 3, '15'], ['bicep-curl', 3, '12']] },
      { name: 'Legs', items: [['squat', 4, '6-8'], ['rdl', 3, '10'], ['leg-press', 3, '12'], ['calf-raise', 4, '15'], ['leg-raise', 3, '12']] },
    ],
  },
  {
    id: 'upper-lower',
    name: 'Upper / Lower',
    goal: ['gain', 'maintain', 'lose'],
    level: 'Intermediate',
    perWeek: 4,
    description: 'Four sessions balancing strength and recovery.',
    days: [
      { name: 'Upper', items: [['bench-press', 4, '6-8'], ['bent-row', 4, '8'], ['db-shoulder-press', 3, '10'], ['lat-pulldown', 3, '10'], ['hammer-curl', 2, '12'], ['skull-crusher', 2, '12']] },
      { name: 'Lower', items: [['squat', 4, '6-8'], ['hip-thrust', 3, '10'], ['rdl', 3, '10'], ['calf-raise', 3, '15'], ['plank', 3, '45s']] },
    ],
  },
  {
    id: 'fat-burn',
    name: 'Fat-Burn Circuit',
    goal: ['lose'],
    level: 'Beginner',
    perWeek: 4,
    description: 'High-intensity circuits — minimal rest, maximum calorie burn.',
    days: [
      { name: 'Circuit 1', items: [['jumping-jack', 3, '45s'], ['goblet-squat', 3, '15'], ['push-up', 3, '10'], ['mountain-climber', 3, '30s'], ['burpee', 3, '10']] },
      { name: 'Circuit 2', items: [['jump-rope', 3, '60s'], ['lunge', 3, '12/leg'], ['db-row', 3, '12'], ['russian-twist', 3, '20'], ['plank', 3, '40s']] },
      { name: 'Cardio', items: [['running', 1, '25-35 min'], ['cycling', 1, '15 min']] },
    ],
  },
  {
    id: 'home',
    name: 'Home – No Equipment',
    goal: ['lose', 'maintain'],
    level: 'Beginner',
    perWeek: 3,
    description: 'Train anywhere using only your bodyweight.',
    days: [
      { name: 'Full Body', items: [['push-up', 4, '10-15'], ['lunge', 3, '12/leg'], ['plank', 3, '45s'], ['burpee', 3, '8'], ['calf-raise', 3, '20']] },
      { name: 'Core & Cardio', items: [['jumping-jack', 3, '60s'], ['mountain-climber', 3, '40s'], ['crunch', 3, '20'], ['russian-twist', 3, '20'], ['running', 1, '20 min']] },
    ],
  },
];

export const getProgram = (id) => PROGRAMS.find((p) => p.id === id);

export function recommendedProgram(goal) {
  if (goal === 'lose') return getProgram('fat-burn');
  if (goal === 'gain') return getProgram('ppl');
  return getProgram('full-body');
}

/** Today's session in a program, rotating through days by how many workouts were logged. */
export function nextDay(program, workoutsLogged) {
  return program.days[workoutsLogged % program.days.length];
}
