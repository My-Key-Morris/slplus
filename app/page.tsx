"use client";
import React, { useState } from 'react';
// Adjusted relative paths to point up one level into the screens folder
import AddPairScreen from '../screens/AddPairScreen';
import CreateTeamsScreen from '../screens/CreateTeamsScreen';

export default function App() {
  const [pairList, setPairList] = useState([]);
  const [teamsList, setTeamsList] = useState([]);
  const [lastAction, setLastAction] = useState([]);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'row',
    height: '100vh',
    width: '100%',
  };

  return (
    <div style={containerStyle}>
      <AddPairScreen
        pairList={pairList}
        setPairList={setPairList}
        teamsList={teamsList}
        setTeamsList={setTeamsList}
        setLastAction={setLastAction}
      />
      <CreateTeamsScreen
        teamsList={teamsList}
        pairList={pairList}
        lastAction={lastAction}
      />
    </div>
  );
}
