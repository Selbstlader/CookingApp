import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface ReviewCardProps {
  recipeImage: string;
  recipeTitle: string;
  comment: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ recipeImage, recipeTitle, comment }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: recipeImage }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.recipeTitle} numberOfLines={1}>{recipeTitle}</Text>
        <Text style={styles.comment} numberOfLines={2}>{comment}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 14,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: 70,
    height: 70,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  recipeTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  comment: {
    fontSize: 13,
    color: '#666',
  },
});

export default ReviewCard; 