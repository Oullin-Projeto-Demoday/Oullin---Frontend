import React from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

const COLORS = {
  orange: '#FF8500',
  amber: '#FFB400',
  blue: '#124F8C',
  text: '#171717',
  muted: '#8A8A8A',
  border: '#E4E4E4',
  white: '#FFFFFF',
};

export const INITIAL_CART_ITEMS = [
  {
    id: 'cart-fries',
    name: 'Batata Frita',
    priceCents: 1000,
    quantity: 1,
    image: require('./assets/cart-fries.png'),
  },
  {
    id: 'cart-veggie-pizza',
    name: 'Pizza vegetariana',
    priceCents: 5200,
    quantity: 1,
    image: require('./assets/cart-pizza.png'),
  },
];

const DELIVERY_CENTS = 1099;
const SERVICE_CENTS = 399;

function formatPrice(cents) {
  return `R$${(cents / 100).toFixed(2).replace('.', ',')}`;
}

function CartText({ size = 12, style, ...props }) {
  const { width } = useWindowDimensions();
  const scale = Math.min(Math.max(width / 360, 0.92), 1.15);
  return <Text {...props} style={[style, { fontSize: size * scale }]} />;
}

function PaymentIcon() {
  return (
    <View style={styles.paymentIcon}>
      <View style={styles.paymentCardStripe} />
      <View style={styles.paymentCardLine} />
      <View style={styles.paymentPlusHorizontal} />
      <View style={styles.paymentPlusVertical} />
    </View>
  );
}

function CartItem({ item, onChangeQuantity, onRemove }) {
  return (
    <View style={styles.itemCard}>
      <Image accessibilityLabel={item.name} source={item.image} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <CartText numberOfLines={1} size={12} style={styles.itemName}>{item.name}</CartText>
        <CartText size={12} style={styles.itemPrice}>{formatPrice(item.priceCents)}</CartText>
        <View style={styles.quantityControl}>
          <Pressable
            accessibilityLabel={`Diminuir ${item.name}`}
            accessibilityRole="button"
            onPress={() => onChangeQuantity(item.id, -1)}
            style={styles.quantityButton}
          >
            <CartText size={14} style={styles.quantitySymbol}>−</CartText>
          </Pressable>
          <CartText size={11} style={styles.quantityValue}>{item.quantity}</CartText>
          <Pressable
            accessibilityLabel={`Aumentar ${item.name}`}
            accessibilityRole="button"
            onPress={() => onChangeQuantity(item.id, 1)}
            style={styles.quantityButton}
          >
            <CartText size={14} style={styles.quantitySymbol}>+</CartText>
          </Pressable>
        </View>
      </View>
      <Pressable
        accessibilityLabel={`Remover ${item.name} do carrinho`}
        accessibilityRole="button"
        onPress={() => onRemove(item.id)}
        style={styles.removeButton}
      >
        <Image source={require('./assets/cart-trash.png')} style={styles.removeIcon} />
      </Pressable>
    </View>
  );
}

