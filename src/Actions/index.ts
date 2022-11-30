import {
  combatStatsObject,
  pokemonTypesObject,
  rawDataEntry,
} from "../Utils/types";

//actions for when a pokemon is selected in the pokemon wheel in the redux state
export const selectPokemon = (pokemon: rawDataEntry | null = null) => {
  //return pokemon
  return {
    type: "POKEMON_SELECTED",
    payload: pokemon,
  };
};

//action for when we update the strengths array for the selected pokemon in the redux state
export const updateStrengthArray = (strengthsArray: combatStatsObject) => {
  return { type: "UPDATE_COMBAT_OBJECT", payload: strengthsArray };
};

//action for updating the weaknesses array for the selected pokemon in the redux state
export const UpdateClicked = (value: boolean) => {
  return { type: "UPDATE_CLICKED", payload: value };
};

//action for when entering one of the donut arcs in the tree vis and sending the type information
export const UpdateTypes = (value: pokemonTypesObject) => {
  return { type: "UPDATE_TYPES", payload: value };
};
