import { Ionicons } from '@expo/vector-icons';
import { AudioModule, useAudioPlayer } from 'expo-audio';
import { useEffect } from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomNav from '@/components/ui/BottomNav';
import { useAccent } from '@/components/AccentContext';

export default function App() {
  const { accentColor, active, toggleActive, registerPlayer, registerTomPlayer, count, falling, frase } = useAccent();
  const player    = useAudioPlayer(require('../../assets/sounds/wilhelm.mp3'));
  const tomPlayer = useAudioPlayer(require('../../assets/sounds/Tom_Scream.mp3'));

  useEffect(() => {
    AudioModule.setAudioModeAsync({
      playsInSilentModeIOS: true,
      shouldDuckAndroid: false,
    }).catch(e => console.warn('Audio mode error:', e));
    registerPlayer(player);
    registerTomPlayer(tomPlayer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      {falling && <View style={styles.flash} />}

      <View style={styles.topBar}>
        <Text style={styles.title}>QUÉ BOLÚ<Text style={{ color: accentColor }}>...</Text></Text>
        <Text style={styles.subtitle}>DETECTOR DE IDIOTAS · V1.0</Text>
      </View>

      <View style={styles.center}>

        <View style={[styles.fraseWrap, {
          borderColor: frase ? accentColor : 'transparent',
          backgroundColor: frase ? `${accentColor}15` : 'transparent',
        }]}>
          <Text style={[styles.fraseText, { color: accentColor }]}>{frase || ' '}</Text>
        </View>

        <View style={styles.powerWrap}>
          <View style={[styles.powerRing, { borderColor: `${accentColor}25` }]} />
          <TouchableOpacity
            style={[styles.powerBtn, active && { backgroundColor: accentColor, borderColor: accentColor }]}
            onPress={toggleActive}
            activeOpacity={0.8}
          >
            <Ionicons name="power" size={52} color={active ? '#fff' : accentColor} />
          </TouchableOpacity>
        </View>

        <View style={styles.counterArea}>
          <Text style={styles.counterLabel}>VECES QUE LA CAGASTE</Text>
          <Text style={[styles.counterNum, { color: active ? accentColor : '#141414' }]}>{count}</Text>
        </View>

        <Text style={[styles.status, { color: active ? '#44ff88' : '#2a2a2a' }]}>
          {active ? 'te estoy viendo 👁' : 'listo para vigilarte'}
        </Text>

      </View>

      <BottomNav accentColor={accentColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#0a0a0a' },
  flash:       { ...StyleSheet.absoluteFillObject, backgroundColor: '#ff2020', opacity: 0.45, zIndex: 10 },
  topBar:      { paddingHorizontal: 24, paddingTop: 48, paddingBottom: 8 },
  title:       { color: '#f5f5f0', fontFamily: 'monospace', fontSize: 32, fontWeight: '900', letterSpacing: 4 },
  subtitle:    { color: '#2a2a2a', fontFamily: 'monospace', fontSize: 8, letterSpacing: 3, marginTop: 2 },
  center:      { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, gap: 24 },
  fraseWrap:   { width: '100%', minHeight: 44, borderWidth: 1, borderRadius: 4, paddingHorizontal: 16, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
  fraseText:   { fontFamily: 'monospace', fontSize: 12, fontWeight: '700', letterSpacing: 1, textAlign: 'center' },
  powerWrap:   { alignItems: 'center', justifyContent: 'center' },
  powerRing:   { position: 'absolute', width: 160, height: 160, borderRadius: 80, borderWidth: 1, borderColor: 'transparent' },
  powerBtn:    { width: 140, height: 140, borderRadius: 70, borderWidth: 3, borderColor: '#ff2020', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' },
  counterArea: { alignItems: 'center' },
  counterLabel:{ color: '#2a2a2a', fontFamily: 'monospace', fontSize: 8, letterSpacing: 3 },
  counterNum:  { fontFamily: 'monospace', fontSize: 56, fontWeight: '900', lineHeight: 56 },
  status:      { fontFamily: 'monospace', fontSize: 9, letterSpacing: 3 },
});