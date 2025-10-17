// app.js - static client-side workout tracker

/* WORKOUT_PLAN copied from your React object */
const WORKOUT_PLAN = {
  title: "Clyde's Gym Plan",
  note: "Goal: Large calorie surplus + protein, 6x workouts/week, focus on glutes & legs",
  schedule: [
    { id: "monday", name: "Monday: Legs (Squat day)", exercises: [
      { id: "m1", name: "Barbell Back Squats", sets: "4 x 10"  },
      { id: "m2", name: "Leg Extensions", sets: "3 x 15" },
      { id: "m3", name: "Cable Kickbacks (per leg)", sets: "3 x 15" },
      { id: "m4", name: "Lying Hamstring Curls", sets: "3 x 12" },
      { id: "m5", name: "Walking Lunges (20 steps)", sets: "3 x 20 steps" },
      { id: "m6", name: "Finisher: 10 min Stairmaster", sets: "10 min" }
    ]},
    { id: "tuesday", name: "Tuesday: Pull day (back + Bicep day)", exercises: [
      { id: "t1", name: "Pull Ups", sets: "4 x 10" },
      { id: "t2", name: "Lat Pulldowns", sets: "4 x 12" },
      { id: "t3", name: "Seated Rows", sets: "4 x 10" },
      { id: "t4", name: "Face Pulls", sets: "3 x 15" },
      { id: "t5", name: "Dumbbell Bicep Curls", sets: "3 x 15" },
      { id: "t6", name: "Hammer Curls", sets: "3 x 15" }
    ]},
    { id: "wednesday", name: "Wednesday: Push day (Push + Pull Day)", exercises: [
      { id: "w1", name: "Push Ups", sets: "50+ Reps" },
      { id: "w2", name: "Chest Dips", sets: "2 x 20" },
      { id: "w3", name: "Incline Dumbbell Chest Press", sets: "4 x 10" },
      { id: "w4", name: "Cable Flyers", sets: "4 x 10" },
      { id: "w5", name: "Triceps Pull Down", sets: "6 x 10" }
    ]},
    { id: "thursday", name: "Thursday: Legs + abs day", exercises: [
      { id: "th1", name: "Split squats", sets: "3 x 12" },
      { id: "th2", name: "Leg Press (wide stance)", sets: "3 x 10" },
      { id: "th3", name: "Abductor Machine", sets: "3 x 12" },
      { id: "th4", name: "Calf raises", sets: "3 x 12" },
      { id: "th5", name: "Calf machine", sets: "3 x 15" },
      { id: "th6", name: "Russian Twists", sets: "3 x 20" },
      { id: "th7", name: "Seat Ups", sets: "3 x 15" }
    ]},
    { id: "friday", name: "Friday: Shoulders + Arms", exercises: [
      { id: "f1", name: "Bicep + Tricep superset (Dumbbell Curl + Skull Crushers)", sets: "5 x 8" },
      { id: "f2", name: "Lateral raises", sets: "8 x 10" },
      { id: "f3", name: "Shoulder Press", sets: "5 x 12" },
      { id: "f4", name: "Bicep super set (hammer + straight bar)", sets: "3 x 12 each" },
      { id: "f5", name: "Tricep superset (pulldowns + Overhead)", sets: "4 x 20" },
      { id: "f6", name: "Forearm curls", sets: "5 x 12 each arm" }
    ]},
    { id: "saturday", name: "Saturday: Boxing & Cardio", exercises: [
      { id: "s1", name: "Warm up", sets: "15-20 min" },
      { id: "s2", name: "Shadow Boxing", sets: "20-30 min" },
      { id: "s3", name: "Bag Work / Sparring", sets: "5-10 rounds" },
      { id: "s4", name: "Conditioning", sets: "30 min" },
      { id: "s5", name: "Cool Down", sets: "15 min" }
    ]},
    { id: "sunday", name: "Sunday: Rest or Active Recovery", exercises: [] }
  ]
};

const STORAGE_KEY = "gym_v1";

/* Helpers for storage */
function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : { progress: {}, notes: {}, selected: WORKOUT_PLAN.schedule[0].id };
}
function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* Render functions */
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

