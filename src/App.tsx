import React from "react";
import { StoreProvider, useStore } from "./store";
import { Home } from "./views/Home";
import { NewWorkout } from "./views/NewWorkout";
import { WorkoutEditor } from "./views/WorkoutEditor";

const BackIcon = () => (
  <svg width="10" height="16" viewBox="0 0 10 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="8,1 2,8 8,15" />
  </svg>
);

const Shell: React.FC = () => {
  const { state, dispatch } = useStore();
  const isHome = state.view.kind === "home";

  const goBack = () => dispatch({ type: "NAVIGATE", view: { kind: "home" } });

  return (
    <div className="app">
      <header className="top-bar">
        {isHome ? (
          <button className="top-bar-back">Cerrar</button>
        ) : (
          <button className="top-bar-back" onClick={goBack}>
            <BackIcon /> Atrás
          </button>
        )}
        <div className="top-bar-title">
          <span className="top-bar-main">WORKOUT JOURNAL</span>
          <span className="top-bar-sub">miniapp</span>
        </div>
        <button className="top-bar-menu">⋯</button>
      </header>

      {state.view.kind === "home" && <Home />}
      {state.view.kind === "new-workout" && <NewWorkout />}
      {state.view.kind === "editor" && <WorkoutEditor workoutId={state.view.workoutId} />}
    </div>
  );
};

export const App: React.FC = () => (
  <StoreProvider>
    <Shell />
  </StoreProvider>
);
