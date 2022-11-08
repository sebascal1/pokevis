export const selectPokemon = (pokemon: string | null = null) => {
  //return pokemon
  return {
    type: "POKEMON_SELECTED",
    payload: pokemon,
  };
};

export const deselectPokemon = () => {
  return { type: "POKEMON_DESELECTED", payload: null };
};
