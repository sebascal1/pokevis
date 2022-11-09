import { rawDataEntry } from "../Utils/types";

export const selectPokemon = (pokemon: rawDataEntry | null = null) => {
  //return pokemon
  return {
    type: "POKEMON_SELECTED",
    payload: pokemon,
  };
};

export const deselectPokemon = () => {
  return { type: "POKEMON_DESELECTED", payload: null };
};
