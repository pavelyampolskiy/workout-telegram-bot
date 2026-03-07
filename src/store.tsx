import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { Workout, WorkoutTemplate, Exercise, View } from "./types";

const STORAGE_KEY = "workout-journal";

export const DEFAULT_TEMPLATES: WorkoutTemplate[] = [
  {
    id: "day-a",
    name: "Day A",
    icon: "dumbbell",
    exercises: ["Bench Press", "Incline Dumbbell Press", "Cable Fly", "Tricep Pushdown"],
  },
  {
    id: "day-b",
    name: "Day B",
    icon: "dumbbell",
    exercises: ["Squat", "Romanian Deadlift", "Leg Press", "Calf Raise"],
  },
  {
    id: "day-c",
    name: "Day C",
    icon: "dumbbell",
    exercises: ["Pull Up", "Barbell Row", "Face Pull", "Bicep Curl"],
  },
  {
    id: "day-d",
    name: "Day D",
    icon: "dumbbell",
    exercises: ["Overhead Press", "Lateral Raise", "Rear Delt Fly", "Shrug"],
  },
];

interface State {
  workouts: Workout[];
  templates: WorkoutTemplate[];
  view: View;
}

type Action =
  | { type: "NAVIGATE"; view: View }
  | { type: "START_WORKOUT"; workout: Workout }
  | { type: "UPDATE_WORKOUT"; workout: Workout }
  | { type: "ADD_EXERCISE"; workoutId: string; exercise: Exercise }
  | { type: "REMOVE_EXERCISE"; workoutId: string; exerciseId: string }
  | { type: "COMPLETE_WORKOUT"; workoutId: string }
  | { type: "CANCEL_WORKOUT"; workoutId: string }
  | { type: "ADD_TEMPLATE"; template: WorkoutTemplate }
  | { type: "REMOVE_TEMPLATE"; templateId: string }
  | { type: "RENAME_TEMPLATE"; templateId: string; name: string };

const CUSTOM_NAME_RE = /^CUSTOM_\d+$/i;

function migrateWorkoutName(
  w: Workout,
  templates: WorkoutTemplate[]
): Workout {
  if (!CUSTOM_NAME_RE.test(w.name)) return w;

  if (w.templateId) {
    const tpl = templates.find((t) => t.id === w.templateId);
    if (tpl) return { ...w, name: tpl.name };
  }

  const num = w.name.replace(/\D/g, "");
  return { ...w, name: num ? `Custom Workout ${num}` : "Custom Workout" };
}

function loadState(): Pick<State, "workouts" | "templates"> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const templates: WorkoutTemplate[] = parsed.templates ?? DEFAULT_TEMPLATES;
      const workouts: Workout[] = (parsed.workouts ?? []).map(
        (w: Workout) => migrateWorkoutName(w, templates)
      );
      return { workouts, templates };
    }
  } catch {
    /* ignore corrupt data */
  }
  return { workouts: [], templates: DEFAULT_TEMPLATES };
}

function persist(state: Pick<State, "workouts" | "templates">) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ workouts: state.workouts, templates: state.templates })
  );
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "NAVIGATE":
      return { ...state, view: action.view };

    case "START_WORKOUT":
      return { ...state, workouts: [...state.workouts, action.workout] };

    case "UPDATE_WORKOUT":
      return {
        ...state,
        workouts: state.workouts.map((w) =>
          w.id === action.workout.id ? action.workout : w
        ),
      };

    case "ADD_EXERCISE":
      return {
        ...state,
        workouts: state.workouts.map((w) =>
          w.id === action.workoutId
            ? { ...w, exercises: [...w.exercises, action.exercise] }
            : w
        ),
      };

    case "REMOVE_EXERCISE":
      return {
        ...state,
        workouts: state.workouts.map((w) =>
          w.id === action.workoutId
            ? { ...w, exercises: w.exercises.filter((e) => e.id !== action.exerciseId) }
            : w
        ),
      };

    case "COMPLETE_WORKOUT":
      return {
        ...state,
        workouts: state.workouts.map((w) =>
          w.id === action.workoutId
            ? { ...w, status: "completed" as const, completedAt: Date.now() }
            : w
        ),
      };

    case "CANCEL_WORKOUT":
      return {
        ...state,
        workouts: state.workouts.filter((w) => w.id !== action.workoutId),
      };

    case "ADD_TEMPLATE":
      return { ...state, templates: [...state.templates, action.template] };

    case "REMOVE_TEMPLATE":
      return {
        ...state,
        templates: state.templates.filter((t) => t.id !== action.templateId),
      };

    case "RENAME_TEMPLATE":
      return {
        ...state,
        templates: state.templates.map((t) =>
          t.id === action.templateId ? { ...t, name: action.name } : t
        ),
      };

    default:
      return state;
  }
}

const StoreContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const saved = loadState();
  const [state, dispatch] = useReducer(reducer, {
    ...saved,
    view: { kind: "home" } as View,
  });

  useEffect(() => {
    persist({ workouts: state.workouts, templates: state.templates });
  }, [state.workouts, state.templates]);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be inside StoreProvider");
  return ctx;
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}
