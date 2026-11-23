# FitTrack 💪

A mobile workout and nutrition tracker built with **Expo (React Native)** and **Expo Router**.

## Features

- **Profile:** height, weight, age, sex, body fat %, target weight and activity level.
  - Works out BMI, lean mass and body-fat category.
  - Calculates BMR with Katch-McArdle when you enter body fat %, otherwise Mifflin-St Jeor.
  - Gives your maintenance calories (TDEE), a daily calorie target, macros, water intake and an estimated number of weeks to reach your target.
- **Home dashboard:** progress toward your target weight, key stats, today's nutrition and your next workout.
- **Workouts:**
  - 5 programs (Beginner Full Body, Push/Pull/Legs, Upper/Lower, Fat-Burn Circuit, Home – No Equipment). The app recommends one based on your goal.
  - A library of 35 exercises you can search or filter by muscle group. Each has step-by-step instructions and a coach tip.
- **Workout logger:** log sets, reps and weight. Program days are filled in for you, and the app shows the weight you used last time.
- **Progress:**
  - Weight and body-fat charts with a target line, plus your measurement history.
  - Personal records and a workout log with total volume.
- **Diet:**
  - Daily meal plans (breakfast, lunch, snack, dinner) scaled to your calorie target.
  - 6 diet styles: Balanced, High protein, Mediterranean, Low carb, Vegetarian and Vegan.
  - Shuffle to get a new plan, plus tips for your goal.

All data is stored on the device with AsyncStorage.

## Install on Android (built by GitHub)

Every push to `main` starts the **Build Android APK** workflow (`.github/workflows/android-apk.yml`). It takes about 10–20 minutes.

1. On your phone, open the repo's **Releases** page. You need to be logged in to GitHub because the repo is private.
2. Download **FitTrack.apk** from the latest release and open it.
3. If Android asks, allow "Install unknown apps" for your browser.

To rebuild without pushing, go to **Actions → Build Android APK → Run workflow**.

## Run it locally (development)

```bash
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app on your phone (Android or iOS), or press `a` to open an Android emulator.

## Project structure

```
src/
  app/            # screens (Expo Router)
    (tabs)/       # Home, Workouts, Progress, Diet, Profile
    exercise/[id].js
    log-workout.js
  components/ui.js  # shared UI + SVG line chart
  data/           # exercises, programs, meals
  lib/            # calculations + persistent store
```

> Nutrition suggestions are general guidance, not medical advice.
