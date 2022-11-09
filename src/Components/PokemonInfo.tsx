import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../rootReducer";

import bugType from "../Icons/bug_type.png";
import darkType from "../Icons/dark_type.png";
import dragonType from "../Icons/dragon_type.png";
import electricType from "../Icons/electric_type.png";
import fairyType from "../Icons/fairy_type.png";
import fightingType from "../Icons/fighting_type.png";
import fireType from "../Icons/fire_type.png";
import flyingType from "../Icons/flying_type.png";
import ghostType from "../Icons/ghost_type.png";
import grassType from "../Icons/grass_type.png";
import groundType from "../Icons/ground_type.png";
import iceType from "../Icons/ice_type.png";
import normalType from "../Icons/normal_type.png";
import poisonType from "../Icons/poison_type.png";
import psychicType from "../Icons/psychic_type.png";
import rockType from "../Icons/rock_type.png";
import steelType from "../Icons/steel_type.png";
import waterType from "../Icons/water_type.png";

const PokemonInfo = () => {
  const selectedPokemon = useSelector(
    (state: RootState) => state.selectedPokemon
  );

  //enum to make sure we have a controlled set of inputs for the getStrengthsOrWeaknesses function
  enum attributeType {
    strengths,
    weaknesses,
  }

  //create a dict for referencing the images of the pokemon types
  const typeDict = {
    bug: bugType,
    dark: darkType,
    dragon: dragonType,
    electric: electricType,
    fairy: fairyType,
    fight: fightingType,
    fire: fireType,
    flying: flyingType,
    ghost: ghostType,
    grass: grassType,
    ground: groundType,
    ice: iceType,
    normal: normalType,
    poison: poisonType,
    psychic: psychicType,
    rock: rockType,
    steel: steelType,
    water: waterType,
  };

  //go through the selectedPokemon data entry, pick out the data related to attack attributes and extract the types
  //the pokemon is strong and weak against depending on the type
  const getStrengthsOrWeaknesses = (type: attributeType) => {
    if (selectedPokemon === null) return;
    const pokemonEntryAsArray = Object.entries(selectedPokemon);

    const attrArray = pokemonEntryAsArray.filter((entry) =>
      entry[0].includes("against")
    );
    let filteredAttributes;

    //depending on the type, filter the pokemon
    if (type === attributeType.strengths) {
      filteredAttributes = attrArray.filter((entry) => parseInt(entry[1]) < 1);
    } else if (type === attributeType.weaknesses) {
      filteredAttributes = attrArray.filter((entry) => parseInt(entry[1]) > 1);
    }

    console.log(filteredAttributes);
    return filteredAttributes?.map((entry) => {
      let type = entry[0].split("_")[1];
      return (
        <li style={{ display: "inline-block" }}>
          <img
            src={
              // @ts-ignore
              typeDict[type]
            }
            alt={type}
            style={{
              height: "20px",
            }}
          />
        </li>
      );
    });
  };

  console.log(selectedPokemon);

  return (
    <article
      className="pokemon-info"
      style={{
        height: "95%",
        width: "97%",
        backgroundColor: "beige",
      }}
    >
      <section className={"strengths display"} style={{ display: "flex" }}>
        <p>Strengths:</p>
        <ul style={{ padding: "0", margin: "0" }}>
          {getStrengthsOrWeaknesses(attributeType.strengths)}
        </ul>
      </section>
      <section className={"strengths display"} style={{ display: "flex" }}>
        <p>Weaknesses:</p>
        <ul style={{ padding: "0", margin: "0" }}>
          {getStrengthsOrWeaknesses(attributeType.weaknesses)}
        </ul>
      </section>
    </article>
  );
};

export default PokemonInfo;
