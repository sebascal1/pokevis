import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import kantoMap from "./kantoMap.png";
import "./map.css";

const Map = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageWidth = 0.5 * window.innerWidth;
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
    if (selectedPokemon === null) return;
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
        `https://pokeapi.co/api/v2/pokemon/${selectedPokemon.toLowerCase()}/encounters`
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

  console.log(locations);

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
    return mapArr.map((entry) => {
      return (
        <div
          className="route"
          id={`route${entry}`}
          style={{ opacity: `${locations.includes(entry) ? 0.7 : 0}` }}
        />
      );
    });
  };

  return (
    <section
      ref={containerRef}
      style={{
        display: "flex",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "grid",
          backgroundColor: "red",
          width: `${imageWidth}px`,
          height: `${imageHeight}px`,
          gridTemplateRows: "repeat(60, 1fr)",
          gridTemplateColumns: "repeat(100, 1fr)",
          backgroundImage: `url(${kantoMap})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
        }}
      >
        {renderRoutes()}
      </div>
    </section>
  );
};

export default Map;
