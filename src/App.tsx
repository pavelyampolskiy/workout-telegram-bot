import React from "react";

export const App: React.FC = () => {
  return (
    <div className="app">
      <header className="top-bar">
        <button className="top-bar-back">Cerrar</button>
        <div className="top-bar-title">
          <span className="top-bar-main">WORKOUT JOURNAL</span>
          <span className="top-bar-sub">miniapp</span>
        </div>
        <button className="top-bar-menu">⋯</button>
      </header>

      <main className="content">
        <section className="hero">
          <p className="hero-kicker">
            ARE YOU{" "}
            <span className="hero-kicker-ready">
              READY
            </span>
            ?
          </p>
          <div className="hero-metrics">
            <div className="metric">
              <span className="metric-label">1 WORKOUT</span>
            </div>
            <div className="metric">
              <span className="metric-label">LAST 2 DAYS AGO</span>
            </div>
            <div className="metric">
              <span className="metric-label">1 THIS WEEK</span>
            </div>
          </div>
        </section>

        <section className="weekly-goal-card glass">
          <div className="weekly-goal-progress">
            <div className="circle">
              <span className="circle-value">1</span>
            </div>
          </div>
          <div className="weekly-goal-text">
            <p className="weekly-goal-label">WEEKLY GOAL</p>
            <p className="weekly-goal-sub">1 OF 3 WORKOUTS</p>
            <p className="weekly-goal-sub">1 TOTAL</p>
          </div>
        </section>

        <section className="new-workout-card glass">
          <div>
            <p className="new-workout-title">NEW WORKOUT</p>
            <p className="new-workout-sub">START YOUR TRAINING SESSION NOW</p>
          </div>
          <button className="new-workout-cta" aria-label="Start workout">
            &gt;
          </button>
        </section>

        <section className="grid">
          <button className="grid-item glass">
            <span className="grid-label">HISTORY</span>
          </button>
          <button className="grid-item glass">
            <span className="grid-label">STATISTICS</span>
          </button>
          <button className="grid-item glass">
            <span className="grid-label">ACHIEVEMENTS</span>
          </button>
          <button className="grid-item glass">
            <span className="grid-label">CARDIO</span>
          </button>
        </section>
      </main>
    </div>
  );
};
