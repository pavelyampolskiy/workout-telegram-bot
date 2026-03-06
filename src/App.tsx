import React from "react";

const isTelegramWebApp =
  typeof window !== "undefined" &&
  Boolean((window as unknown as { Telegram?: { WebApp?: unknown } }).Telegram?.WebApp);

export const App: React.FC = () => {
  return (
    <div className={`app${isTelegramWebApp ? " app--telegram" : ""}`}>
      {!isTelegramWebApp && (
        <header className="top-bar">
          <button className="top-bar-back">Cerrar</button>
          <div className="top-bar-title">
            <span className="top-bar-main">WORKOUT JOURNAL</span>
            <span className="top-bar-sub">miniapp</span>
          </div>
          <button className="top-bar-menu">⋯</button>
        </header>
      )}

      <main className="content">
        <section className="hero">
          <p className="hero-kicker">ARE YOU READY?</p>
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
          </div>
        </section>

        <section className="new-workout-card glass">
          <span className="new-workout-icon" aria-hidden>🏋️</span>
          <div className="new-workout-text">
            <p className="new-workout-title">NEW WORKOUT</p>
            <p className="new-workout-sub">START YOUR TRAINING SESSION</p>
          </div>
          <button className="new-workout-cta" aria-label="Start workout">
            &gt;
          </button>
        </section>

        <section className="grid">
          <button className="grid-item glass">
            <span className="grid-item-icon" aria-hidden>🕐</span>
            <span className="grid-label">HISTORY</span>
          </button>
          <button className="grid-item glass">
            <span className="grid-item-icon" aria-hidden>📊</span>
            <span className="grid-label">STATISTICS</span>
          </button>
          <button className="grid-item glass">
            <span className="grid-item-icon" aria-hidden>🏆</span>
            <span className="grid-label">ACHIEVEMENTS</span>
          </button>
          <button className="grid-item glass">
            <span className="grid-item-icon" aria-hidden>❤️</span>
            <span className="grid-label">CARDIO</span>
          </button>
        </section>
      </main>
    </div>
  );
};
