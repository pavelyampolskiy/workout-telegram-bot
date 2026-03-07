import React from "react";
import { useStore } from "../store";

const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5,3 19,12 5,21" />
  </svg>
);

const ClockIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const BarChartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="18" x2="8" y2="10" />
    <line x1="12" y1="18" x2="12" y2="6" />
    <line x1="16" y1="18" x2="16" y2="14" />
  </svg>
);

const TrophyIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2" />
    <path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" />
    <path d="M6 3h12v6a6 6 0 0 1-12 0V3z" />
    <path d="M12 15v3" />
    <path d="M8 21h8" />
  </svg>
);

const HeartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const DumbbellIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 6.5h11M6.5 17.5h11" />
    <rect x="2" y="5" width="4" height="14" rx="1" />
    <rect x="18" y="5" width="4" height="14" rx="1" />
    <rect x="6" y="8" width="12" height="8" rx="1" opacity="0.3" />
  </svg>
);

function getStats(workouts: { status: string; completedAt: number | null; createdAt: number }[]) {
  const completed = workouts.filter((w) => w.status === "completed");
  const total = completed.length;

  const now = Date.now();
  const dayMs = 86_400_000;
  const startOfWeek = now - new Date().getDay() * dayMs;

  const thisWeek = completed.filter(
    (w) => (w.completedAt ?? w.createdAt) >= startOfWeek
  ).length;

  const todayStart = new Date().setHours(0, 0, 0, 0);
  const lastToday = completed.filter(
    (w) => (w.completedAt ?? w.createdAt) >= todayStart
  ).length;

  let lastLabel = "NEVER";
  if (completed.length > 0) {
    const last = Math.max(...completed.map((w) => w.completedAt ?? w.createdAt));
    const daysAgo = Math.floor((now - last) / dayMs);
    if (daysAgo === 0) lastLabel = "TODAY";
    else if (daysAgo === 1) lastLabel = "YESTERDAY";
    else lastLabel = `${daysAgo} DAYS AGO`;
  }

  return { total, thisWeek, lastToday, lastLabel };
}

export const Home: React.FC = () => {
  const { state, dispatch } = useStore();
  const stats = getStats(state.workouts);
  const inProgress = state.workouts.find((w) => w.status === "in-progress");

  const weeklyGoal = 3;

  const goToNewWorkout = () =>
    dispatch({ type: "NAVIGATE", view: { kind: "new-workout" } });

  const continueWorkout = () => {
    if (inProgress) {
      dispatch({ type: "NAVIGATE", view: { kind: "editor", workoutId: inProgress.id } });
    }
  };

  const dismissWorkout = () => {
    if (inProgress) {
      dispatch({ type: "CANCEL_WORKOUT", workoutId: inProgress.id });
    }
  };

  return (
    <main className="content">
      <section className="hero">
        <p className="hero-kicker">
          ARE YOU <span className="hero-kicker-ready">READY</span>?
        </p>
        <div className="hero-metrics">
          <div className="metric">
            <span className="metric-label">
              {stats.total} WORKOUT{stats.total !== 1 ? "S" : ""}
            </span>
          </div>
          <div className="metric">
            <span className="metric-label">LAST {stats.lastLabel}</span>
          </div>
          <div className="metric">
            <span className="metric-label">{stats.thisWeek} THIS WEEK</span>
          </div>
        </div>
      </section>

      <section className="weekly-goal-card glass">
        <div className="weekly-goal-progress">
          <div className="circle" style={{
            borderColor: stats.thisWeek >= weeklyGoal ? "#5ac8ff" : "#f2f2f2",
          }}>
            <span className="circle-value">{stats.thisWeek}</span>
          </div>
        </div>
        <div className="weekly-goal-text">
          <p className="weekly-goal-label">WEEKLY GOAL</p>
          <p className="weekly-goal-sub">
            {stats.thisWeek} OF {weeklyGoal} WORKOUTS
          </p>
        </div>
      </section>

      {inProgress && (
        <section className="continue-card glass" onClick={continueWorkout}>
          <span className="continue-icon"><PlayIcon /></span>
          <div className="continue-text">
            <p className="continue-title">CONTINUE WORKOUT</p>
            <p className="continue-name">{inProgress.name}</p>
          </div>
          <span className="template-arrow">›</span>
        </section>
      )}

      {inProgress && (
        <button className="dismiss-btn" onClick={dismissWorkout}>DISMISS</button>
      )}

      <section className="new-workout-card glass" onClick={goToNewWorkout}>
        <div className="new-workout-left">
          <span className="new-workout-icon"><DumbbellIcon /></span>
          <div>
            <p className="new-workout-title">NEW WORKOUT</p>
            <p className="new-workout-sub">Start your training session</p>
          </div>
        </div>
        <span className="template-arrow">›</span>
      </section>

      <section className="grid">
        <button className="grid-item glass">
          <ClockIcon />
          <span className="grid-label">HISTORY</span>
        </button>
        <button className="grid-item glass">
          <BarChartIcon />
          <span className="grid-label">STATISTICS</span>
        </button>
        <button className="grid-item glass">
          <TrophyIcon />
          <span className="grid-label">ACHIEVEMENTS</span>
        </button>
        <button className="grid-item glass">
          <HeartIcon />
          <span className="grid-label">CARDIO</span>
        </button>
      </section>
    </main>
  );
};
