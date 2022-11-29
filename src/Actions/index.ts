import { combatStatsObject, rawDataEntry } from "../Utils/types";

export const selectPokemon = (pokemon: rawDataEntry | null = null) => {
  //return pokemon
  return {
    type: "POKEMON_SELECTED",
    payload: pokemon,
  };
};

export const updateStrengthArray = (strengthsArray: combatStatsObject) => {
  return { type: "UPDATE_COMBAT_OBJECT", payload: strengthsArray };
};

export const UpdateClicked = (value: boolean) => {
  return { type: "UPDATE_CLICKED", payload: value };
};

export const deselectPokemon = () => {
  return { type: "POKEMON_DESELECTED", payload: null };
};
