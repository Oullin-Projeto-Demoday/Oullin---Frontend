import React from 'react';
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import BottomNavigation from './BottomNavigation';

const ORANGE = '#FF8500';
const AMBER = '#FFB400';

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
  bottomInset = 0,
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
      <BottomNavigation activeTab="Pedidos" bottomInset={bottomInset} onSelectTab={onSelectTab} />
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
});
