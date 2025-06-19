import { Pokemon } from '../components/Pokemon.js';

const getPokemon = async (name) => {
  const API_ENDPOINT = 'https://pokeapi.co/api/v2/pokemon/';

  try {
    const response = await fetch(API_ENDPOINT + name);

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const data = await response.json();
    let species = data.species.url;
    species = species.substring(42, species.length - 1);
    //console.log(species);
    const nameArr = name.split("-");
    
    //console.log(nameArr[0]);
   //console.log(nameArr[1]);
    return new Pokemon(nameArr[0], data.types.map(typeInfo => typeInfo.type.name), species, nameArr[1]);
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Rethrow the error for further handling
  }
};

export { getPokemon };
