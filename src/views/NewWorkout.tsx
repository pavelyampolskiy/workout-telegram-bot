import React, { useState } from "react";
import { useStore, uid } from "../store";
import type { Workout } from "../types";

const DumbbellIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 6.5h11M6.5 17.5h11" />
    <rect x="2" y="5" width="4" height="14" rx="1" />
    <rect x="18" y="5" width="4" height="14" rx="1" />
    <rect x="6" y="8" width="12" height="8" rx="1" opacity="0.3" />
  </svg>
);

const HeartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export const NewWorkout: React.FC = () => {
  const { state, dispatch } = useStore();
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");

  const startFromTemplate = (templateId: string) => {
    const template = state.templates.find((t) => t.id === templateId);
    if (!template) return;

    const workout: Workout = {
      id: uid(),
      name: template.name,
      templateId: template.id,
      exercises: template.exercises.map((name) => ({
        id: uid(),
        name,
        sets: [{ reps: 0, weight: 0 }],
      })),
      status: "in-progress",
      createdAt: Date.now(),
      completedAt: null,
    };

    dispatch({ type: "START_WORKOUT", workout });
    dispatch({ type: "NAVIGATE", view: { kind: "editor", workoutId: workout.id } });
  };

  const startCustom = () => {
    const customCount = state.workouts.filter((w) => w.templateId === null).length + 1;
    const workout: Workout = {
      id: uid(),
      name: `Custom Workout ${customCount}`,
      templateId: null,
      exercises: [],
      status: "in-progress",
      createdAt: Date.now(),
      completedAt: null,
    };

    dispatch({ type: "START_WORKOUT", workout });
    dispatch({ type: "NAVIGATE", view: { kind: "editor", workoutId: workout.id } });
  };

  const startCardio = () => {
    const workout: Workout = {
      id: uid(),
      name: "Cardio",
      templateId: "cardio",
      exercises: [
        { id: uid(), name: "Running", sets: [{ reps: 1, weight: 0 }] },
        { id: uid(), name: "Jump Rope", sets: [{ reps: 1, weight: 0 }] },
      ],
      status: "in-progress",
      createdAt: Date.now(),
      completedAt: null,
    };

    dispatch({ type: "START_WORKOUT", workout });
    dispatch({ type: "NAVIGATE", view: { kind: "editor", workoutId: workout.id } });
  };

  const handleAddTemplate = () => {
    if (!newName.trim()) return;
    dispatch({
      type: "ADD_TEMPLATE",
      template: { id: uid(), name: newName.trim(), icon: "dumbbell", exercises: [] },
    });
    setNewName("");
  };

  return (
    <div className="view-new-workout">
      <div className="view-header">
        <h2 className="view-title">NEW WORKOUT</h2>
        <button className="view-action-btn" onClick={() => setEditing(!editing)}>
          {editing ? "DONE" : "EDIT"}
        </button>
      </div>

      <div className="template-list">
        {state.templates.map((t) => (
          <button
            key={t.id}
            className="template-card glass"
            onClick={() => !editing && startFromTemplate(t.id)}
          >
            <span className="template-icon">
              {t.icon === "heart" ? <HeartIcon /> : <DumbbellIcon />}
            </span>
            {editing ? (
              <input
                className="template-name-input"
                value={t.name}
                onChange={(e) =>
                  dispatch({ type: "RENAME_TEMPLATE", templateId: t.id, name: e.target.value })
                }
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="template-name">{t.name}</span>
            )}
            {editing ? (
              <button
                className="template-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch({ type: "REMOVE_TEMPLATE", templateId: t.id });
                }}
              >
                ✕
              </button>
            ) : (
              <span className="template-arrow">›</span>
            )}
          </button>
        ))}

        {editing && (
          <div className="template-card glass add-template-card">
            <input
              className="template-name-input"
              placeholder="New template name…"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTemplate()}
            />
            <button className="template-add-btn" onClick={handleAddTemplate}>
              +
            </button>
          </div>
        )}
      </div>

      {!editing && (
        <>
          <p className="or-divider">OR</p>

          <button className="template-card glass" onClick={startCardio}>
            <span className="template-icon"><HeartIcon /></span>
            <span className="template-name">Cardio</span>
            <span className="template-arrow">›</span>
          </button>

          <button className="custom-workout-btn glass" onClick={startCustom}>
            <span className="template-name">Custom Workout</span>
            <span className="template-arrow">›</span>
          </button>
        </>
      )}
    </div>
  );
};
