import React from "react";
import { capitalize } from "../Utils";
import { rawDataEntry } from "../Utils/types";
import bugType from "../Icons/bug_type.png";
import darkType from "../Icons/bug_type.png";
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

const pokedexEntry: React.FC<pokedexEntryProps> = ({
  data,
  innerRadius,
  //radius,
}) => {
  const length = Math.sqrt(2 * Math.pow(innerRadius / 2, 2));
  console.log(data);
  if (data === null) return <div></div>;
  // return (
  //   <div
  //     className={"ui basic segment"}
  //     style={{
  //       position: "absolute",
  //       height: length - 10,
  //       width: length - 10,
  //       left: `${window.innerWidth / 2 - length / 2 + 5}px`,
  //       top: `${(window.innerHeight - length) / 2 - 5}px`,
  //       border: "none",
  //       padding: "0",
  //       background: "transparent",
  //     }}
  //   >
  //     <h1 className="ui centered header">
  //       {"Hover over a Pokemon for more Information"}
  //     </h1>
  //   </div>
  // );

  const getPicture = (type: string) => {
    switch (type) {
      case "bug":
        return bugType;
      case "dark":
        return darkType;
      case "dragon":
        return dragonType;
      case "electric":
        return electricType;
      case "fairy":
        return fairyType;
      case "fighting":
        return fightingType;
      case "fire":
        return fireType;
      case "flying":
        return flyingType;
      case "ghost":
        return ghostType;
      case "grass":
        return grassType;
      case "ground":
        return groundType;
      case "ice":
        return iceType;
      case "normal":
        return normalType;
      case "poison":
        return poisonType;
      case "psychic":
        return psychicType;
      case "rock":
        return rockType;
      case "steel":
        return steelType;
      case "water":
        return waterType;
      default:
        return normalType;
    }
  };

  const renderTypeImages = (type1: string, type2: string) => {
    if (type2 === "" || type2 === type1) {
      return (
        <div
          className="ui basic segment"
          style={{ background: "transparent", border: "none", padding: "0" }}
        >
          <img
            className="ui centered tiny image"
            src={getPicture(data.type1)}
            alt={"no pokemon found"}
          />
        </div>
      );
    } else {
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
              src={getPicture(data.type1)}
              alt={"no pokemon found"}
            />
          </div>
          <div
            className="ui basic segment"
            style={{ background: "transparent", border: "none", padding: "0" }}
          >
            <img
              className="ui centered tiny image"
              src={getPicture(data.type2)}
              alt={"no pokemon found"}
            />
          </div>
        </div>
      );
    }
  };

  return (
    <div
      className={"ui basic segment"}
      style={{
        position: "absolute",
        height: length,
        width: length,
        left: `${(window.innerWidth - length) / 2 + 5}px`,
        top: `${window.innerHeight / 2 - length + 20}px`,
        border: "none",
        padding: "0",
        background: "transparent",
      }}
    >
      <div
        className="ui basic segment"
        style={{ background: "transparent", border: "none", padding: "0" }}
      >
        <img
          className="ui centered huge image"
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.pokedex_number}.png`}
          alt={"no pokemon found"}
        />
      </div>
      {renderTypeImages(data.type1, data.type2)}
      <div
        className="ui basic segment"
        style={{ background: "transparent", border: "none", padding: "0" }}
      >
        <h3 className="ui header">{`No. ${data.pokedex_number} ${capitalize(
          data.name
        )}`}</h3>
      </div>
    </div>
  );
};

export default pokedexEntry;
