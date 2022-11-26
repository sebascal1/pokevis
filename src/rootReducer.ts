import { combatStatsObject, rawDataEntry } from "./Utils/types";

export type RootState = {
  selectedPokemon: rawDataEntry | null;
  combatStats: combatStatsObject;
};
type Action = { type: string; payload: any };

export const rootReducer = (
  state: RootState = initialState,
  action: Action
) => {
  switch (action.type) {
    case "POKEMON_SELECTED":
      return { ...state, selectedPokemon: action.payload };
    case "UPDATE_COMBAT_OBJECT":
      return { ...state, combatStats: action.payload };
    default:
      return { ...state, selectedPokemon: null };
  }
};

const initialState: RootState = {
  selectedPokemon: null,
  combatStats: { strengths: [], weakness: [] },
};