function renderDays(state, onSelect) {
  const container = document.getElementById("daysList");
  container.innerHTML = "";
  WORKOUT_PLAN.schedule.forEach(day => {
    const dayBtn = el("div", "day-btn");
    if (state.selected === day.id) dayBtn.classList.add("active");
    const left = el("div", "leftcol");
    const name = el("div", "day-name", day.name);
    const meta = el("div", "day-meta", `${day.exercises.length} exercises`);
    left.appendChild(name);
    left.appendChild(meta);

    const doneCount = (Object.values(state.progress[day.id] || {}).filter(Boolean) || []).length;
    const right = el("div", "day-count", `${doneCount}/${day.exercises.length}`);

    dayBtn.appendChild(left);
    dayBtn.appendChild(right);

    dayBtn.addEventListener("click", () => {
      state.selected = day.id;
      saveState(state);
      onSelect();
    });

    container.appendChild(dayBtn);
  });
}

function renderSelectedDay(state) {
  const planTitle = document.getElementById("planTitle");
  const exList = document.getElementById("exList");
  planTitle.textContent = "";
  exList.innerHTML = "";

  const day = WORKOUT_PLAN.schedule.find(d => d.id === state.selected);
  planTitle.textContent = day ? day.name : "";

  if (!day) return;

  if (!day.exercises || day.exercises.length === 0) {
    exList.appendChild(el("div", "exercise", "Rest or active recovery — light walk, stretch"));
    document.getElementById("notes").value = state.notes[day.id] || "";
    return;
  }

  day.exercises.forEach(ex => {
    const row = el("div", "exercise");
    const left = el("div", "left");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = !!(state.progress[day.id] && state.progress[day.id][ex.id]);
    cb.addEventListener("change", () => {
      state.progress[day.id] = state.progress[day.id] || {};
      state.progress[day.id][ex.id] = cb.checked;
      saveState(state);
      renderDays(state, () => renderSelectedDay(state));
    });

    const details = el("div", "details");
    const name = el("div", "name", ex.name);
    const sets = el("div", "sets", ex.sets);
    sets.style.fontSize = "13px";
    sets.style.color = "#666";
    details.appendChild(name);
    details.appendChild(sets);

    left.appendChild(cb);
    left.appendChild(details);

    const right = el("div", "right");
    const markBtn = el("button", "btn", cb.checked ? "Done" : "Mark");
    markBtn.style.fontSize = "13px";
    markBtn.addEventListener("click", () => {
      cb.checked = !cb.checked;
      cb.dispatchEvent(new Event("change"));
      markBtn.textContent = cb.checked ? "Done" : "Mark";
    });

    row.appendChild(left);
    row.appendChild(markBtn);
    exList.appendChild(row);
  });

  // notes
  const notesEl = document.getElementById("notes");
  notesEl.value = state.notes[day.id] || "";
  notesEl.oninput = (e) => {
    state.notes[day.id] = e.target.value;
    saveState(state);
  };
}

/* Actions */
function markAllDone(state) {
  const day = WORKOUT_PLAN.schedule.find(d => d.id === state.selected);
  if (!day) return;
  state.progress[day.id] = state.progress[day.id] || {};
  day.exercises.forEach(ex => state.progress[day.id][ex.id] = true);
  saveState(state);
  renderDays(state, () => renderSelectedDay(state));
}
function clearDay(state) {
  const day = WORKOUT_PLAN.schedule.find(d => d.id === state.selected);
  if (!day) return;
  state.progress[day.id] = {};
  state.notes[day.id] = "";
  saveState(state);
  renderDays(state, () => renderSelectedDay(state));
}
function exportProgress(state) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Gym_progress.json";
  a.click();
  URL.revokeObjectURL(url);
}

/* Init */
(function init(){
  const state = loadState();

  // ensure structure
  state.progress = state.progress || {};
  state.notes = state.notes || {};
  if (!state.selected) state.selected = WORKOUT_PLAN.schedule[0].id;

  // render initial UI
  renderDays(state, () => renderSelectedDay(state));
  renderSelectedDay(state);

  // wire buttons
  document.getElementById("markAllBtn").addEventListener("click", () => { markAllDone(state); });
  document.getElementById("clearDayBtn").addEventListener("click", () => { if (confirm("Clear this day's progress and notes?")) clearDay(state); });
  document.getElementById("exportBtn").addEventListener("click", () => exportProgress(state));
  document.getElementById("resetBtn").addEventListener("click", () => { if (confirm("Reset all saved progress?")) { localStorage.removeItem(STORAGE_KEY); location.reload(); }});
})();
