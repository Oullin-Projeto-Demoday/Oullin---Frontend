import React from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const COLORS = {
  amber: '#FFB400',
  avatar: '#D9D9D9',
  text: '#111111',
  white: '#FFFFFF',
};

const MENU_ITEMS = [
  {
    id: 'info',
    label: 'Informações do\nperfil',
    icon: require('./assets/profile-info.png'),
  },
  {
    id: 'coupons',
    label: 'Cupons',
    icon: require('./assets/profile-coupons.png'),
  },
  {
    id: 'payment',
    label: 'Métodos de\npagamento',
    icon: require('./assets/profile-payment-methods.png'),
  },
  {
    id: 'settings',
    label: 'Configurações',
    icon: require('./assets/profile-settings.png'),
  },
  {
    id: 'support',
    label: 'Ajuda e\nsuporte',
    icon: require('./assets/profile-support.png'),
  },
  {
    id: 'logout',
    label: 'Sair',
    icon: require('./assets/profile-logout.png'),
  },
];

function ProfileMenuItem({ item, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
    >
      <Image accessible={false} resizeMode="contain" source={item.icon} style={styles.menuIcon} />
      <Text style={styles.menuLabel}>{item.label}</Text>
    </Pressable>
  );
}

export default function ProfileScreen({
  user = {},
  address,
  selections = {},
  onLogout,
}) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Seu nome';
  const email = user.email || 'E-mail não informado';

  function showProfileInformation() {
    const addressLine = address
      ? [
        address.street,
        address.number,
        address.complement,
        address.neighborhood,
        address.city,
        address.state,
        address.postalCode,
      ].filter(Boolean).join(', ')
      : 'Não cadastrado';
    const restrictions = selections.restrictions?.join(', ') || 'Não informado';
    const preferences = [
      ...(selections.favoriteFoods || []),
      ...(selections.dailyMeals || []),
    ].join(', ') || 'Não informadas';

    Alert.alert(
      'Informações do perfil',
      `Nome: ${fullName}\nE-mail: ${email}\nEndereço: ${addressLine}\nA evitar: ${restrictions}\nPreferências: ${preferences}`,
    );
  }

  function handleMenuItem(item) {
    if (item.id === 'info') {
      showProfileInformation();
      return;
    }

    if (item.id === 'logout') {
      if (onLogout) onLogout();
      return;
    }

    const messages = {
      coupons: 'Nenhum cupom disponível no momento.',
      payment: 'Nenhum método de pagamento cadastrado.',
      settings: 'As configurações ainda não estão disponíveis.',
      support: 'A área de ajuda e suporte ainda não está disponível.',
    };
    Alert.alert(item.label, messages[item.id]);
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View
            accessibilityLabel="Foto de perfil"
            accessible
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text numberOfLines={1} style={styles.userName}>{fullName}</Text>
            <Text numberOfLines={1} style={styles.userEmail}>{email}</Text>
          </View>
        </View>

        <View style={styles.menu}>
          {MENU_ITEMS.map((item) => (
            <ProfileMenuItem
              item={item}
              key={item.id}
              onPress={() => handleMenuItem(item)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  profileCard: {
    alignItems: 'center',
    borderColor: COLORS.amber,
    borderRadius: 11,
    borderWidth: 1,
    flexDirection: 'row',
    height: 124,
    paddingHorizontal: 12,
  },
  avatar: {
    backgroundColor: COLORS.avatar,
    borderRadius: 15,
    height: 30,
    width: 30,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
  },
  userEmail: {
    color: COLORS.text,
    fontSize: 9,
    marginTop: 2,
  },
  menu: {
    marginTop: 10,
  },
  menuItem: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 59,
    paddingHorizontal: 10,
  },
  menuIcon: {
    height: 26,
    marginRight: 16,
    width: 26,
  },
  menuLabel: {
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 16,
    maxWidth: 145,
  },
  pressed: {
    opacity: 0.65,
  },
});
