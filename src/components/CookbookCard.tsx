import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

type CookbookCardProps = {
  title: string;
  description: string;
  image: string;
  likes: number;
  recipesCount: number;
  onPress: () => void;
};

const CookbookCard = ({
  title,
  description,
  image,
  likes,
  recipesCount,
  onPress,
}: CookbookCardProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.overlay}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <View style={styles.statsContainer}>
            <Text style={styles.stats}>{likes.toLocaleString()} 点赞</Text>
            <Text style={styles.stats}>{recipesCount} 食谱</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 180,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
  },
  contentContainer: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  description: {
    fontSize: 14,
    color: '#f0f0f0',
    marginVertical: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  stats: {
    fontSize: 12,
    color: '#fff',
    marginRight: 15,
  },
});

export default CookbookCard; 