//Component to show the sprite of the selected pokemon within the center circle of treeVis

import React from "react";
import { capitalize } from "../Utils";
import { rawDataEntry } from "../Utils/types";
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

type pokedexEntryProps = {
  data: rawDataEntry | null;
  innerRadius: number;
  //radius: number;
};

//PokedexEntry takes in the data of the pokemon to display, aswell as the innerRadius of treeVis
const pokedexEntry: React.FC<pokedexEntryProps> = ({
  data,
  innerRadius,
  //radius,
}) => {
  //calculate the length of one side of the biggest square that can fit within the inner circle
  const length = Math.sqrt(2 * Math.pow(innerRadius / 2, 2));
  //determine whether we're in movile view or not depending on the screen size
  const mobileView = window.innerWidth < 700;

  //create a dict for referencing the images of the pokemon types
  const typeDict = {
    bug: bugType,
    dark: darkType,
    dragon: dragonType,
    electric: electricType,
    fairy: fairyType,
    fighting: fightingType,
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

  if (data === null) return <div></div>;

  //function to render the type images for a pokemon depending on the type or types it has
  const renderTypeImages = (type1: string, type2: string) => {
    //if the entry of the second type is null, or same as the first, it only has one type
    //only render one image
    if (type2 === "" || type2 === type1) {
      return (
        <div
          className="ui basic segment"
          style={{ background: "transparent", border: "none", padding: "0" }}
        >
          <img
            className="ui centered tiny image"
            // @ts-ignore
            src={typeDict[data.type1]}
            alt={"no pokemon found"}
          />
        </div>
      );
    } else {
      //else render both types side by side
      return (
        <div
          className="ui basic horizontal segments"
          style={{ background: "transparent", border: "none", padding: "0" }}
        >
          <div
            className="ui basic segment"
            style={{ background: "transparent", border: "none", padding: "0" }}
          >
            <img
              className="ui centered tiny image"
              // @ts-ignore
              src={typeDict[data.type1]}
              alt={"no pokemon found"}
            />
          </div>
          <div
            className="ui basic segment"
            style={{ background: "transparent", border: "none", padding: "0" }}
          >
            <img
              className="ui centered tiny image"
              // @ts-ignore
              src={typeDict[data.type2]}
              alt={"no pokemon found"}
            />
          </div>
        </div>
      );
    }
  };

  return (
    <div
      className={"pokedex"}
      style={{
        position: "absolute",
        height: length,
        width: length,
        border: "none",
        top: `${mobileView ? "30%" : "27%"}`,
        left: "50%",
        background: "transparent",
        transform: `translateX(${-50}%)`,
      }}
    >
      <div
        className="ui basic segment"
        style={{ background: "transparent", border: "none", padding: "0" }}
      >
        {/*Get the sprite of the pokemon from the following source*/}
        <img
          className="ui centered medium image"
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.pokedex_number}.png`}
          alt={"no pokemon found"}
        />
      </div>
      {renderTypeImages(data.type1, data.type2)}
      <div
        className="ui basic segment"
        style={{
          background: "transparent",
          border: "none",
          padding: "0",
          width: "auto",
        }}
      >
        {/*Displat the name and capitalize it*/}
        <h5 className="ui header">{`No. ${data.pokedex_number} ${capitalize(
          data.name
        )}`}</h5>
      </div>
    </div>
  );
};

export default pokedexEntry;
