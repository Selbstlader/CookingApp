import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

type ReviewItemProps = {
  user: {
    name: string;
    avatar: string;
  };
  date: string;
  text: string;
  liked: boolean;
  onLikePress?: () => void;
};

const ReviewItem = ({ user, date, text, liked, onLikePress }: ReviewItemProps) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: user.avatar }} style={styles.avatar} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.username}>{user.name}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <Text style={styles.text}>{text}</Text>
      </View>
      <TouchableOpacity onPress={onLikePress} style={styles.likeButton}>
        <Feather 
          name={liked ? 'heart' : 'heart'} 
          size={20} 
          color={liked ? '#FF6B6B' : '#ddd'} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  date: {
    color: '#999',
    fontSize: 12,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  likeButton: {
    padding: 5,
  },
});

export default ReviewItem; 