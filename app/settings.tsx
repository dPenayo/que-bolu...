import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { useAccent } from '@/components/AccentContext';
import BottomNav from '@/components/ui/BottomNav';

export default function Settings() {
  const { accentColor, setAccentColor, colors, vibration, setVibration } = useAccent();
  const [keepAwake, setKeepAwake] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        <Text style={styles.screenTitle}>AJUSTES</Text>

        <Text style={styles.sectionLabel}>GENERAL</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View>
              <Text style={styles.rowTitle}>VIBRACIÓN</Text>
              <Text style={styles.rowSub}>Al detectar caída</Text>
            </View>
            <Switch
              value={vibration}
              onValueChange={setVibration}
              trackColor={{ false: '#222', true: accentColor }}
              thumbColor="#fff"
            />
          </View>

          <View style={[styles.row, styles.rowBorder]}>
            <View>
              <Text style={styles.rowTitle}>PANTALLA ENCENDIDA</Text>
              <Text style={styles.rowSub}>Mantener activa</Text>
            </View>
            <Switch
              value={keepAwake}
              onValueChange={setKeepAwake}
              trackColor={{ false: '#222', true: accentColor }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <Text style={styles.sectionLabel}>APARIENCIA</Text>
        <View style={styles.card}>
          <Text style={styles.rowTitle}>COLOR</Text>
          <View style={styles.colorRow}>
            {colors.map(c => (
              <TouchableOpacity
                key={c}
                onPress={() => setAccentColor(c)}
                style={[
                  styles.colorDot,
                  { backgroundColor: c },
                  accentColor === c && styles.colorDotActive,
                ]}
              />
            ))}
          </View>
        </View>

      </ScrollView>

      <BottomNav accentColor={accentColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#0a0a0a' },
  scroll:         { flex: 1 },
  content:        { padding: 24, gap: 12 },
  screenTitle:    { color: '#f5f5f0', fontSize: 11, letterSpacing: 4, fontFamily: 'monospace', fontWeight: '700', marginBottom: 8 },
  sectionLabel:   { color: '#2a2a2a', fontSize: 8, letterSpacing: 3, fontFamily: 'monospace', marginBottom: 8, marginTop: 8 },
  card:           { backgroundColor: '#141414', borderWidth: 1, borderColor: '#1e1e1e', borderRadius: 4, padding: 16, gap: 12 },
  row:            { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowBorder:      { borderTopWidth: 1, borderTopColor: '#1a1a1a', paddingTop: 12 },
  rowTitle:       { color: '#f5f5f0', fontSize: 11, letterSpacing: 1, fontFamily: 'monospace' },
  rowSub:         { color: '#333', fontSize: 9, letterSpacing: 1, fontFamily: 'monospace', marginTop: 2 },
  colorRow:       { flexDirection: 'row', gap: 12, marginTop: 10, flexWrap: 'wrap' },
  colorDot:       { width: 28, height: 28, borderRadius: 14 },
  colorDotActive: { borderWidth: 2, borderColor: '#fff' },
});