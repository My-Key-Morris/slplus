import React from 'react';
import { View, Text } from 'react-native';

const ModifyPairsScreen = ({ listData1, listData2 }) => {
  return (
    <View>
      {listData1.map((item) => (
        <Text key={item.key}>{item.text}</Text>
      ))}
      {listData2.map((item) => (
        <Text key={item.key}>{item.text}</Text>
      ))}
    </View>
  );
};

export default ModifyPairsScreen;
