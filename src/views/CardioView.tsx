import React, { useState } from "react";
import { useStore, uid } from "../store";

export const CardioView: React.FC<{ workoutId: string }> = ({ workoutId }) => {
  const { state, dispatch } = useStore();
  const workout = state.workouts.find((w) => w.id === workoutId);
  const [description, setDescription] = useState("");

  if (!workout) {
    dispatch({ type: "NAVIGATE", view: { kind: "home" } });
    return null;
  }

  const save = () => {
    const text = description.trim() || "Cardio session";
    const updated = {
      ...workout,
      exercises:
        workout.exercises.length > 0
          ? [{ ...workout.exercises[0], name: text }, ...workout.exercises.slice(1)]
          : [{ id: uid(), name: text, sets: [{ reps: 0, weight: 0 }] }],
      status: "completed" as const,
      completedAt: Date.now(),
    };
    dispatch({ type: "UPDATE_WORKOUT", workout: updated });
    dispatch({ type: "NAVIGATE", view: { kind: "home" } });
  };

  const cancel = () => {
    dispatch({ type: "CANCEL_WORKOUT", workoutId });
    dispatch({ type: "NAVIGATE", view: { kind: "home" } });
  };

  return (
    <div className="view-editor view-cardio">
      <div className="view-header">
        <h2 className="view-title">CARDIO</h2>
        <button className="view-action-btn" onClick={cancel}>
          CANCEL
        </button>
      </div>
      <p className="cardio-subtitle">Describe your session</p>
      <textarea
        className="cardio-description-input glass"
        placeholder="E.g. Running 30 min, 5 km"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
      />
      <button
        className="save-workout-btn cardio-save"
        onClick={save}
      >
        SAVE CARDIO
      </button>
    </div>
  );
};
