"use client";
import React, { useState } from 'react';
import { Pair } from '../components/Pokemon';
import { getPokemon } from '../components/server';
import { addUpdateTeamsList, delUpdateTeamsList } from '../components/TeamCreation';

let idCounter = 1;

export default function AddPairScreen({ pairList, setPairList, teamsList, setTeamsList, setLastAction }) {
  const [inputText1, setInputText1] = useState('');
  const [inputText2, setInputText2] = useState('');

  const addFromEntry = async () => {
    if (inputText1.trim() && inputText2.trim()) {
      await addPairToList(inputText1, inputText2);
    }
  };

  const addPairsFromFile = (e) => {
    console.log('File input event triggered:', e);
  
    const file = e.target.files[0];
    if (!file) {
      console.warn('No file selected.');
      return;
    }
  
    console.log(`Selected file: ${file.name}, size: ${file.size} bytes`);
  
    const reader = new FileReader();
  
    reader.onload = () => {
      console.log('File successfully read.');
      console.log('File content preview:', reader.result.slice(0, 200)); // Only show first 200 chars
      processFileContent(reader.result);
    };
  
    reader.onerror = (err) => {
      console.error('File read error:', err);
    };
  
    console.log('Reading file as text...');
    reader.readAsText(file);
  };
  

  const processFileContent = async (text) => {
    console.log("Raw file content received:");
    console.log(text);
  
    const lines = text.split('\n');
    console.log(`Total lines found: ${lines.length}`);
  
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      console.log(`Processing line ${i + 1}: "${line}"`);
  
      const [a, b] = line.split(',');
      if (a && b) {
        console.log(`Parsed pair: "${a.trim()}", "${b.trim()}"`);
        await addPairToList(a.trim(), b.trim());
      } else {
        console.warn(`Skipped invalid line ${i + 1}: "${line}"`);
      }
    }
  
    console.log("Finished processing file.");
  };
  

  const addPairToList = async (newItem1, newItem2) => {
    const pk1 = await getPokemon(newItem1.toLowerCase());
    const pk2 = await getPokemon(newItem2.toLowerCase());
    const newPair = new Pair(pk1, pk2, idCounter++);
    newPair.mode = 'neutral';

    setPairList(prev => [...prev, newPair]);
    setInputText1('');
    setInputText2('');
    setLastAction('add');

    try {
      const updatedTeams = await addUpdateTeamsList(newPair, teamsList);
      setTeamsList(updatedTeams);
    } catch (err) {
      console.error('Error updating teams:', err);
    }
  };

  const toggleMode = (key) => {
    setLastAction('include/exclude');
    setPairList(prev => prev.map(pair =>
      pair.key === key
        ? { ...pair, mode: pair.mode === 'neutral' ? 'include' : pair.mode === 'include' ? 'exclude' : 'neutral' }
        : pair
    ));
  };

    const deleteItem = (key) => {
      console.log(`Attempting to delete item with key: ${key}`);
    
      const removed = pairList.find(p => p.key === key);
    
      if (!removed) {
        console.warn(`Item with key ${key} not found in pairList.`);
        return;
      }
    
      console.log('Item found for removal:', removed);
    
      setPairList(prev => {
        const newList = prev.filter(p => p.key !== key);
        console.log('Updated pairList (after deletion):', newList);
        return newList;
      });
    
      setLastAction('delete');
      console.log('Set lastAction to delete');
    
      const updatedTeams = delUpdateTeamsList(removed, teamsList);
      console.log('Updated teams list from delUpdateTeamsList:', updatedTeams);
    
      setTeamsList(updatedTeams);
    };
  

  const styles = {
    container: { height: '100vh', background: '#2b2b2b', padding: 16, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' },
    tableHeader: { display: 'flex', marginBottom: 8, color: '#fff', fontWeight: 'bold' },
    headerCell: { flex: 1, textAlign: 'center', borderBottom: '1px solid #444', padding: '8px 4px' },
    row: { display: 'flex', background: '#3b3b3b', margin: '4px 0', borderRadius: 8, overflow: 'hidden' },
    cell: { flex: 1, padding: '12px 4px', color: '#fff', textAlign: 'center' },
    button: { margin: '0 4px', padding: '6px 12px', border: 'none', borderRadius: 6, cursor: 'pointer' },
    includeBtn: { background: '#00ccff', color: '#fff' },
    deleteBtn: { background: '#ff4d4d', color: '#fff' },
    inputContainer: { display: 'flex', marginTop: 16 },
    input: { flex: 1, padding: '8px', marginRight: 8, borderRadius: 6, border: '1px solid #555', background: '#444', color: '#fff' },    fileInput: { marginTop: 16, color: '#fff' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.tableHeader}>
        <div style={styles.headerCell}>List 1</div>
        <div style={styles.headerCell}>List 2</div>
        <div style={styles.headerCell}></div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {pairList.map(item => (
          <div key={item.key} style={styles.row}>
            <div style={styles.cell}>{item.pk1.name}</div>
            <div style={styles.cell}>{item.pk2.name}</div>
            <div style={styles.cell}>
              <button style={{ ...styles.button, ...styles.includeBtn }} onClick={() => toggleMode(item.key)}>
                {item.mode}
              </button>
              <button style={{ ...styles.button, ...styles.deleteBtn }} onClick={() => deleteItem(item.key)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          placeholder="Pokemon 1"
          value={inputText1}
          onChange={e => setInputText1(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Pokemon 2"
          value={inputText2}
          onChange={e => setInputText2(e.target.value)}
        />
        <button style={{ ...styles.button, background: '#00cc66', color: '#fff' }} onClick={addFromEntry}>
          Add
        </button>
      </div>
      <input
        type="file"
        accept=".txt"
        style={styles.fileInput}
        onChange={addPairsFromFile}
      />
    </div>
  );
}
