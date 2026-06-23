import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Accelerometer } from 'expo-sensors';
import { Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Subscription } from 'expo-sensors/build/Pedometer';

const COLORS = ['#ff2020', '#00bfff', '#44ff88', '#ffe94a', '#ff69b4', '#9b59b6'];

const FRASES = [
  'che, se te cayó 👀',
  'fijate, tenés cremita en las manitos 🧴',
  'te lo paga magoya? 💸',
  'aaaaay tssss despacito 🥵',
  'el dólar está caro como para andar arreglando 💀',
];

const FALL_THRESHOLD     = 0.15;
const FALL_CONFIRMATIONS = 3;
const COOLDOWN_MS        = 2000;
const SAMPLE_RATE_MS     = 16;
const LONG_FALL_MS       = 500;

export type HistoryEntry = {
  timestamp: number;
  number: number;
};

type AppContextType = {
  accentColor: string;
  setAccentColor: (color: string) => void;
  colors: string[];
  vibration: boolean;
  setVibration: (v: boolean) => void;
  count: number;
  active: boolean;
  toggleActive: () => void;
  registerPlayer: (player: any) => void;
  registerTomPlayer: (player: any) => void;
  falling: boolean;
  frase: string;
  history: HistoryEntry[];
  clearHistory: () => void;
};

const AppContext = createContext<AppContextType>({
  accentColor: '#ff2020',
  setAccentColor: () => {},
  colors: COLORS,
  vibration: true,
  setVibration: () => {},
  count: 0,
  active: false,
  toggleActive: () => {},
  registerPlayer: () => {},
  registerTomPlayer: () => {},
  falling: false,
  frase: '',
  history: [],
  clearHistory: () => {},
});

export function AccentProvider({ children }: { children: React.ReactNode }) {
  const [accentColor, setAccentColor] = useState('#ff2020');
  const [vibration, setVibration]     = useState(true);
  const [count, setCount]             = useState(0);
  const [active, setActive]           = useState(false);
  const [falling, setFalling]         = useState(false);
  const [frase, setFrase]             = useState('');
  const [history, setHistory]         = useState<HistoryEntry[]>([]);

  const subscription  = useRef<Subscription | null>(null);
  const lastScream    = useRef<number>(0);
  const fallCount     = useRef<number>(0);
  const fraseIndex    = useRef<number>(0);
  const countRef      = useRef<number>(0);
  const vibrationRef  = useRef(true);
  const activeRef     = useRef(false);
  const playerRef     = useRef<any>(null);
  const tomPlayerRef  = useRef<any>(null);
  const fallStartTime = useRef<number>(0);

  useEffect(() => {
    async function loadData() {
      try {
        const savedHistory = await AsyncStorage.getItem('history');
        if (savedHistory) {
          const parsed = JSON.parse(savedHistory) as HistoryEntry[];
          setHistory(parsed);
          if (parsed.length > 0) {
            countRef.current = parsed[parsed.length - 1].number;
          }
        }
        const savedColor = await AsyncStorage.getItem('accentColor');
        if (savedColor) setAccentColor(savedColor);

        const savedVibration = await AsyncStorage.getItem('vibration');
        if (savedVibration !== null) {
          const v = savedVibration === 'true';
          setVibration(v);
          vibrationRef.current = v;
        }
      } catch (e) {
        console.warn('Error cargando datos:', e);
      }
    }
    loadData();
  }, []);

  function registerPlayer(player: any) {
    playerRef.current = player;
  }

  function registerTomPlayer(player: any) {
    tomPlayerRef.current = player;
  }

  function startSensor() {
    if (subscription.current) return;
    activeRef.current = true;
    Accelerometer.setUpdateInterval(SAMPLE_RATE_MS);
    subscription.current = Accelerometer.addListener(({ x, y, z }) => {
      const g = Math.sqrt(x * x + y * y + z * z);
      if (g < FALL_THRESHOLD) {
        if (fallCount.current === 0) {
          fallStartTime.current = Date.now();
        }
        fallCount.current += 1;
        if (fallCount.current >= FALL_CONFIRMATIONS) {
          setFalling(true);
          triggerScream();
        }
      } else {
        fallCount.current = 0;
        setFalling(false);
      }
    });
  }

  function stopSensor() {
    activeRef.current = false;
    subscription.current?.remove();
    subscription.current = null;
    fallCount.current = 0;
    lastScream.current = 0;
    setFalling(false);
    setFrase('');
  }

  function triggerScream() {
    if (!activeRef.current) return;
    const now = Date.now();
    if (now - lastScream.current < COOLDOWN_MS) return;
    lastScream.current = now;
    countRef.current += 1;
    const newCount = countRef.current;
    setCount(newCount);
    const newEntry = { timestamp: now, number: newCount };
    setHistory(prev => {
      const updated = [...prev, newEntry];
      AsyncStorage.setItem('history', JSON.stringify(updated)).catch(() => {});
      return updated;
    });
    setFrase(FRASES[fraseIndex.current % FRASES.length]);
    fraseIndex.current += 1;
    if (vibrationRef.current) Vibration.vibrate(300);
    const isLongFall = fallCount.current >= 7;
    try {
      if (isLongFall && tomPlayerRef.current) {
    tomPlayerRef.current?.seekTo(0);
    tomPlayerRef.current?.play();
  }   else {
    playerRef.current?.seekTo(0);
    playerRef.current?.play();
  }
} catch (e) {}
    setTimeout(() => setFrase(''), 3000);
  }

  function toggleActive() {
    if (activeRef.current) {
      stopSensor();
      setActive(false);
      setCount(0);
    } else {
      startSensor();
      setActive(true);
    }
  }

  async function clearHistory() {
    setHistory([]);
    countRef.current = 0;
    await AsyncStorage.removeItem('history');
  }

  const handleSetAccentColor = async (color: string) => {
    setAccentColor(color);
    await AsyncStorage.setItem('accentColor', color);
  };

  const handleSetVibration = async (v: boolean) => {
    vibrationRef.current = v;
    setVibration(v);
    await AsyncStorage.setItem('vibration', String(v));
  };

  return (
    <AppContext.Provider value={{
      accentColor, setAccentColor: handleSetAccentColor,
      colors: COLORS,
      vibration, setVibration: handleSetVibration,
      count,
      active, toggleActive,
      registerPlayer,
      registerTomPlayer,
      falling, frase,
      history, clearHistory,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAccent() {
  return useContext(AppContext);
}