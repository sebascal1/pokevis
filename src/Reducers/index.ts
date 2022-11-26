import { combineReducers } from "redux";

type action = {
  type: string;
  payload: string | null | string[];
};

const selectedPokemonReducer = (pokemon = null, action: action) => {
  switch (action.type) {
    case "SELECTED_POKEMON":
      return action.payload;
    default:
      return null;
  }
};

export default combineReducers({
  selectedPokemon: selectedPokemonReducer,
});
