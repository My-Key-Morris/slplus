"use client";
import React, { useEffect, useState } from 'react';

export default function CreateTeamsScreen({ teamsList, pairList, lastAction }) {
  // Compute screen height on client
  const [screenHeight, setScreenHeight] = useState(0);
  useEffect(() => {
    setScreenHeight(window.innerHeight);
  }, []);

  // Filtering logic
  const filterTeams = (teams) => {
    const includedPairs = pairList.filter(p => p.mode === 'include');
    const excludedPairs = pairList.filter(p => p.mode === 'exclude');

    return teams.filter(team => {
      // Check if the team contains any excluded pairs
      const containsExcluded = excludedPairs.some(excludedPair =>
        team.pairs.some(teamPair => teamPair.key === excludedPair.key)
      );

      // Check if the team contains ALL included pairs (if there are any)
      const containsAllIncluded =
        includedPairs.length === 0 ||
        includedPairs.every(includedPair =>
          team.pairs.some(teamPair => teamPair.key === includedPair.key)
        );

      // Return true only if the team should be included and doesn't contain excluded pairs
      return !containsExcluded && containsAllIncluded;
    });
  };

  // Handle updates based on lastAction
  useEffect(() => {
    if (lastAction === 'add') {
      teamsList.forEach(team => team.addUpdate());
    } else if (lastAction === 'delete') {
      teamsList.forEach(team => team.delUpdate(teamsList));
    }
  }, [lastAction, teamsList]);

  // Filter and sort teams
  let visibleTeams = filterTeams(teamsList);
  visibleTeams.forEach(team => team.filterUpdate(visibleTeams));
  visibleTeams = visibleTeams.sort((a, b) => b.pairs.length - a.pairs.length);

  // Styles as JS objects
  const styles = {
    container: {
      height: screenHeight,
      overflowY: 'auto',
      backgroundColor: '#f0f8ff',
      padding: 16,
      boxSizing: 'border-box',
    },
    teamContainer: {
      backgroundColor: '#ffffff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
    },
    teamHeader: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#333333',
      marginBottom: 10,
      textAlign: 'center',
    },
    playerLabelsContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    playerLabel: {
      flex: 1,
      textAlign: 'center',
      fontSize: '1rem',
      fontWeight: 'bold',
      color: '#00796b',
    },
    pairContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      backgroundColor: '#e0f7fa',
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
    },
    pokemonColumn: {
      flex: 1,
      padding: '0 5px',
      textAlign: 'center',
    },
    pokemonText: {
      fontSize: '1rem',
      color: '#00796b',
    },
  };

  return (
    <div style={styles.container}>
      {visibleTeams.map((team, index) => (
        <div key={team.key || index} style={styles.teamContainer}>
          <h2 style={styles.teamHeader}>
            Team {index + 1} Key {team.key} {team.show ? '' : '(hidden)'}
          </h2>
          <div style={styles.playerLabelsContainer}>
            <span style={styles.playerLabel}>Player 1</span>
            <span style={styles.playerLabel}>Player 2</span>
          </div>
          {team.pairs.map((pair, pi) => (
            <div key={pair.key || pi} style={styles.pairContainer}>
              <div style={styles.pokemonColumn}>
                <p style={styles.pokemonText}>{pair.pk1.name}</p>
              </div>
              <div style={styles.pokemonColumn}>
                <p style={styles.pokemonText}>{pair.pk2.name}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
