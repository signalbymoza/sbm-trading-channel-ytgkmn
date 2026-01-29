
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';

export interface TabBarItem {
  name: string;
  route: string;
  icon: string;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
}

export default function FloatingTabBar({ tabs }: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const isTabActive = (tabRoute: string) => {
    const normalizedPathname = pathname.endsWith('/') ? pathname : `${pathname}/`;
    const normalizedTabRoute = tabRoute.endsWith('/') ? tabRoute : `${tabRoute}/`;
    return normalizedPathname === normalizedTabRoute || normalizedPathname.startsWith(normalizedTabRoute);
  };

  const handleTabPress = (route: string) => {
    console.log('FloatingTabBar: Navigating to', route);
    router.push(route);
  };

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingBottom: Math.max(insets.bottom, 16),
      paddingTop: 12,
      paddingHorizontal: 20,
      backgroundColor: 'transparent',
      pointerEvents: 'box-none',
    },
    tabBar: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderRadius: 25,
      paddingVertical: 12,
      paddingHorizontal: 8,
      justifyContent: 'space-around',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    tabButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
    },
    activeTabButton: {
      backgroundColor: colors.primary,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = isTabActive(tab.route);
          const iconColor = isActive ? '#FFFFFF' : colors.text;

          return (
            <TouchableOpacity
              key={tab.name}
              style={[styles.tabButton, isActive && styles.activeTabButton]}
              onPress={() => handleTabPress(tab.route)}
              activeOpacity={0.7}
            >
              <IconSymbol
                ios_icon_name={tab.icon}
                android_material_icon_name={tab.icon}
                size={24}
                color={iconColor}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
