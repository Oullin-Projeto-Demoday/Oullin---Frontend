import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

function PreferenceGroup({ emptyLabel, title, values }) {
  return (
    <View>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.chips}>
        {values.length ? values.map((value) => (
          <Text key={value} style={styles.chip}>{value}</Text>
        )) : (
          <Text style={styles.emptyLabel}>{emptyLabel}</Text>
        )}
      </View>
    </View>
  );
}

export default function ProfileScreen({ user = {}, selections = {} }) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Seu nome';
  const email = user.email || 'E-mail não informado';
  const restrictions = Array.isArray(selections.restrictions) ? selections.restrictions : [];
  const preferences = [
    ...(Array.isArray(selections.favoriteFoods) ? selections.favoriteFoods : []),
    ...(Array.isArray(selections.dailyMeals) ? selections.dailyMeals : []),
  ];

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <View
            accessibilityLabel="Avatar neutro"
            accessibilityRole="image"
            accessible
            style={styles.avatar}
          >
            <View style={styles.avatarHead} />
            <View style={styles.avatarBody} />
          </View>
          <View style={styles.userInfo}>
            <Text numberOfLines={1} style={styles.userName}>{fullName}</Text>
            <Text numberOfLines={1} style={styles.userEmail}>{email}</Text>
          </View>
        </View>

        <View style={styles.preferencesCard}>
          <PreferenceGroup
            emptyLabel="Nenhuma restrição selecionada"
            title="O que preciso evitar"
            values={restrictions}
          />
          <View style={styles.foodGroup}>
            <PreferenceGroup
              emptyLabel="Nenhuma preferência selecionada"
              title="O que eu gosto de comer"
              values={preferences}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingBottom: 16,
    paddingHorizontal: 10,
    paddingTop: 16,
  },
  profileHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 76,
    paddingHorizontal: 2,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#FFE7B0',
    borderRadius: 30,
    height: 60,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    width: 60,
  },
  avatarHead: {
    backgroundColor: '#FFB703',
    borderRadius: 10,
    height: 18,
    marginBottom: 4,
    width: 18,
  },
  avatarBody: {
    backgroundColor: '#FFB703',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 17,
    width: 36,
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    color: '#111111',
    fontSize: 14,
    fontWeight: '700',
  },
  userEmail: {
    color: '#111111',
    fontSize: 10,
    marginTop: 3,
  },
  preferencesCard: {
    backgroundColor: '#F3F3F3',
    borderRadius: 10,
    marginTop: 8,
    paddingHorizontal: 11,
    paddingVertical: 11,
  },
  groupTitle: {
    color: '#111111',
    fontSize: 13,
    fontWeight: '700',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 7,
  },
  chip: {
    backgroundColor: '#FFB400',
    borderRadius: 14,
    color: '#FFFFFF',
    fontSize: 9,
    marginBottom: 5,
    marginRight: 5,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  emptyLabel: {
    color: '#666666',
    fontSize: 10,
    marginBottom: 5,
  },
  foodGroup: {
    marginTop: 17,
  },
});
