// Meal database. Macros are per standard portion (kcal, protein, carbs, fat in grams).
// tags: veg = vegetarian, vegan, med = mediterranean, lowcarb, hp = high protein

export const DIET_STYLES = [
  { key: 'balanced', label: 'Balanced', hint: 'A bit of everything' },
  { key: 'hp', label: 'High protein', hint: 'Best for muscle & fat loss' },
  { key: 'med', label: 'Mediterranean', hint: 'Heart-healthy, olive oil & fish' },
  { key: 'lowcarb', label: 'Low carb', hint: 'Fewer carbs, more fats' },
  { key: 'veg', label: 'Vegetarian', hint: 'No meat or fish' },
  { key: 'vegan', label: 'Vegan', hint: '100% plant-based' },
];

const m = (name, type, kcal, p, c, f, tags, items) => ({ name, type, kcal, p, c, f, tags, items });

export const MEALS = [
  // Breakfast
  m('Greek Yogurt Power Bowl', 'breakfast', 420, 32, 45, 12, ['veg', 'hp', 'med'], ['250g Greek yogurt (2%)', '40g oats', '1 handful berries', '1 tbsp honey', '10g walnuts']),
  m('Veggie Omelette & Toast', 'breakfast', 450, 30, 30, 22, ['veg', 'hp'], ['3 eggs', 'Spinach, peppers, onion', '30g feta', '1 slice wholegrain toast']),
  m('Overnight Oats', 'breakfast', 430, 20, 62, 11, ['veg', 'balanced'], ['60g oats', '200ml milk', '1 scoop chia seeds', '1 banana', 'Cinnamon']),
  m('Avocado Egg Toast', 'breakfast', 440, 20, 34, 25, ['veg', 'med'], ['2 slices sourdough', '½ avocado', '2 poached eggs', 'Cherry tomatoes']),
  m('Protein Pancakes', 'breakfast', 460, 35, 50, 12, ['veg', 'hp'], ['1 scoop protein powder', '1 banana', '2 eggs', '40g oats', 'Berries on top']),
  m('Tofu Scramble', 'breakfast', 400, 26, 28, 20, ['vegan', 'veg', 'hp'], ['200g firm tofu', 'Turmeric, peppers, spinach', '1 slice rye bread', '½ avocado']),
  m('Eggs, Bacon & Avocado', 'breakfast', 480, 30, 8, 36, ['lowcarb', 'hp'], ['3 eggs', '2 slices bacon', '½ avocado', 'Sautéed mushrooms']),
  m('Peanut Butter Smoothie', 'breakfast', 450, 24, 55, 16, ['vegan', 'veg', 'balanced'], ['1 banana', '1 tbsp peanut butter', '250ml soy milk', '30g oats', '1 tbsp flaxseed']),
  m('Shakshuka', 'breakfast', 410, 22, 30, 22, ['veg', 'med'], ['3 eggs', 'Tomato & pepper sauce', 'Cumin, paprika', '1 small pita']),

  // Lunch
  m('Chicken Quinoa Bowl', 'lunch', 580, 45, 55, 18, ['hp', 'balanced'], ['150g grilled chicken', '80g quinoa (dry)', 'Mixed greens', 'Cucumber, tomato', 'Lemon-tahini dressing']),
  m('Tuna Mediterranean Salad', 'lunch', 520, 40, 30, 26, ['med', 'hp', 'lowcarb'], ['1 can tuna', 'Chickpeas (½ cup)', 'Olives, cucumber, red onion', 'Olive oil & lemon']),
  m('Turkey Wholegrain Wrap', 'lunch', 540, 38, 52, 18, ['balanced', 'hp'], ['1 wholegrain tortilla', '120g turkey breast', 'Hummus', 'Lettuce, tomato, carrot']),
  m('Lentil & Veggie Soup', 'lunch', 480, 26, 70, 10, ['vegan', 'veg', 'med'], ['100g red lentils', 'Carrot, celery, onion', 'Cumin & garlic', '1 slice rye bread']),
  m('Falafel Buddha Bowl', 'lunch', 600, 22, 70, 26, ['vegan', 'veg', 'med'], ['5 baked falafel', 'Brown rice', 'Tabbouleh', 'Hummus & tahini']),
  m('Steak & Big Salad', 'lunch', 560, 45, 12, 36, ['lowcarb', 'hp'], ['170g lean steak', 'Rocket & spinach', 'Avocado', 'Parmesan shavings', 'Olive oil']),
  m('Chicken Caesar (light)', 'lunch', 500, 42, 20, 26, ['lowcarb', 'hp'], ['150g chicken breast', 'Romaine', 'Light Caesar dressing', 'Parmesan', 'Few croutons']),
  m('Halloumi & Grain Salad', 'lunch', 560, 26, 48, 28, ['veg', 'med'], ['80g grilled halloumi', 'Bulgur wheat', 'Roasted veg', 'Pomegranate & mint']),

  // Dinner
  m('Salmon, Rice & Broccoli', 'dinner', 620, 42, 55, 24, ['med', 'hp', 'balanced'], ['160g salmon fillet', '70g rice (dry)', '200g broccoli', 'Lemon & dill']),
  m('Lean Beef Stir-fry', 'dinner', 600, 44, 55, 20, ['hp', 'balanced'], ['150g lean beef strips', 'Mixed stir-fry veg', 'Soy sauce, ginger, garlic', '70g noodles (dry)']),
  m('Chicken, Sweet Potato & Greens', 'dinner', 580, 45, 55, 16, ['hp', 'balanced'], ['160g chicken thigh (skinless)', '250g sweet potato', 'Green beans', 'Olive oil']),
  m('Chickpea & Spinach Curry', 'dinner', 580, 22, 78, 18, ['vegan', 'veg'], ['1 can chickpeas', 'Spinach, tomato, onion', 'Light coconut milk', '60g basmati rice (dry)']),
  m('Baked Cod & Roasted Veg', 'dinner', 480, 40, 30, 20, ['med', 'hp', 'lowcarb'], ['200g cod', 'Zucchini, peppers, aubergine', 'Olive oil & herbs', 'Small potato']),
  m('Zucchini Noodle Bolognese', 'dinner', 520, 40, 18, 30, ['lowcarb', 'hp'], ['150g lean minced beef', 'Spiralized zucchini', 'Tomato sauce', 'Parmesan']),
  m('Tofu Teriyaki Bowl', 'dinner', 560, 28, 65, 18, ['vegan', 'veg', 'balanced'], ['200g tofu', 'Teriyaki sauce', 'Brown rice', 'Edamame & bok choy']),
  m('Veggie Lasagne', 'dinner', 590, 30, 60, 24, ['veg', 'balanced'], ['Wholewheat lasagne sheets', 'Ricotta & spinach', 'Tomato sauce', 'Mozzarella']),
  m('Grilled Chicken Souvlaki', 'dinner', 570, 46, 45, 20, ['med', 'hp'], ['160g chicken skewers', 'Tzatziki', 'Greek salad', '1 small pita']),

  // Snacks
  m('Cottage Cheese & Fruit', 'snack', 200, 22, 18, 4, ['veg', 'hp', 'balanced'], ['200g cottage cheese', '1 peach or pineapple slices']),
  m('Apple & Peanut Butter', 'snack', 220, 6, 26, 11, ['vegan', 'veg', 'balanced'], ['1 apple', '1 tbsp peanut butter']),
  m('Protein Shake', 'snack', 180, 28, 8, 3, ['hp', 'veg', 'lowcarb'], ['1 scoop whey', '250ml water or skim milk']),
  m('Hummus & Veggie Sticks', 'snack', 200, 7, 20, 10, ['vegan', 'veg', 'med'], ['60g hummus', 'Carrot, cucumber, pepper sticks']),
  m('Mixed Nuts', 'snack', 190, 6, 6, 16, ['vegan', 'veg', 'lowcarb', 'med'], ['30g almonds/walnuts/cashews']),
  m('Boiled Eggs', 'snack', 160, 13, 1, 11, ['veg', 'lowcarb', 'hp'], ['2 hard-boiled eggs', 'Pinch of salt & pepper']),
  m('Edamame', 'snack', 190, 17, 14, 8, ['vegan', 'veg', 'hp'], ['150g steamed edamame', 'Sea salt']),
  m('Rice Cakes & Turkey', 'snack', 180, 16, 22, 3, ['hp', 'balanced'], ['2 rice cakes', '60g turkey slices', 'Mustard']),
];

