import { rawDataEntry } from "./Utils/types";

export type RootState = { selectedPokemon: rawDataEntry | null };
type Action = { type: string; payload: rawDataEntry | null };

export const rootReducer = (
  state: RootState = initialState,
  action: Action
) => {
  switch (action.type) {
    case "POKEMON_SELECTED":
      return { ...state, selectedPokemon: action.payload };
    default:
      return { ...state, selectedPokemon: null };
  }
};

const initialState: RootState = { selectedPokemon: null };
