import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import kantoMap from "./kantoMap.png";
import "./map.css";

//component that deals with the rendering and updating of the map component
const Map = () => {
  //get the reference for the map div
  const containerRef = useRef<HTMLDivElement | null>(null);
  //determine the image width to be used for the map based on the inner width of the screen
  const imageWidth =
    window.innerWidth < 700
      ? window.innerWidth
      : 0.5 * window.innerWidth * 0.95;
  //determine the image height to be used for the map based on the value for the width
  const imageHeight = imageWidth * 0.6;
  //get the selected pokemon from the redux state
  // @ts-ignore
  const selectedPokemon = useSelector((state) => state.selectedPokemon);
  //generate the locations array state
  const [locations, setLocation] = useState<any[]>([]);
  //function to get the routes a pokemon is in, the function takes in a string and seperates its contents to get the number of the route.
  //special case for when it's a route in the sea
  const getRoutes = (entry: string) => {
    if (entry.includes("sea")) {
      return entry.split("-")[3];
    } else {
      return entry.split("-")[2];
    }
  };

  //useEffect hook to be activated when the selected pokemon is updated
  useEffect(() => {
    if (selectedPokemon === null || selectedPokemon === undefined) {
      setLocation([]);
      return;
    }

    //get the routes from only the games which feature kanto as the setting
    const allowedGames = [
      "red",
      "blue",
      "green",
      "firered",
      "leafgreen",
      "yellow",
    ];

    //get the location data from the api using the pokemon's name
    const getData = async () => {
      let locs = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${selectedPokemon?.name.toLowerCase()}/encounters`
      );

      //filter the locations to only extract those with the word route in them
      const filteredLocs = locs.data.filter(
        (location: any) =>
          allowedGames.includes(location.version_details[0].version.name) &&
          location.location_area.name.includes("route")
      );

      //filter the routes to only get the numbers
      const filteredRoutes = filteredLocs.map((entry: any) =>
        getRoutes(entry.location_area.name)
      );

      //set the locations
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

  //render the routes based on the retrieved locations from the api
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

  //render the contents
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
      {/*put a white background in order to make the map clearer when the opacity is turned down*/}
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
      {/* Div responsible for rendering the map image as it's background*/}
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
      {/*div to be used to render the routes a pokemon is found in using the grid system*/}
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
      {/*  if a pokemon is selected, show a small header ssaying the pokemon's location */}
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
