import React from 'react';
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const COLORS = {
  amber: '#FFB400',
  blue: '#124F8C',
  white: '#FFFFFF',
};

function TabIcon({ label, active, compact = false }) {
  if (label === 'Início') {
    return (
      <View style={[styles.koalaBadge, compact && styles.compactKoalaBadge]}>
        <Image
          accessibilityLabel="Coala"
          resizeMode="contain"
          source={require('./assets/nav-koala.png')}
          style={[styles.koalaIcon, compact && styles.compactKoalaIcon]}
        />
      </View>
    );
  }

  const iconStyle = [
    styles.tabIconShape,
    compact && styles.compactTabIconShape,
    active && styles.activeTabIconShape,
  ];
  if (label === 'Buscar') {
    return (
      <View style={[styles.searchIcon, compact && styles.compactSearchIcon]}>
        <View style={iconStyle} />
        <View
          style={[
            styles.searchHandle,
            compact && styles.compactSearchHandle,
            active && styles.activeSearchHandle,
          ]}
        />
      </View>
    );
  }
  if (label === 'Pedidos') {
    return (
      <View
        style={[
          styles.receiptIcon,
          compact && styles.compactReceiptIcon,
          active && styles.activeReceiptIcon,
        ]}
      >
        <View style={[styles.receiptLine, compact && styles.compactReceiptLine, active && styles.activeReceiptLine]} />
        <View style={[styles.receiptLine, compact && styles.compactReceiptLine, active && styles.activeReceiptLine]} />
        <View style={[styles.receiptLine, compact && styles.compactReceiptLine, active && styles.activeReceiptLine]} />
      </View>
    );
  }
  return (
    <View style={[styles.profileIcon, compact && styles.compactProfileIcon]}>
      <View style={[styles.profileHead, compact && styles.compactProfileHead, active && styles.activeProfileIcon]} />
      <View style={[styles.profileBody, compact && styles.compactProfileBody, active && styles.activeProfileIcon]} />
    </View>
  );
}

export default function BottomNavigation({
  activeTab,
  bottomInset = 0,
  compact = false,
  onSelectTab,
}) {
  const compactWebNavigation = compact && Platform.OS === 'web';
  const displayedActiveTab = compactWebNavigation ? 'Pedidos' : activeTab;

  return (
    <View
      style={[
        styles.bottomNav,
        compactWebNavigation && styles.compactBottomNav,
        { paddingBottom: compactWebNavigation ? 2 : Math.max(bottomInset + 6, 14) },
      ]}
    >
      {[
        { label: 'Início' },
        { label: 'Buscar' },
        { label: 'Pedidos' },
        { label: 'Perfil' },
      ].map((tab) => {
        const active = displayedActiveTab === tab.label;
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            key={tab.label}
            onPress={() => onSelectTab(tab.label)}
            hitSlop={compactWebNavigation ? { top: 6, bottom: 6 } : undefined}
            style={[styles.tab, compactWebNavigation && styles.compactTab]}
          >
            <TabIcon active={active} compact={compactWebNavigation} label={tab.label} />
            <Text
              style={[
                styles.tabLabel,
                compactWebNavigation && styles.compactTabLabel,
                active && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
            {compactWebNavigation && active && (
              <View style={styles.compactActiveTabIndicator} />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    backgroundColor: COLORS.blue,
    flexDirection: 'row',
    justifyContent: 'space-around',
    minHeight: 68,
    paddingTop: 6,
  },
  compactBottomNav: {
    backgroundColor: '#0D4889',
    minHeight: 0,
    paddingTop: 1,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  compactTab: {
    paddingVertical: 0,
  },
  compactKoalaBadge: {
    height: 14,
    width: 26,
  },
  compactKoalaIcon: {
    height: 14,
    width: 26,
  },
  compactSearchIcon: {
    height: 14,
    width: 14,
  },
  compactTabIconShape: {
    borderRadius: 6,
    borderWidth: 1,
    height: 9,
    width: 9,
  },
  compactSearchHandle: {
    height: 1,
    left: 9,
    top: 9,
    width: 5,
  },
  compactReceiptIcon: {
    borderRadius: 2,
    borderWidth: 1,
    height: 14,
    paddingHorizontal: 1,
    width: 11,
  },
  compactReceiptLine: {
    height: 1,
    width: 5,
  },
  compactProfileIcon: {
    height: 14,
    width: 14,
  },
  compactProfileHead: {
    borderRadius: 3,
    borderWidth: 1,
    height: 5,
    marginBottom: 1,
    width: 5,
  },
  compactProfileBody: {
    borderWidth: 1,
    height: 6,
    width: 11,
  },
  compactTabLabel: {
    fontSize: 6,
    lineHeight: 7,
    marginTop: 1,
  },
  compactActiveTabIndicator: {
    backgroundColor: COLORS.amber,
    borderRadius: 1,
    height: 1.5,
    marginTop: 1,
    width: 10,
  },
  koalaBadge: {
    alignItems: 'center',
    height: 30,
    justifyContent: 'center',
    width: 46,
  },
  koalaIcon: {
    height: 30,
    width: 46,
  },
  searchIcon: {
    height: 25,
    justifyContent: 'flex-start',
    position: 'relative',
    width: 25,
  },
  tabIconShape: {
    borderColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 2,
    height: 17,
    width: 17,
  },
  activeTabIconShape: {
    borderColor: COLORS.amber,
  },
  searchHandle: {
    backgroundColor: COLORS.white,
    height: 2,
    left: 16,
    position: 'absolute',
    top: 17,
    transform: [{ rotate: '45deg' }],
    width: 8,
  },
  activeSearchHandle: {
    backgroundColor: COLORS.amber,
  },
  receiptIcon: {
    alignItems: 'center',
    borderColor: COLORS.white,
    borderRadius: 2,
    borderWidth: 2,
    height: 21,
    justifyContent: 'space-evenly',
    paddingHorizontal: 3,
    width: 17,
  },
  activeReceiptIcon: {
    borderColor: COLORS.amber,
  },
  receiptLine: {
    backgroundColor: COLORS.white,
    height: 1.5,
    width: 8,
  },
  activeReceiptLine: {
    backgroundColor: COLORS.amber,
  },
  profileIcon: {
    alignItems: 'center',
    height: 24,
    justifyContent: 'flex-end',
    width: 24,
  },
  profileHead: {
    borderColor: COLORS.white,
    borderRadius: 6,
    borderWidth: 2,
    height: 10,
    marginBottom: 2,
    width: 10,
  },
  profileBody: {
    borderColor: COLORS.white,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 2,
    height: 9,
    width: 17,
  },
  activeProfileIcon: {
    borderColor: COLORS.amber,
  },
  tabLabel: {
    color: COLORS.white,
    fontSize: 11,
    marginTop: 3,
  },
  activeTabText: {
    color: COLORS.amber,
  },
});
