import React from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const ORANGE = '#FF8500';
const AMBER = '#FFB400';
const BLUE = '#124F8C';

function BottomNavigation({ onSelectTab }) {
  return (
    <View style={styles.bottomNav}>
      {[
        ['Início', 'Início'],
        ['Buscar', 'Buscar'],
        ['Pedidos', 'Pedidos'],
        ['Perfil', 'Perfil'],
      ].map(([icon, label]) => (
        <Pressable accessibilityRole="button" key={label} onPress={() => onSelectTab?.(label)} style={styles.tab}>
          {label === 'Início' ? (
            <Image source={require('./assets/nav-koala.png')} resizeMode="contain" style={styles.koalaIcon} />
          ) : label === 'Buscar' ? (
            <View style={styles.searchIcon}><View style={styles.searchLens} /><View style={styles.searchHandle} /></View>
          ) : label === 'Pedidos' ? (
            <View style={styles.receiptIcon}><View style={styles.receiptLine} /><View style={styles.receiptLine} /><View style={styles.receiptLine} /></View>
          ) : (
            <View style={styles.profileIcon}><View style={styles.profileHead} /><View style={styles.profileBody} /></View>
          )}
          <Text style={[styles.tabLabel, label === 'Pedidos' && styles.activeTab]}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function OrderItem({ item, last }) {
  const price = `R$ ${(item.priceCents / 100).toFixed(2).replace('.', ',')}`;

  return (
    <View style={[styles.itemRow, last && styles.lastItemRow]}>
      <Text style={styles.quantity}>{item.quantity}x</Text>
      <View style={styles.itemCopy}>
        <Text style={styles.itemName}>{item.name}</Text>
        {!!item.description && (
          <Text style={styles.itemDescription}>{item.description}</Text>
        )}
      </View>
      <Text style={styles.itemPrice}>{price}</Text>
    </View>
  );
}

export default function OrderSummaryScreen({
  items = [],
  onBack,
  onFinishPayment,
  onSelectTab,
}) {
  const totalCents = items.reduce(
    (total, item) => total + item.priceCents * item.quantity,
    0,
  );
  const total = `R$ ${(totalCents / 100).toFixed(2).replace('.', ',')}`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={ORANGE} barStyle="light-content" />
      <View style={styles.header}>
        <Pressable accessibilityLabel="Voltar" accessibilityRole="button" onPress={onBack} style={styles.backButton}>
          <Text style={styles.backArrow}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Resumo do Pedido</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.orderCard}>
          {items.map((item, index) => (
            <OrderItem
              item={item}
              key={item.id}
              last={index === items.length - 1}
            />
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>{total}</Text>
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.securityNote}>
            Versão demonstrativa: o pagamento ainda não foi processado.
          </Text>
          <Pressable accessibilityRole="button" onPress={onFinishPayment} style={({ pressed }) => [styles.payButton, pressed && styles.pressed]}>
            <Text style={styles.check}>✓</Text>
            <Text style={styles.payButtonText}>Finalizar pagamento</Text>
          </Pressable>
        </View>
      </View>
      <BottomNavigation onSelectTab={onSelectTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { height: 68, alignItems: 'center', flexDirection: 'row', backgroundColor: ORANGE, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 },
  backButton: { width: 56, height: '100%', justifyContent: 'center', paddingLeft: 19 },
  backArrow: { color: '#FFFFFF', fontSize: 37, lineHeight: 40, fontWeight: '300' },
  headerTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', flex: 1, textAlign: 'center' },
  headerSpacer: { width: 56 },
  content: { flex: 1, paddingHorizontal: 23, paddingTop: 10 },
  orderCard: { flex: 1, borderColor: '#555555', borderWidth: 1, borderRadius: 14, overflow: 'hidden' },
  itemRow: { minHeight: 54, flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 10, paddingTop: 6, borderBottomWidth: 1, borderBottomColor: '#777777' },
  lastItemRow: { borderBottomWidth: 1 },
  quantity: { color: '#111111', fontSize: 9, fontWeight: '700', width: 23, paddingTop: 1 },
  itemCopy: { flex: 1 },
  itemName: { color: '#171717', fontSize: 9, fontWeight: '700' },
  itemDescription: { color: '#888888', fontSize: 8, marginTop: 6 },
  itemPrice: { color: '#222222', fontSize: 8, marginLeft: 7, marginTop: 5 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 9 },
  totalLabel: { color: '#171717', fontSize: 9, fontWeight: '700' },
  totalAmount: { color: '#171717', fontSize: 9, fontWeight: '700' },
  footer: { paddingTop: 45, paddingBottom: 2 },
  securityNote: { color: '#888888', fontSize: 7, lineHeight: 10, marginBottom: 7 },
  payButton: { height: 25, borderRadius: 15, backgroundColor: AMBER, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  check: { color: '#09A847', fontSize: 16, marginRight: 17, fontWeight: '700' },
  payButtonText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  pressed: { opacity: 0.78 },
  bottomNav: { height: 46, backgroundColor: BLUE, flexDirection: 'row', justifyContent: 'space-around' },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  koalaIcon: { width: 28, height: 21, marginBottom: 1 },
  searchIcon: { width: 21, height: 21, position: 'relative' },
  searchLens: { position: 'absolute', left: 1, top: 0, width: 14, height: 14, borderRadius: 8, borderWidth: 2, borderColor: '#FFFFFF' },
  searchHandle: { position: 'absolute', left: 14, top: 13, width: 2, height: 8, backgroundColor: '#FFFFFF', transform: [{ rotate: '-45deg' }] },
  receiptIcon: { alignItems: 'center', borderColor: AMBER, borderRadius: 2, borderWidth: 2, height: 19, justifyContent: 'space-evenly', paddingHorizontal: 3, width: 15 },
  receiptLine: { backgroundColor: AMBER, height: 1.5, width: 7 },
  profileIcon: { alignItems: 'center', height: 21, justifyContent: 'flex-end', width: 21 },
  profileHead: { borderColor: '#FFFFFF', borderRadius: 6, borderWidth: 2, height: 9, marginBottom: 2, width: 9 },
  profileBody: { borderColor: '#FFFFFF', borderTopLeftRadius: 8, borderTopRightRadius: 8, borderWidth: 2, height: 8, width: 16 },
  tabLabel: { color: '#FFFFFF', fontSize: 7, marginTop: 1 },
  activeTab: { color: AMBER },
});
