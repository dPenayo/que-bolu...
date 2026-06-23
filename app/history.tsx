import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useAccent } from '@/components/AccentContext';
import BottomNav from '@/components/ui/BottomNav';

export default function History() {
  const { accentColor, history, clearHistory } = useAccent();

  const totalHoy = history.filter(h => {
    const hoy = new Date();
    const fecha = new Date(h.timestamp);
    return fecha.toDateString() === hoy.toDateString();
  }).length;

  function formatFecha(timestamp: number) {
    const fecha = new Date(timestamp);
    const hoy = new Date();
    const ayer = new Date();
    ayer.setDate(hoy.getDate() - 1);
    if (fecha.toDateString() === hoy.toDateString()) return 'HOY';
    if (fecha.toDateString() === ayer.toDateString()) return 'AYER';
    return fecha.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' });
  }

  function formatHora(timestamp: number) {
    const fecha = new Date(timestamp);
    return fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs';
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        <Text style={styles.screenTitle}>HISTORIAL</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL CAÍDAS</Text>
            <Text style={[styles.statNum, { color: accentColor }]}>{history.length}</Text>
            <Text style={styles.statSub}>desde el inicio</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>HOY</Text>
            <Text style={[styles.statNum, { color: accentColor }]}>{totalHoy}</Text>
            <Text style={styles.statSub}>caídas hoy</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>ÚLTIMAS CAÍDAS</Text>

        {history.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>ninguna caída registrada</Text>
          </View>
        ) : (
          <View style={styles.card}>
            {[...history].reverse().map((item, i) => (
              <View key={item.timestamp} style={[styles.entry, i > 0 && styles.entryBorder]}>
                <View style={[styles.entryIcon, { backgroundColor: `${accentColor}15`, borderColor: `${accentColor}30` }]}>
                  <Text style={[styles.entryIconText, { color: accentColor }]}>!</Text>
                </View>
                <View style={styles.entryInfo}>
                  <Text style={styles.entryDate}>{formatFecha(item.timestamp)}</Text>
                  <Text style={styles.entryTime}>{formatHora(item.timestamp)}</Text>
                </View>
                <Text style={[styles.entryNum, { color: accentColor }]}>#{item.number}</Text>
              </View>
            ))}
          </View>
        )}

        {history.length > 0 && (
          <TouchableOpacity style={styles.clearBtn} onPress={clearHistory}>
            <Text style={styles.clearText}>BORRAR HISTORIAL</Text>
          </TouchableOpacity>
        )}

      </ScrollView>

      <BottomNav accentColor={accentColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#0a0a0a' },
  scroll:       { flex: 1 },
  content:      { padding: 24, gap: 12 },
  screenTitle:  { color: '#f5f5f0', fontSize: 11, letterSpacing: 4, fontFamily: 'monospace', fontWeight: '700', marginBottom: 8 },
  statsRow:     { flexDirection: 'row', gap: 10 },
  statCard:     { flex: 1, backgroundColor: '#141414', borderWidth: 1, borderColor: '#1e1e1e', borderRadius: 4, padding: 12 },
  statLabel:    { color: '#2a2a2a', fontSize: 8, letterSpacing: 2, fontFamily: 'monospace', marginBottom: 4 },
  statNum:      { fontSize: 28, fontWeight: '900', fontFamily: 'monospace', lineHeight: 28 },
  statSub:      { color: '#333', fontSize: 8, letterSpacing: 1, fontFamily: 'monospace', marginTop: 2 },
  sectionLabel: { color: '#2a2a2a', fontSize: 8, letterSpacing: 3, fontFamily: 'monospace', marginTop: 4 },
  card:         { backgroundColor: '#141414', borderWidth: 1, borderColor: '#1e1e1e', borderRadius: 4 },
  entry:        { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  entryBorder:  { borderTopWidth: 1, borderTopColor: '#1a1a1a' },
  entryIcon:    { width: 32, height: 32, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  entryIconText:{ fontSize: 16, fontWeight: '900', fontFamily: 'monospace' },
  entryInfo:    { flex: 1 },
  entryDate:    { color: '#f5f5f0', fontSize: 10, letterSpacing: 1, fontFamily: 'monospace' },
  entryTime:    { color: '#333', fontSize: 9, letterSpacing: 1, fontFamily: 'monospace', marginTop: 2 },
  entryNum:     { fontSize: 18, fontWeight: '900', fontFamily: 'monospace' },
  emptyCard:    { backgroundColor: '#141414', borderWidth: 1, borderColor: '#1e1e1e', borderRadius: 4, padding: 24, alignItems: 'center' },
  emptyText:    { color: '#333', fontSize: 9, letterSpacing: 3, fontFamily: 'monospace' },
  clearBtn:     { borderWidth: 1, borderColor: '#1e1e1e', borderRadius: 4, padding: 14, alignItems: 'center', marginTop: 4 },
  clearText:    { color: '#333', fontSize: 9, letterSpacing: 3, fontFamily: 'monospace' },
});