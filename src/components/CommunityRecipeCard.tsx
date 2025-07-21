import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

type CommunityRecipeCardProps = {
  title: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
  likes: number;
  reviews: number;
  video?: boolean;
  onPress: () => void;
};

const CommunityRecipeCard = ({
  title,
  image,
  author,
  likes,
  reviews,
  video,
  onPress,
}: CommunityRecipeCardProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} />
        {video && (
          <View style={styles.playButton}>
            <Feather name="play" size={20} color="#fff" />
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.authorContainer}>
          <Image source={{ uri: author.avatar }} style={styles.avatar} />
          <Text style={styles.authorName}>{author.name}</Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Feather name="heart" size={14} color="#FF6B6B" />
            <Text style={styles.statText}>{likes}</Text>
          </View>
          <View style={styles.statItem}>
            <Feather name="message-circle" size={14} color="#666" />
            <Text style={styles.statText}>{reviews} 评论</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.likeButton}>
        <Feather name="heart" size={22} color="#ddd" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  imageContainer: {
    width: 120,
    height: 90,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    paddingLeft: 15,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
  },
  authorName: {
    fontSize: 12,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  likeButton: {
    padding: 5,
    alignSelf: 'center',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -15 }],
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CommunityRecipeCard; 