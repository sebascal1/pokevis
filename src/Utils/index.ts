//colour dict for the distinct types
export const colourTypeScale = {
  normal: "#a8a877",
  fire: "#ef8030",
  water: "#6790f0",
  grass: "#78c84f",
  electric: "#f8cf30",
  ice: "#98d8d8",
  fighting: "#c03028",
  poison: "#9f409f",
  ground: "#e0c068",
  flying: "#a890f0",
  psychic: "#f85787",
  bug: "#a8b720",
  rock: "#b8a038",
  ghost: "#705898",
  dark: "#705848",
  dragon: "#7038f8",
  steel: "#b8b8d0",
  fairy: "#f0b6bc",
};

export const baseTotalColors = {
  high: "#00b4a1",
  medium: "#00768d",
  low: "#012f61",
};

//helper function to capitalize a string
export const capitalize = (s: string): string => {
  return s[0].toUpperCase() + s.slice(1);
};

//array for the pokemon types
export const pokemonTypes = [
  "normal",
  "fire",
  "water",
  "grass",
  "electric",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dark",
  "dragon",
  "steel",
  "fairy",
];
