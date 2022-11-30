import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { RootState } from "../Reducers/rootReducer";
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
import { updateStrengthArray } from "../Actions";
import { combatStatsObject } from "../Utils/types";

//component to be used in order to display the specific information of a pokemon
const PokemonInfo = () => {
  //grab the selected pokemon from the redux state
  const selectedPokemon = useSelector(
    (state: RootState) => state.selectedPokemon
  );
  //get the combat stats (strengths and weaknesses) array for the selected pokemon from the redux state
  const combatStats = useSelector((state: RootState) => state.combatStats);
  //set the info text for the pokemon using the state system
  const [pokeText, setPokeText] = useState("");
  const dispatch = useDispatch();

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

  //run the use effect loop to update the pokemon info anytime the selected pokemon is updated
  useEffect(() => {
    //get the data of the selected pokemon from the api
    const getData = async () => {
      if (selectedPokemon === null || selectedPokemon === undefined) return;
      const data = await axios.get(
        `https://pokeapi.co/api/v2/pokemon-species/${selectedPokemon.pokedex_number}/`
      );

      //get the pokemon text from the api response
      // @ts-ignore
      setPokeText(data.data.flavor_text_entries[0].flavor_text);
    };

    //set the combat stats and update the redux state
    const setCombatStats = () => {
      //get both the strengths and weaknesses arrays
      const strengthsArray = getAttributes(attributeType.strengths);
      const weaknessArray = getAttributes(attributeType.weaknesses);

      //quick edit to replace the word fight with fighting in order to get the fighting image type from the disctionary
      findAndReplace(strengthsArray, "fight", "fighting");
      findAndReplace(weaknessArray, "fight", "fighting");

      //find the own pokemon's types and remove them from the strengths array
      findSelectedPokemonTypeAndDelete(strengthsArray);

      //set up and dispatch the combat object to update the redux state
      const combatObject: combatStatsObject = {
        strengths: strengthsArray,
        weakness: weaknessArray,
      };
      dispatch(updateStrengthArray(combatObject));
    };

    getData();
    setCombatStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPokemon]);

  //find a specific type in a given array and replace it
  const findAndReplace = (
    arr: string[],
    stringToFind: string,
    replacement: string
  ) => {
    //check for fight stat and change it to fighting
    const indexNumber = arr.findIndex((type) => type === stringToFind);
    if (indexNumber > -1) arr[indexNumber] = replacement;
  };

  //function to find the primary type of the pokemon in the strengths array and remove it
  const findSelectedPokemonTypeAndDelete = (arr: string[]) => {
    const type = selectedPokemon?.type1;
    const indexNumber = arr.findIndex((entry) => entry === type);
    arr.splice(indexNumber, 1);
  };

  //go through the selectedPokemon data entry, pick out the data related to attack attributes and extract the types
  //the pokemon is strong and weak against depending on the type
  const getStrengthsOrWeaknesses = (type: attributeType) => {
    let filteredAttributes = getAttributes(type);

    if (type === attributeType.strengths)
      findSelectedPokemonTypeAndDelete(filteredAttributes);

    return filteredAttributes?.map((entry, i) => {
      return (
        <li style={{ display: "inline-block" }} key={i}>
          <img
            src={
              // @ts-ignore
              typeDict[entry]
            }
            alt={entry}
            style={{
              height: "20px",
            }}
          />
        </li>
      );
    });
  };

  //determine the recommended pokeball to use for a specific pokemon based on the capture rate of the pokemon
  const determinePokeball = (captureRate: number) => {
    if (captureRate < 10) {
      return "Master Ball";
    } else if (captureRate < 100) {
      return "Ultra Ball";
    } else if (captureRate < 200) {
      return "Great Ball";
    }
    return "Poke Ball";
  };

  //helper function to get the strenghts and weaknesses of the selected pokemon
  const getAttributes = (type: attributeType): string[] => {
    //if there is no selected pokemon, exit earlt
    if (selectedPokemon === null) return [];
    //turn the selected pokemon object into an array
    const pokemonEntryAsArray = Object.entries(selectedPokemon);
    //filter the contents of the object by getting the entries with the word "against" in them, these are the entries associated with whether a pokemon is strong or weak against a certain pokemon type
    const attrArray = pokemonEntryAsArray.filter((entry) =>
      entry[0].includes("against")
    );
    let filteredAttributes;
    //depending on the type, filter the attributes to get the strengths and weaknesses
    if (type === attributeType.strengths) {
      filteredAttributes = attrArray.filter((entry) => parseInt(entry[1]) < 1);
    } else if (type === attributeType.weaknesses) {
      filteredAttributes = attrArray.filter((entry) => parseInt(entry[1]) > 1);
    }
    //if there are none, return and empty array
    if (filteredAttributes === undefined) return [];

    return filteredAttributes.map((entry) => entry[0].split("_")[1]);
  };

  //helper function to determine the status effects to inflict on a pokemon based on the type
  const determineStatusEffects = (weaknessArr: string[]) => {
    const statusTypes = ["fire", "electric", "ice", "poison"];

    const statusEffects = {
      fire: "burn, ",
      electric: "paralyze, ",
      ice: "freeze, ",
      poison: "poison, ",
    };

    //return the status effects as a string concatinating the status effects that will be super effective against the pokemon
    return weaknessArr.reduce((prevString, weakness) => {
      if (statusTypes.includes(weakness)) {
        // @ts-ignore
        return (prevString += statusEffects[weakness]);
      } else {
        return prevString;
      }
    }, "");
  };

  //helper function to render the intro text when a pokemon is not selected
  const renderIntroText = () => {
    return (
      <Fragment>
        <p>Hover over a ball to show a pokemon's info</p>
        <p>Click on a pokemon to set the info</p>
      </Fragment>
    );
  };

  return (
    <article
      className="pokemon-info"
      style={{
        height: "95%",
        width: "95%",
        backgroundColor: "rgb(35,35,35)",
        color: "white",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        border: "5px solid rgb(220,220,220)",
        borderRadius: "10px",
      }}
    >
      {/*if a pokemon is not selected, render the intro text*/}
      {!selectedPokemon && renderIntroText()}
      {/*else render the pokemon information*/}
      {selectedPokemon && (
        <Fragment>
          <section
            className="pokemon-text"
            style={{ display: "block", margin: "1rem 0" }}
          >
            <p>{pokeText}</p>
          </section>

          <section className={"strengths display"} style={{ display: "flex" }}>
            <p style={{ margin: 0 }}>Strong Against:</p>
            <ul style={{ padding: "0", margin: "0" }}>
              {getStrengthsOrWeaknesses(attributeType.strengths)}
            </ul>
          </section>
          <section className={"strengths display"} style={{ display: "flex" }}>
            <p style={{ marginBlockEnd: "0" }}>Weak Against:</p>
            <ul style={{ padding: "0", margin: "0" }}>
              {getStrengthsOrWeaknesses(attributeType.weaknesses)}
            </ul>
          </section>
          {selectedPokemon && (
            <section
              className={"pokemon-capture"}
              style={{ display: "block", margin: "1rem 0" }}
            >
              <p
                style={{ marginBlockEnd: "0" }}
              >{`Recommended ball for capturing: ${determinePokeball(
                parseInt(selectedPokemon.capture_rate)
              )}`}</p>
              <p>{`Recommended Status Effects to increase capture: ${determineStatusEffects(
                combatStats.weakness
              )}`}</p>
            </section>
          )}
        </Fragment>
      )}
    </article>
  );
};

export default PokemonInfo;
