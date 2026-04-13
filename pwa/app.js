/* ─── Configurable defaults ─────────────────────────────────── */
const DEFAULT_EXCHANGE_RATE = 0.217; // 1 JPY → TWD fallback

/* ─── Day header gradients ──────────────────────────────────── */
const DAY_GRADIENTS = {
  1: 'linear-gradient(135deg, #B91C1C 0%, #E11D48 100%)',
  2: 'linear-gradient(135deg, #EA580C 0%, #F59E0B 100%)',
  3: 'linear-gradient(135deg, #0369A1 0%, #38BDF8 100%)',
  4: 'linear-gradient(135deg, #047857 0%, #2DD4BF 100%)',
  5: 'linear-gradient(135deg, #6D28D9 0%, #A78BFA 100%)',
  6: 'linear-gradient(135deg, #334155 0%, #64748B 100%)',
};

/* ─── WMO weather code helpers ──────────────────────────────── */
function wmoEmoji(code) {
  if (code === 0)  return '☀️';
  if (code === 1)  return '🌤️';
  if (code === 2)  return '⛅';
  if (code === 3)  return '🌥️';
  if (code <= 48)  return '🌫️';
  if (code <= 55)  return '🌦️';
  if (code <= 67)  return '🌧️';
  if (code <= 77)  return '🌨️';
  if (code <= 82)  return '🌧️';
  if (code <= 86)  return '🌨️';
  return '⛈️';
}

function wmoLabel(code) {
  const map = {
    0: '晴天', 1: '大致晴', 2: '局部多雲', 3: '多雲',
    45: '霧', 48: '凍霧',
    51: '輕毛毛雨', 53: '毛毛雨', 55: '濃毛毛雨',
    56: '輕凍雨', 57: '凍雨',
    61: '小雨', 63: '中雨', 65: '大雨',
    66: '輕凍雨', 67: '凍雨',
    71: '小雪', 73: '中雪', 75: '大雪', 77: '雪粒',
    80: '小陣雨', 81: '陣雨', 82: '強陣雨',
    85: '陣雪', 86: '大陣雪',
    95: '雷雨', 96: '冰雹雷雨', 99: '強冰雹雷雨',
  };
  return map[code] ?? '未知天氣';
}

/* ─── Category helpers ──────────────────────────────────────── */
function categoryLabel(category) {
  const map = {
    flight: '交通', transport: '交通',
    food: '餐廳',
    attraction: '景點', shopping: '景點', task: '景點',
    hotel: '住宿',
  };
  return map[category] ?? '其他';
}

function isTransport(category) {
  return category === 'flight' || category === 'transport';
}

/* ─── Schedule chip builder ─────────────────────────────────── */
function buildChips(schedule) {
  if (!schedule) return [];
  const { departures, bookedIndex } = schedule;
  const start = Math.max(0, bookedIndex - 2);
  const end   = Math.min(departures.length - 1, bookedIndex + 2);
  const chips = [];
  for (let i = start; i <= end; i++) {
    const offset = i - bookedIndex;
    const label  = offset === 0 ? '已預訂' : offset < 0 ? `T${offset}` : `T+${offset}`;
    chips.push({ label, time: departures[i], booked: i === bookedIndex });
  }
  return chips;
}

/* ─── URL builders ──────────────────────────────────────────── */
function navigateUrl(activity) {
  const dest = activity.lat && activity.lng
    ? `${activity.lat},${activity.lng}`
    : encodeURIComponent(activity.mapQuery ?? '');
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=transit`;
}

function mapUrl(activity) {
  if (activity.mapQuery) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.mapQuery)}`;
  }
  if (activity.lat && activity.lng) {
    return `https://www.google.com/maps/search/?api=1&query=${activity.lat},${activity.lng}`;
  }
  return '#';
}

