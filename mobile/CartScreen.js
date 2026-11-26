import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

const COLORS = {
  amber: '#FFB400',
  background: '#F2F2F2',
  text: '#171717',
  white: '#FFFFFF',
};

function formatPrice(cents) {
  return `R$${(cents / 100).toFixed(2).replace('.', ',')}`;
}

function formatTotal(cents) {
  const amount = (cents / 100).toFixed(2).replace('.', ',').replace(/,00$/, '');
  return `R$ ${amount}`;
}

function CartText({ size = 12, style, ...props }) {
  const { width } = useWindowDimensions();
  const scale = Math.min(Math.max(width / 360, 0.92), 1.15);
  return <Text {...props} style={[style, { fontSize: size * scale }]} />;
}

function CartItem({ item, onChangeQuantity }) {
  return (
    <View style={styles.itemCard}>
      <Image
        accessibilityLabel={item.name}
        source={item.image}
        style={styles.itemImage}
        resizeMode="cover"
      />
      <View style={styles.itemInfo}>
        <CartText numberOfLines={1} size={11} style={styles.itemName}>{item.name}</CartText>
        <CartText size={12} style={styles.itemPrice}>{formatPrice(item.priceCents)}</CartText>
      </View>
      <View style={styles.quantityControl}>
        <Pressable
          accessibilityLabel={`Diminuir ${item.name}`}
          accessibilityRole="button"
          onPress={() => onChangeQuantity(item.id, -1)}
          style={styles.decreaseButton}
        >
          <CartText size={14} style={styles.decreaseSymbol}>−</CartText>
        </Pressable>
        <CartText size={11} style={styles.quantityValue}>{item.quantity}</CartText>
        <Pressable
          accessibilityLabel={`Aumentar ${item.name}`}
          accessibilityRole="button"
          onPress={() => onChangeQuantity(item.id, 1)}
          style={styles.increaseButton}
        >
          <CartText size={14} style={styles.increaseSymbol}>+</CartText>
        </Pressable>
      </View>
    </View>
  );
}

export default function CartScreen({ items, onItemsChange, onBack, onContinueDelivery }) {
  const subtotal = items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);

  function changeQuantity(id, amount) {
    onItemsChange((current) => current.flatMap((item) => {
      if (item.id !== id) return [item];
      const quantity = item.quantity + amount;
      return quantity > 0 ? [{ ...item, quantity }] : [];
    }));
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Voltar para o início"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onBack}
          style={styles.backButton}
        >
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <CartText size={16} style={styles.headerTitle}>Meu carrinho</CartText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {items.length ? (
          <View style={styles.itemsList}>
            {items.map((item) => (
              <CartItem
                item={item}
                key={item.id}
                onChangeQuantity={changeQuantity}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <CartText size={16} style={styles.emptyTitle}>Seu carrinho está vazio</CartText>
            <CartText size={12} style={styles.emptyDescription}>Adicione pratos para continuar.</CartText>
          </View>
        )}
      </ScrollView>

      {!!items.length && (
        <View style={styles.footer}>
          <View style={styles.totalBar}>
            <SummaryLine label="Total" value={formatTotal(subtotal)} total />
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={onContinueDelivery}
            style={({ pressed }) => [styles.checkoutButton, pressed && styles.pressed]}
          >
            <CartText size={16} style={styles.checkoutText}>Ir para entrega</CartText>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function SummaryLine({ label, value, total = false }) {
  return (
    <View style={styles.summaryLine}>
      <CartText size={total ? 18 : 11} style={[styles.summaryLabel, total && styles.summaryTotal]}>
        {label}
      </CartText>
      <CartText size={total ? 18 : 11} style={[styles.summaryValue, total && styles.summaryTotal]}>
        {value}
      </CartText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    flexDirection: 'row',
    height: 76,
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
  },
  backArrow: {
    color: COLORS.amber,
    fontSize: 24,
    lineHeight: 28,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 30,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingTop: 24,
    paddingBottom: 12,
  },
  itemsList: {
    width: '100%',
  },
  itemCard: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 5,
    flexDirection: 'row',
    height: 94,
    marginBottom: 12,
    paddingHorizontal: 8,
    paddingVertical: 7,
  },
  itemImage: {
    borderRadius: 4,
    height: 78,
    width: 78,
  },
  itemInfo: {
    flex: 1,
    alignSelf: 'flex-start',
    marginLeft: 12,
    paddingTop: 3,
  },
  itemName: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: '400',
  },
  itemPrice: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  quantityControl: {
    alignItems: 'center',
    height: 72,
    justifyContent: 'space-between',
    marginRight: 5,
    width: 22,
  },
  decreaseButton: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: COLORS.amber,
    borderRadius: 10,
    borderWidth: 1,
    height: 18,
    justifyContent: 'center',
    width: 18,
  },
  decreaseSymbol: {
    color: COLORS.amber,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 16,
  },
  increaseButton: {
    alignItems: 'center',
    backgroundColor: COLORS.amber,
    borderRadius: 10,
    height: 18,
    justifyContent: 'center',
    width: 18,
  },
  increaseSymbol: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 16,
  },
  quantityValue: {
    color: COLORS.text,
    fontSize: 11,
  },
  summaryLine: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  summaryLabel: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
  },
  summaryTotal: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
  },
  summaryValue: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyDescription: {
    color: '#8A8A8A',
    fontSize: 12,
    marginTop: 7,
  },
  footer: {
    backgroundColor: COLORS.white,
    paddingBottom: 8,
  },
  totalBar: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  checkoutButton: {
    alignItems: 'center',
    backgroundColor: COLORS.amber,
    borderRadius: 5,
    height: 44,
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  checkoutText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
    marginBottom: 0,
  },
  pressed: {
    opacity: 0.84,
  },
});
