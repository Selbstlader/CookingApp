import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface RecipeCardProps {
  image: string;
  title: string;
  author: string;
  likes: number;
  reviews: number;
  onPress?: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ image, title, author, likes, reviews, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.author}>{author}</Text>
        <View style={styles.stats}>
          <Text style={styles.statText}>❤️ {likes}</Text>
          <Text style={styles.statText}> · 💬 {reviews}</Text>
        </View>
      </View>
    </TouchableOpacity>
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
    width: 90,
    height: 90,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  author: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 13,
    color: '#ff6b6b',
    marginRight: 8,
  },
});

export default RecipeCard; 