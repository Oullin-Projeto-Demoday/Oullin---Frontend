import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const COLORS = {
  blue: '#1189E8',
  orange: '#FFB400',
  text: '#111111',
  muted: '#737373',
  white: '#FFFFFF',
};

const RESTRICTION_LABELS = [
  ['amendoim', 'Amendoim'],
  ['castanhas', 'Castanhas'],
  ['proteina do leite', 'Leite'],
  ['lactose', 'Leite'],
  ['frutos do mar', 'Camarão'],
  ['ovos', 'Ovo'],
  ['soja', 'Soja'],
  ['gluten', 'Glúten'],
  ['celiaca', 'Glúten'],
  ['sodio', 'Sódio'],
  ['kosher', 'Kosher'],
  ['halal', 'Halal'],
  ['vegetarianismo', 'Carne'],
  ['veganismo', 'Origem animal'],
];

const FOOD_LABELS = [
  ['pao', 'Pão'],
  ['pizza', 'Pizza'],
  ['bolo', 'Bolo'],
  ['salgadinho', 'Salgadinhos'],
  ['chocolate', 'Chocolate'],
  ['massa', 'Massa'],
  ['sorvete', 'Sorvete'],
  ['molho', 'Molho'],
  ['bolacha', 'Bolacha'],
  ['hamburguer', 'Hambúrguer'],
  ['japonesa', 'Comida japonesa'],
  ['sobremesas', 'Sobremesas'],
  ['cerveja', 'Cerveja'],
  ['queijo', 'Queijo'],
  ['iogurte', 'Iogurte'],
  ['congelados', 'Congelados'],
];

function normalize(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR');
}

function shortenSelection(value, mappings) {
  const normalized = normalize(value);
  return mappings.find(([part]) => normalized.includes(part))?.[1] || value;
}

function getRestrictionLabels(value) {
  const normalized = normalize(value);
  if (normalized.includes('amendoim') && normalized.includes('castanhas')) {
    return ['Amendoim', 'Castanhas'];
  }
  return [shortenSelection(value, RESTRICTION_LABELS)];
}

function ProfileTag({ children }) {
  return (
    <View style={styles.tag}>
      <Text numberOfLines={1} style={styles.tagText}>{children}</Text>
    </View>
  );
}

function ProfileSection({ title, values, emptyText }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {values.length ? (
        <View style={styles.tags}>
          {values.map((value, index) => (
            <ProfileTag key={`${value}-${index}`}>{value}</ProfileTag>
          ))}
        </View>
      ) : (
        <Text style={styles.emptyValue}>{emptyText}</Text>
      )}
    </View>
  );
}

export default function ProfileScreen({ user = {}, address, selections = {} }) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Seu nome';
  const avoidFoods = [...new Set((selections.restrictions || []).flatMap(getRestrictionLabels))];
  const favoriteFoods = [...new Set((selections.favoriteFoods || []).map((value) =>
    shortenSelection(value, FOOD_LABELS),
  ))];
  const foodsToEat = [...new Set([...favoriteFoods, ...(selections.dailyMeals || [])])];

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarRing}>
            <Image
              accessibilityLabel="Mascote do perfil"
              resizeMode="contain"
              source={require('./assets/mascote-loading.png')}
              style={styles.avatarImage}
            />
          </View>
          <View style={styles.userInfo}>
            <Text numberOfLines={2} style={styles.userName}>{fullName}</Text>
            {!!user.email && <Text numberOfLines={1} style={styles.userEmail}>{user.email}</Text>}
          </View>
        </View>

        <View style={styles.locationSection}>
          <Text style={styles.sectionTitle}>Localização</Text>
          {address ? (
            <View style={styles.addressInfo}>
              <Text style={styles.addressLine}>
                {[address.street, address.number].filter(Boolean).join(' ')}
              </Text>
              <Text style={styles.addressLine}>
                {[address.state, address.city].filter(Boolean).join(' ')}
              </Text>
              {!!address.complement && (
                <Text style={styles.addressLine}>Complemento: {address.complement}</Text>
              )}
              {!!address.neighborhood && (
                <Text style={styles.addressLine}>Bairro: {address.neighborhood}</Text>
              )}
              {!!address.postalCode && <Text style={styles.addressLine}>CEP {address.postalCode}</Text>}
            </View>
          ) : (
            <Text style={styles.emptyValue}>Nenhum endereço cadastrado.</Text>
          )}
        </View>

        <ProfileSection
          emptyText="Nenhuma restrição informada."
          title="O que você deve evitar consumir"
          values={avoidFoods}
        />
        <ProfileSection
          emptyText="Nenhuma preferência informada."
          title="O que você pode comer"
          values={foodsToEat}
        />
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
    paddingBottom: 24,
    paddingHorizontal: 12,
    paddingTop: 38,
  },
  profileHeader: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  avatarRing: {
    alignItems: 'center',
    borderColor: COLORS.blue,
    borderRadius: 50,
    borderWidth: 3,
    height: 104,
    justifyContent: 'center',
    width: 104,
  },
  avatarImage: {
    height: 90,
    width: 90,
  },
  userInfo: {
    flex: 1,
    marginLeft: 6,
  },
  userName: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
  },
  userEmail: {
    color: COLORS.text,
    fontSize: 12,
    marginTop: 6,
  },
  locationSection: {
    marginTop: 66,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: '700',
    lineHeight: 24,
  },
  addressInfo: {
    marginTop: 9,
  },
  addressLine: {
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 16,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 7,
    rowGap: 8,
    marginTop: 15,
    paddingHorizontal: 6,
  },
  tag: {
    alignItems: 'center',
    backgroundColor: COLORS.orange,
    borderRadius: 14,
    height: 22,
    justifyContent: 'center',
    paddingHorizontal: 3,
    width: 79,
  },
  tagText: {
    color: COLORS.white,
    fontSize: 10,
  },
  emptyValue: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 8,
  },
});
