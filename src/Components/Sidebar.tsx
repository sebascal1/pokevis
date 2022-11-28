import React, { Fragment } from "react";
import "./sidebar.css";
import { SidebarProps } from "../Utils/types";
import { colourTypeScale, baseTotalColors } from "../Utils";

const Sidebar: React.FC<SidebarProps> = ({ active, setActive }) => {
  const baseTotalArr = ["low", "medium", "high"];

  const typesArr = [
    "bug",
    "dark",
    "dragon",
    "electric",
    "fairy",
    "fighting",
    "fire",
    "flying",
    "ghost",
    "grass",
    "ground",
    "ice",
    "normal",
    "poison",
    "psychic",
    "rock",
    "steel",
    "water",
  ];

  const renderTypeLegend = () => {
    return typesArr.map((type) => {
      return (
        <section className={"legend__item"}>
          <div
            style={{
              display: "inline-block",
              height: "1rem",
              width: "1rem",
              // @ts-ignore
              backgroundColor: `${colourTypeScale[type]}`,
              marginRight: "0.5rem",
            }}
          ></div>
          <span>{type}</span>
        </section>
      );
    });
  };

  const renderEffectLegend = () => {
    return (
      <Fragment>
        <section style={{ display: "inline-flex" }}>
          <svg
            height="1.5rem"
            width="1.5rem"
            style={{ verticalAlign: "center" }}
          >
            <circle cx={"0.75rem"} cy={"0.75rem"} r={3} />
            <circle
              cx={"0.75rem"}
              cy={"0.75rem"}
              r={5}
              stroke={"red"}
              fill={"none"}
            />
          </svg>
          Weak Against
        </section>
        <section style={{ display: "inline-flex" }}>
          <svg
            height="1.5rem"
            width="1.5rem"
            style={{ verticalAlign: "center" }}
          >
            <circle cx={"0.75rem"} cy={"0.75rem"} r={3} />
            <circle
              cx={"0.75rem"}
              cy={"0.75rem"}
              r={5}
              stroke={"green"}
              fill={"none"}
            />
          </svg>
          Strong Against
        </section>
      </Fragment>
    );
  };

  const renderBaseTotalKey = () => {
    return baseTotalArr.map((entry) => {
      return (
        <section className={"legend__item--row"}>
          <div
            style={{
              display: "inline-block",
              height: "1rem",
              width: "1rem",
              // @ts-ignore
              backgroundColor: `${baseTotalColors[entry]}`,
              marginRight: "0.1rem",
            }}
          ></div>
          <span>{entry}</span>
        </section>
      );
    });
  };

  return (
    <div className={`sidebar ${active ? "active" : ""}`}>
      <button onClick={() => setActive(!active)}>Close</button>
      <article className={"legend"}>
        <section className="legend__types">{renderTypeLegend()}</section>
        <section className={"legend__effects"}>{renderEffectLegend()}</section>
        <section className={"legend__baseTotals"}>
          {renderBaseTotalKey()}
        </section>
      </article>
    </div>
  );
};

export default Sidebar;