export default function CartScreen({ items, onItemsChange, onBack, onAddItems }) {
  const subtotal = items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
  const total = subtotal + (items.length ? DELIVERY_CENTS + SERVICE_CENTS : 0);

  function changeQuantity(id, amount) {
    onItemsChange((current) => current.flatMap((item) => {
      if (item.id !== id) return [item];
      const quantity = item.quantity + amount;
      return quantity > 0 ? [{ ...item, quantity }] : [];
    }));
  }

  function removeItem(id) {
    onItemsChange((current) => current.filter((item) => item.id !== id));
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
          <Text style={styles.backArrow}>‹</Text>
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
                onRemove={removeItem}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <CartText size={16} style={styles.emptyTitle}>Seu carrinho está vazio</CartText>
            <CartText size={12} style={styles.emptyDescription}>Adicione pratos para continuar.</CartText>
          </View>
        )}

        <Pressable
          accessibilityRole="button"
          onPress={onAddItems}
          style={styles.addMoreButton}
        >
          <Image source={require('./assets/cart-add.png')} style={styles.addMoreIcon} />
          <CartText size={11} style={styles.addMoreText}>Adicionar mais itens</CartText>
        </Pressable>

        {!!items.length && (
          <View style={styles.summary}>
            <SummaryLine label="Subtotal" value={formatPrice(subtotal)} />
            <SummaryLine label="Entrega" value={formatPrice(DELIVERY_CENTS)} />
            <SummaryLine label="Taxa de serviço" value={formatPrice(SERVICE_CENTS)} />
            <View style={styles.summaryDivider} />
            <SummaryLine label="Total" value={formatPrice(total)} total />
            <CartText size={8} style={styles.summaryNote}>
              Confira ingredientes e possíveis alérgenos antes de finalizar.
            </CartText>
          </View>
        )}
      </ScrollView>

      {!!items.length && (
        <View style={styles.footer}>
          <Pressable
            accessibilityRole="button"
            onPress={() => Alert.alert('Pagamento', 'A etapa de pagamento será disponibilizada em breve.')}
            style={({ pressed }) => [styles.checkoutButton, pressed && styles.pressed]}
          >
            <PaymentIcon />
            <CartText size={13} style={styles.checkoutText}>Continuar para o pagamento</CartText>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function SummaryLine({ label, value, total = false }) {
  return (
    <View style={styles.summaryLine}>
      <CartText size={total ? 13 : 11} style={[styles.summaryLabel, total && styles.summaryTotal]}>
        {label}
      </CartText>
      <CartText size={total ? 13 : 11} style={[styles.summaryValue, total && styles.summaryTotal]}>
        {value}
      </CartText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 54,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: 40,
  },
  backArrow: {
    color: COLORS.orange,
    fontSize: 32,
    lineHeight: 36,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flexGrow: 1,
    paddingLeft: 10,
    paddingRight: 15,
    paddingBottom: 12,
  },
  itemsList: {
    paddingTop: 14,
  },
  itemCard: {
    alignItems: 'center',
    borderColor: COLORS.amber,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    height: 80,
    marginBottom: 8,
    paddingHorizontal: 7,
    paddingVertical: 6,
  },
  itemImage: {
    borderRadius: 7,
    height: 66,
    width: 66,
  },
  itemInfo: {
    alignSelf: 'stretch',
    flex: 1,
    justifyContent: 'space-between',
    marginLeft: 7,
    paddingVertical: 2,
  },
  itemName: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '700',
  },
  itemPrice: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '600',
  },
  quantityControl: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.orange,
    borderRadius: 12,
    flexDirection: 'row',
    height: 18,
    justifyContent: 'space-between',
    minWidth: 62,
  },
  quantityButton: {
    alignItems: 'center',
    height: 20,
    justifyContent: 'center',
    width: 18,
  },
  quantitySymbol: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 18,
  },
  quantityValue: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  removeButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    height: 24,
    justifyContent: 'center',
    marginLeft: 5,
    width: 16,
  },
  removeIcon: {
    height: 16,
    width: 16,
  },
  addMoreButton: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 11,
    minHeight: 30,
    paddingLeft: 32,
  },
  addMoreIcon: {
    height: 18,
    marginRight: 27,
    width: 18,
  },
  addMoreText: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '600',
  },
  summary: {
    marginTop: 34,
    paddingLeft: 12,
    paddingRight: 16,
  },
  summaryLine: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 19,
  },
  summaryLabel: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '600',
  },
  summaryValue: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: '700',
  },
  summaryDivider: {
    backgroundColor: COLORS.amber,
    height: StyleSheet.hairlineWidth,
    marginVertical: 4,
  },
  summaryTotal: {
    color: '#4B1E4B',
    fontSize: 12,
    fontWeight: '700',
  },
  summaryNote: {
    color: COLORS.muted,
    fontSize: 8,
    marginTop: 8,
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
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 7,
  },
  footer: {
    backgroundColor: COLORS.white,
    paddingBottom: 32,
    paddingHorizontal: 13,
    paddingTop: 8,
  },
  checkoutButton: {
    alignItems: 'center',
    backgroundColor: COLORS.orange,
    borderRadius: 18,
    flexDirection: 'row',
    height: 36,
    justifyContent: 'center',
  },
  checkoutText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 10,
  },
  paymentIcon: {
    borderColor: COLORS.white,
    borderRadius: 2,
    borderWidth: 1.3,
    height: 14,
    position: 'relative',
    width: 19,
  },
  paymentCardStripe: {
    backgroundColor: COLORS.white,
    height: 2,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 3,
  },
  paymentCardLine: {
    backgroundColor: COLORS.white,
    bottom: 2,
    height: 1,
    left: 3,
    position: 'absolute',
    width: 5,
  },
  paymentPlusHorizontal: {
    backgroundColor: COLORS.white,
    height: 1.5,
    position: 'absolute',
    right: -4,
    top: 8,
    width: 7,
  },
  paymentPlusVertical: {
    backgroundColor: COLORS.white,
    height: 7,
    position: 'absolute',
    right: -1.2,
    top: 5.2,
    width: 1.5,
  },
  pressed: {
    opacity: 0.84,
  },
});