/* ─── Alpine component ──────────────────────────────────────── */
document.addEventListener('alpine:init', () => {
  Alpine.data('app', () => ({
    loading: true,
    days: [],
    checklist: [],
    activeDay: 1,
    visited: {},       // activityId → true/false
    checklistDone: {}, // item.id → true/false
    weather: {},       // day.day → { code, max, min }
    jpy: 5000,
    liveRate: null,

    /* computed */
    get effectiveRate() { return this.liveRate ?? DEFAULT_EXCHANGE_RATE; },
    get twd() { return Math.round(this.jpy * this.effectiveRate); },
    get allChecked() {
      return this.checklist.length > 0 &&
             this.checklist.every(item => this.checklistDone[item.id]);
    },

    /* lifecycle */
    async init() {
      await this.loadItinerary();
      this.loadLocalStorage();
      this.fetchAllWeather();
      this.fetchExchangeRate();
      this.setupScrollSpy();
      this.loading = false;

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js').catch(() => {});
      }
    },

    async loadItinerary() {
      const res  = await fetch('./itinerary.json');
      const data = await res.json();
      this.days      = data.days;
      this.checklist = data.checklist;
      // pre-initialise weather slots so Alpine tracks them reactively
      const wObj = {};
      data.days.forEach(d => { wObj[d.day] = null; });
      this.weather = wObj;
    },

    loadLocalStorage() {
      try {
        const v = localStorage.getItem('jp26_visited');
        if (v) this.visited = JSON.parse(v);
        const c = localStorage.getItem('jp26_checklist');
        if (c) this.checklistDone = JSON.parse(c);
      } catch (_) {}
    },

    fetchAllWeather() {
      this.days.forEach(day => this.fetchWeather(day));
    },

    async fetchWeather(day) {
      const [m, d] = day.date.split('.');
      const dateStr = `2026-${m}-${d}`;
      try {
        const url = `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${day.weatherLat}&longitude=${day.weatherLng}` +
          `&daily=weathercode,temperature_2m_max,temperature_2m_min` +
          `&timezone=Asia%2FTokyo&start_date=${dateStr}&end_date=${dateStr}`;
        const res  = await fetch(url);
        const data = await res.json();
        this.weather[day.day] = {
          code: data.daily.weathercode[0],
          max:  Math.round(data.daily.temperature_2m_max[0]),
          min:  Math.round(data.daily.temperature_2m_min[0]),
        };
      } catch (_) {}
    },

    async fetchExchangeRate() {
      try {
        const res  = await fetch('https://open.er-api.com/v6/latest/JPY');
        const data = await res.json();
        if (data.rates?.TWD) this.liveRate = data.rates.TWD;
      } catch (_) {}
    },

    setupScrollSpy() {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.activeDay = Number(entry.target.dataset.day);
          }
        });
      }, { rootMargin: `-${56 + 16}px 0px -55% 0px` });

      this.$nextTick(() => {
        document.querySelectorAll('.day-section').forEach(el => observer.observe(el));
      });
    },

    /* actions */
    scrollToDay(dayNum) {
      this.activeDay = dayNum;
      const el = document.getElementById(`day-${dayNum}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },

    toggleVisited(id) {
      this.visited[id] = !this.visited[id];
      try { localStorage.setItem('jp26_visited', JSON.stringify(this.visited)); } catch (_) {}
    },

    toggleChecklist(id) {
      this.checklistDone[id] = !this.checklistDone[id];
      try { localStorage.setItem('jp26_checklist', JSON.stringify(this.checklistDone)); } catch (_) {}
    },

    /* template helpers exposed to Alpine */
    dayGradient(dayNum) { return DAY_GRADIENTS[dayNum] ?? DAY_GRADIENTS[1]; },
    wmoEmoji, wmoLabel, categoryLabel, isTransport, buildChips, navigateUrl, mapUrl,

    activityId(dayNum, index) { return `d${dayNum}a${index}`; },

    hasNav(activity) {
      return activity.mapQuery || (activity.lat && activity.lng);
    },
  }));
});
