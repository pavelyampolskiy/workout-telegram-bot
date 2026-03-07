export interface WorkoutSet {
  reps: number;
  weight: number;
}

export interface Exercise {
  id: string;
  name: string;
  sets: WorkoutSet[];
}

export interface Workout {
  id: string;
  name: string;
  templateId: string | null;
  exercises: Exercise[];
  status: "in-progress" | "completed";
  createdAt: number;
  completedAt: number | null;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  icon: "dumbbell" | "heart";
  exercises: string[];
}

export type View =
  | { kind: "home" }
  | { kind: "new-workout" }
  | { kind: "editor"; workoutId: string };
