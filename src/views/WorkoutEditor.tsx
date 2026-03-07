import React, { useState } from "react";
import { useStore, uid } from "../store";
import type { Exercise, WorkoutSet } from "../types";

const SetRow: React.FC<{
  index: number;
  set: WorkoutSet;
  onChange: (s: WorkoutSet) => void;
  onRemove: () => void;
}> = ({ index, set, onChange, onRemove }) => (
  <div className="set-row">
    <span className="set-number">{index + 1}</span>
    <input
      className="set-input"
      type="number"
      inputMode="numeric"
      placeholder="0"
      value={set.weight || ""}
      onChange={(e) => onChange({ ...set, weight: Number(e.target.value) || 0 })}
    />
    <span className="set-unit">kg</span>
    <span className="set-x">×</span>
    <input
      className="set-input"
      type="number"
      inputMode="numeric"
      placeholder="0"
      value={set.reps || ""}
      onChange={(e) => onChange({ ...set, reps: Number(e.target.value) || 0 })}
    />
    <span className="set-unit">reps</span>
    <button className="set-remove" onClick={onRemove}>✕</button>
  </div>
);

const ExerciseCard: React.FC<{
  exercise: Exercise;
  onUpdate: (e: Exercise) => void;
  onRemove: () => void;
}> = ({ exercise, onUpdate, onRemove }) => {
  const updateSet = (idx: number, set: WorkoutSet) => {
    const sets = [...exercise.sets];
    sets[idx] = set;
    onUpdate({ ...exercise, sets });
  };

  const removeSet = (idx: number) => {
    onUpdate({ ...exercise, sets: exercise.sets.filter((_, i) => i !== idx) });
  };

  const addSet = () => {
    const lastSet = exercise.sets[exercise.sets.length - 1];
    onUpdate({
      ...exercise,
      sets: [...exercise.sets, lastSet ? { ...lastSet } : { reps: 0, weight: 0 }],
    });
  };

  return (
    <div className="exercise-card glass">
      <div className="exercise-header">
        <span className="exercise-name">{exercise.name}</span>
        <button className="exercise-remove" onClick={onRemove}>✕</button>
      </div>
      <div className="sets-header">
        <span className="set-number-label">SET</span>
        <span className="set-field-label">WEIGHT</span>
        <span className="set-spacer" />
        <span className="set-field-label">REPS</span>
      </div>
      {exercise.sets.map((set, i) => (
        <SetRow
          key={i}
          index={i}
          set={set}
          onChange={(s) => updateSet(i, s)}
          onRemove={() => removeSet(i)}
        />
      ))}
      <button className="add-set-btn" onClick={addSet}>+ Add Set</button>
    </div>
  );
};

export const WorkoutEditor: React.FC<{ workoutId: string }> = ({ workoutId }) => {
  const { state, dispatch } = useStore();
  const workout = state.workouts.find((w) => w.id === workoutId);
  const [exerciseName, setExerciseName] = useState("");
  const [editingName, setEditingName] = useState(false);

  if (!workout) {
    dispatch({ type: "NAVIGATE", view: { kind: "home" } });
    return null;
  }

  const addExercise = () => {
    const name = exerciseName.trim();
    if (!name) return;
    dispatch({
      type: "ADD_EXERCISE",
      workoutId,
      exercise: { id: uid(), name, sets: [{ reps: 0, weight: 0 }] },
    });
    setExerciseName("");
  };

  const updateExercise = (updated: Exercise) => {
    dispatch({
      type: "UPDATE_WORKOUT",
      workout: {
        ...workout,
        exercises: workout.exercises.map((e) => (e.id === updated.id ? updated : e)),
      },
    });
  };

  const removeExercise = (exerciseId: string) => {
    dispatch({ type: "REMOVE_EXERCISE", workoutId, exerciseId });
  };

  const save = () => {
    dispatch({ type: "COMPLETE_WORKOUT", workoutId });
    dispatch({ type: "NAVIGATE", view: { kind: "home" } });
  };

  const cancel = () => {
    dispatch({ type: "CANCEL_WORKOUT", workoutId });
    dispatch({ type: "NAVIGATE", view: { kind: "home" } });
  };

  const handleRename = (newName: string) => {
    dispatch({ type: "UPDATE_WORKOUT", workout: { ...workout, name: newName } });
  };

  return (
    <div className="view-editor">
      <div className="view-header">
        {editingName ? (
          <input
            className="workout-name-input"
            value={workout.name}
            autoFocus
            onChange={(e) => handleRename(e.target.value)}
            onBlur={() => setEditingName(false)}
            onKeyDown={(e) => e.key === "Enter" && setEditingName(false)}
          />
        ) : (
          <h2 className="view-title clickable" onClick={() => setEditingName(true)}>
            {workout.name}
          </h2>
        )}
        <button className="view-action-btn" onClick={cancel}>CANCEL</button>
      </div>

      <div className="add-exercise-row glass">
        <span className="add-exercise-icon">+</span>
        <input
          className="add-exercise-input"
          placeholder="Add exercise"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addExercise()}
        />
      </div>

      <div className="exercise-list">
        {workout.exercises.map((ex) => (
          <ExerciseCard
            key={ex.id}
            exercise={ex}
            onUpdate={updateExercise}
            onRemove={() => removeExercise(ex.id)}
          />
        ))}
      </div>

      {workout.exercises.length > 0 && (
        <button className="save-workout-btn" onClick={save}>SAVE WORKOUT</button>
      )}
    </div>
  );
};
