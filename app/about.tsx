import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BottomNav from '@/components/ui/BottomNav';
import { useAccent } from '@/components/AccentContext';

export default function About() {
  const { accentColor } = useAccent();

  return (
    <View style={styles.container}>
      <View style={styles.content}>

        <Text style={styles.screenTitle}>SOBRE LA APP</Text>

        <View style={styles.card}>
          <Text style={[styles.appName, { color: accentColor }]}>QUÉ BOLÚ...</Text>
          <Text style={styles.appVersion}>V1.0</Text>
        </View>

        <View style={styles.card}>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowTitle}>COMPARTIR APP</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.row, styles.rowBorder]}>
            <View>
              <Text style={styles.rowTitle}>CALIFICANOS</Text>
              <Text style={styles.rowSub}>Si te gustó, dale 5 estrellas</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.row, styles.rowBorder]}>
            <Text style={styles.rowTitle}>POLÍTICA DE PRIVACIDAD</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.row, styles.rowBorder]}>
            <Text style={styles.rowTitle}>TÉRMINOS Y CONDICIONES</Text>
          </TouchableOpacity>
        </View>

      </View>

      <BottomNav accentColor={accentColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: '#0a0a0a' },
  content:    { flex: 1, padding: 24, gap: 12 },
  screenTitle:{ color: '#f5f5f0', fontSize: 11, letterSpacing: 4, fontFamily: 'monospace', fontWeight: '700', marginBottom: 8 },
  card:       { backgroundColor: '#141414', borderWidth: 1, borderColor: '#1e1e1e', borderRadius: 4, padding: 16, gap: 12 },
  appName:    { fontSize: 20, fontWeight: '900', letterSpacing: 4, fontFamily: 'monospace', textAlign: 'center' },
  appVersion: { color: '#2a2a2a', fontSize: 8, letterSpacing: 3, fontFamily: 'monospace', textAlign: 'center' },
  row:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  rowBorder:  { borderTopWidth: 1, borderTopColor: '#1a1a1a', paddingTop: 12 },
  rowTitle:   { color: '#f5f5f0', fontSize: 11, letterSpacing: 1, fontFamily: 'monospace' },
  rowSub:     { color: '#333', fontSize: 9, letterSpacing: 1, fontFamily: 'monospace', marginTop: 2 },
});