import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { computePlan, num, today } from './calc';

const KEY = 'fittrack:v1';

const DEFAULT_STATE = {
  profile: {
    name: '',
    sex: 'male',
    age: '',
    height: '',
    weight: '',
    bodyFat: '',
    targetWeight: '',
    activity: 'moderate',
    dietStyle: 'balanced',
  },
  // [{ date: 'YYYY-MM-DD', weight: number, bodyFat: number|null }]
  measurements: [],
  // [{ id, date, title, exercises: [{ exerciseId, sets: [{ reps, weight }] }] }]
  workouts: [],
};

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, setState] = useState(DEFAULT_STATE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (raw) {
          const saved = JSON.parse(raw);
          setState({ ...DEFAULT_STATE, ...saved, profile: { ...DEFAULT_STATE.profile, ...saved.profile } });
        }
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
  }, [state, ready]);

  const upsertMeasurement = useCallback((list, entry) => {
    const rest = list.filter((m) => m.date !== entry.date);
    return [...rest, entry].sort((a, b) => a.date.localeCompare(b.date));
  }, []);

  const saveProfile = useCallback(
    (profile) =>
      setState((s) => {
        const weight = num(profile.weight);
        const bodyFat = num(profile.bodyFat);
        const measurements = weight ? upsertMeasurement(s.measurements, { date: today(), weight, bodyFat }) : s.measurements;
        return { ...s, profile, measurements };
      }),
    [upsertMeasurement]
  );

  const addMeasurement = useCallback(
    (entry) =>
      setState((s) => {
        const measurements = upsertMeasurement(s.measurements, entry);
        const latest = measurements[measurements.length - 1];
        // Keep the profile in sync with the most recent measurement.
        const profile = {
          ...s.profile,
          weight: String(latest.weight),
          bodyFat: latest.bodyFat != null ? String(latest.bodyFat) : s.profile.bodyFat,
        };
        return { ...s, measurements, profile };
      }),
    [upsertMeasurement]
  );

  const deleteMeasurement = useCallback(
    (date) => setState((s) => ({ ...s, measurements: s.measurements.filter((m) => m.date !== date) })),
    []
  );

  const addWorkout = useCallback(
    (w) => setState((s) => ({ ...s, workouts: [{ ...w, id: String(Date.now()) }, ...s.workouts] })),
    []
  );

  const deleteWorkout = useCallback(
    (id) => setState((s) => ({ ...s, workouts: s.workouts.filter((w) => w.id !== id) })),
    []
  );

  const resetAll = useCallback(() => setState(DEFAULT_STATE), []);

  const value = useMemo(
    () => ({
      ...state,
      ready,
      plan: computePlan(state.profile),
      saveProfile,
      addMeasurement,
      deleteMeasurement,
      addWorkout,
      deleteWorkout,
      resetAll,
    }),
    [state, ready, saveProfile, addMeasurement, deleteMeasurement, addWorkout, deleteWorkout, resetAll]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}
