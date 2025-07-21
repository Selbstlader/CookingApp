import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface TabSwitcherProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
          onPress={() => onTabChange(tab)}
        >
          <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 24,
    marginVertical: 16,
    alignSelf: 'center',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 28,
    borderRadius: 24,
    backgroundColor: '#fff',
  },
  activeTab: {
    backgroundColor: '#ff6b6b',
  },
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default TabSwitcher; 