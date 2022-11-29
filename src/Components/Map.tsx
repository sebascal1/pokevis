import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import kantoMap from "./kantoMap.png";
import "./map.css";

const Map = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageWidth =
    window.innerWidth < 700
      ? window.innerWidth
      : 0.5 * window.innerWidth * 0.95;
  const imageHeight = imageWidth * 0.6;
  // @ts-ignore
  const selectedPokemon = useSelector((state) => state.selectedPokemon);
  const [locations, setLocation] = useState<any[]>([]);
  const getRoutes = (entry: string) => {
    if (entry.includes("sea")) {
      return entry.split("-")[3];
    } else {
      return entry.split("-")[2];
    }
  };

  useEffect(() => {
    if (selectedPokemon === null || selectedPokemon === undefined) {
      setLocation([]);
      return;
    }
    const allowedGames = [
      "red",
      "blue",
      "green",
      "firered",
      "leafgreen",
      "yellow",
    ];
    const getData = async () => {
      let locs = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${selectedPokemon?.name.toLowerCase()}/encounters`
      );
      //setLocation(locs.data);
      const filteredLocs = locs.data.filter(
        (location: any) =>
          allowedGames.includes(location.version_details[0].version.name) &&
          location.location_area.name.includes("route")
      );

      const filteredRoutes = filteredLocs.map((entry: any) =>
        getRoutes(entry.location_area.name)
      );

      setLocation(filteredRoutes);
    };

    getData();
  }, [selectedPokemon]);

  const mapArr = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20-1",
    "20-2",
    "21",
    "22",
    "23",
    "24",
  ];

  const renderRoutes = () => {
    return mapArr.map((entry, i) => {
      return (
        <div
          key={i}
          className="route"
          id={`route${entry}`}
          style={{ opacity: `${locations.includes(entry) ? 0.7 : 0}` }}
        />
      );
    });
  };
  console.log(mapArr);

  return (
    <section
      ref={containerRef}
      style={{
        position: "relative",
        display: "flex",
        width: "95%",
        height: "96%",
        justifyContent: "center",
        alignItems: "center",
        border: "10px solid rgb(50,50,50)",
        borderRadius: "10px",
      }}
      className="kanto-map"
    >
      <div
        style={{
          position: "absolute",
          backgroundColor: "rgb(255,255,255)",
          width: `100%`,
          height: `${
            window.innerWidth < 700 ? imageHeight * 0.9 + "px" : "100%"
          }`,
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          width: `100%`,
          height: `${
            window.innerWidth < 700 ? imageHeight * 0.9 + "px" : "100%"
          }`,
          backgroundImage: `url(${kantoMap})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          opacity: `${selectedPokemon === null ? 1 : 0.85}`,
        }}
      ></div>
      <div
        style={{
          display: "grid",
          position: "absolute",
          width: `100%`,
          height: `${
            window.innerWidth < 700 ? imageHeight * 0.9 + "px" : "100%"
          }`,
          gridTemplateRows: "repeat(60, 1fr)",
          gridTemplateColumns: "repeat(100, 1fr)",
        }}
      >
        {renderRoutes()}
      </div>
      {/*If no routes are found for a selected pokemon, indicate location unknown*/}
      {locations.length === 0 && selectedPokemon && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            backgroundColor: "rgb(50,50,50)",
            color: "white",
            transform: "translate(-50%, -50%)",
            padding: "0.5rem 0.75rem 0.5rem 0.75rem",
            borderRadius: "0.75rem",
          }}
        >
          Location Unknown
        </div>
      )}
      {selectedPokemon && (
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "50%",
            backgroundColor: "rgb(50,50,50)",
            color: "white",
            transform: "translateX(-50%)",
            padding: "0 0.75rem 0.5rem 0.75rem",
          }}
        >
          <span>{`${selectedPokemon?.name}'s Locations`}</span>
        </div>
      )}
    </section>
  );
};

export default Map;
