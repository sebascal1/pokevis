import {
  combatStatsObject,
  pokemonTypesObject,
  rawDataEntry,
} from "../Utils/types";

//type definition for the root state
export type RootState = {
  selectedPokemon: rawDataEntry | null;
  combatStats: combatStatsObject;
  clicked: boolean;
  types: pokemonTypesObject;
};

//type definition for the actions
type Action = { type: string; payload: any };

//reducer for the application to update the redux state based on the actions
export const rootReducer = (
  state: RootState = initialState,
  action: Action
) => {
  switch (action.type) {
    case "POKEMON_SELECTED":
      return { ...state, selectedPokemon: action.payload };
    case "UPDATE_COMBAT_OBJECT":
      return { ...state, combatStats: action.payload };
    case "UPDATE_CLICKED":
      return { ...state, clicked: action.payload };
    case "UPDATE_TYPES":
      return { ...state, types: action.payload };
    default:
      return { ...state, selectedPokemon: null };
  }
};

//set the initial state for the redux state
const initialState: RootState = {
  selectedPokemon: null,
  combatStats: { strengths: [], weakness: [] },
  clicked: false,
  types: { primary: null, secondary: "" },
};
