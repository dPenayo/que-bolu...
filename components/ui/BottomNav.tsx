import { useRouter, usePathname } from 'expo-router';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  accentColor?: string;
};

export default function BottomNav({ accentColor = '#ff2020' }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const tabs = [
    { route: '/',         icon: 'home-outline'               },
    { route: '/history',  icon: 'time-outline'               },
    { route: '/settings', icon: 'settings-outline'           },
    { route: '/about',    icon: 'information-circle-outline' },
  ] as const;

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom, height: 52 + insets.bottom }]}>
      {tabs.map(({ route, icon }) => {
        const active = pathname === route || (route === '/' && pathname === '/index');
        return (
          <TouchableOpacity
            key={route}
            style={styles.btn}
            onPress={() => router.push(route)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={icon}
              size={24}
              color={active ? accentColor : '#3a3a3a'}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    width: '100%',
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: '#1e1e1e',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  btn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});