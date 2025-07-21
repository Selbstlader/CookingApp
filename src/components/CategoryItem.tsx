import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

type CategoryItemProps = {
  name: string;
  icon: string;
  onPress: () => void;
};

const CategoryItem = ({ name, icon, onPress }: CategoryItemProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: icon }} style={styles.icon} />
      <Text style={styles.name}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 10,
    width: 60,
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  name: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
});

export default CategoryItem; 