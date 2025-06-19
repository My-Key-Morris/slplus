import React from 'react';
import { View, TextInput, Button, Text, FlatList, StyleSheet} from 'react-native';

const AddList = ({ listData, setListData }) => {
  const [inputText1, setInputText1] = useState('');
  const [inputText2, setInputText2] = useState('');
  const [listData1, setListData1] = useState([]);
  const [listData2, setListData2] = useState([]);

  const addItemToList = () => {
    if (inputText1.trim() !== '' && inputText2.trim() !== '') {
      const newItem1 = `${inputText1}`;
      const newItem2 = `${inputText2}`;
      setListData1([...listData1, { key: Date.now().toString(), text: newItem1 }]);
      setListData2([...listData2, { key: Date.now().toString(), text: newItem2 }]);
      setInputText1('');
      setInputText2('');
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.listsContainer}>
        <View style={styles.list}>
          <FlatList
            data={listData1}
            renderItem={({ item }) => <Text style={styles.listItem}>{item.text}</Text>}
          />
        </View>
        <View style={styles.list}>
          <FlatList
            data={listData2}
            renderItem={({ item }) => <Text style={styles.listItem}>{item.text}</Text>}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Pkemon 1"
          value={inputText1}
          onChangeText={(text) => setInputText1(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Pokemon 2"
          value={inputText2}
          onChangeText={(text) => setInputText2(text)}
        />
        <Button title="Add" onPress={addItemToList} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    width: 120,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 5,
    paddingHorizontal: 8,
  },
  listItem: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 5,
    borderRadius: 5,
  },
  listsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  list: {
    flex: 1,
    marginRight: 10,
  },
});

export default GoodList;