const SPLIT = { breakfast: 0.25, lunch: 0.35, dinner: 0.3, snack: 0.1 };
export const MEAL_ORDER = ['breakfast', 'lunch', 'snack', 'dinner'];
export const MEAL_LABEL = { breakfast: 'Breakfast', lunch: 'Lunch', snack: 'Snack', dinner: 'Dinner' };

function matches(meal, style) {
  if (style === 'balanced') return true;
  if (style === 'veg') return meal.tags.includes('veg') || meal.tags.includes('vegan');
  return meal.tags.includes(style);
}

// Small deterministic RNG so a given day + seed always produces the same plan.
function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Builds a one-day meal plan scaled to the calorie target. */
export function buildMealPlan(calories, style, seed) {
  const rand = rng(seed);
  return MEAL_ORDER.map((type) => {
    let pool = MEALS.filter((x) => x.type === type && matches(x, style));
    if (!pool.length) pool = MEALS.filter((x) => x.type === type);
    const meal = pool[Math.floor(rand() * pool.length)];
    const targetKcal = calories * SPLIT[type];
    const portion = Math.min(2, Math.max(0.6, Math.round((targetKcal / meal.kcal) * 4) / 4));
    return {
      type,
      meal,
      portion,
      kcal: Math.round(meal.kcal * portion),
      p: Math.round(meal.p * portion),
      c: Math.round(meal.c * portion),
      f: Math.round(meal.f * portion),
    };
  });
}

export const DIET_TIPS = {
  lose: [
    'Aim for a 500 kcal daily deficit — about 0.5 kg of fat loss per week.',
    'Fill half your plate with vegetables to stay full on fewer calories.',
    'Keep protein high to protect muscle while you lose fat.',
    'Limit liquid calories: soda, juice and alcohol add up fast.',
    'Sleep 7–9 hours; poor sleep increases hunger hormones.',
  ],
  gain: [
    'Eat in a small surplus (~300 kcal) to build muscle with minimal fat.',
    'Spread protein across 4–5 meals of 25–40 g each.',
    'Eat carbs around your workouts to fuel training.',
    'Calorie-dense foods (nuts, olive oil, oats) make surplus easier.',
    'Track your weight weekly — aim for +0.25 kg per week.',
  ],
  maintain: [
    'Eat at maintenance and focus on food quality.',
    'Get protein in every meal to keep muscle and recover well.',
    'Prioritize whole foods: vegetables, fruit, whole grains, lean protein.',
    'Use the 80/20 rule — healthy most of the time, flexible sometimes.',
    'Stay hydrated; thirst is often mistaken for hunger.',
  ],
};
