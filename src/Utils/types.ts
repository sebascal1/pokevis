//declare general types to be used throughout the application

//raw data format for each entry in pokemon.csv
import React from "react";

export type rawDataEntry = {
  abilities: string;
  against_bug: string;
  against_dark: string;
  against_dragon: string;
  against_electric: string;
  against_fairy: string;
  against_fight: string;
  against_fire: string;
  against_flying: string;
  against_ghost: string;
  against_grass: string;
  against_ground: string;
  against_ice: string;
  against_normal: string;
  against_poison: string;
  against_psychic: string;
  against_rock: string;
  against_steel: string;
  against_water: string;
  attack: string;
  base_egg_steps: string;
  base_happiness: string;
  base_total: string;
  capture_rate: string;
  classfication: string;
  defense: string;
  experience_growth: string;
  generation: string;
  height_m: string;
  hp: string;
  is_legendary: string;
  japanese_name: string;
  name: string;
  percentage_male: string;
  pokedex_number: string;
  sp_attack: string;
  sp_defense: string;
  speed: string;
  type1: string;
  type2: string;
  weight_kg: string;
};

//props for the treeVis component
export type VisProps = {
  data: rawDataEntry[];
};

//for sidebar
export type SidebarProps = {
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
};

//combatStats type
export type combatStatsObject = {
  strengths: string[];
  weakness: string[];
};

//types object for when selecting a type
export type pokemonTypesObject = {
  primary: string | null;
  secondary: string;
};
