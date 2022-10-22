import React from "react";
import { capitalize } from "../Utils";
import { rawDataEntry } from "../Utils/types";

type pokedexEntry = {
  data: rawDataEntry | null;
  innerRadius: number;
  radius: number;
};

const pokedexEntry: React.FC<pokedexEntry> = ({
  data,
  innerRadius,
  radius,
}) => {
  const length = Math.sqrt(2 * Math.pow(innerRadius / 2, 2));
  if (data === null)
    return (
      <div
        className={"ui basic segment"}
        style={{
          position: "absolute",
          height: length - 10,
          width: length - 10,
          left: `${window.innerWidth / 2 - length / 2 + 5}px`,
          top: `${(window.innerHeight - length) / 2 - 5}px`,
          border: "none",
          padding: "0",
          background: "transparent",
        }}
      >
        <h1 className="ui centered header">
          {"Hover over a Pokemon for more Information"}
        </h1>
      </div>
    );

  return (
    <div
      className={"ui basic segment"}
      style={{
        position: "absolute",
        height: length,
        width: length,
        left: `${(window.innerWidth - length) / 2}px`,
        top: `${radius - length}px`,
        border: "none",
        padding: "0",
        background: "transparent",
      }}
    >
      <div
        className="ui basic segment"
        style={{ background: "white", border: "none", padding: "0" }}
      >
        <h3 className="ui header">{capitalize(data.name)}</h3>
      </div>

      <div
        className="ui basic segment"
        style={{ background: "white", border: "none", padding: "0" }}
      >
        <img
          className="ui centered huge image"
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.pokedex_number}.png`}
        />
        <div
          className="ui basic segment"
          style={{ background: "white", border: "none", padding: "0" }}
        >
          <h3 className="ui header">{`No. ${data.pokedex_number}`}</h3>
        </div>
      </div>
    </div>
  );
};

export default pokedexEntry;
