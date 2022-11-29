import React, { useEffect, useState } from "react";
import "./App.css";
import * as d3 from "d3";
import { rawDataEntry } from "./Utils/types";
import TreeVis from "./Components/TreeVis";
import Map from "./Components/Map";
import PokemonInfo from "./Components/PokemonInfo";
//import Sidebar from "./Components/Sidebar";

function App() {
  //set the data as a state entry to be able to use throughout the app
  const [data, setData] = useState<Promise<void> | null | rawDataEntry[]>(null);
  // const [sidebarActive, setActiveBar] = useState(true);

  //get the data upon loading the app for the first time
  useEffect(() => {
    d3.csv("./pokemon.csv")
      .then((response) => {
        setData(response as unknown as rawDataEntry[]);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <React.Fragment>
      <article className="App">
        <header style={{ display: "flex", justifyContent: "center" }}>
          <h1>Kanto National Pokédex</h1>
        </header>
        <main className="main">
          {/*Display the Map component*/}
          <Map />
          <PokemonInfo />
          {/*If the data has been loaded successfully, display treeVis component and pass the loaded data*/}
          {data !== null && <TreeVis data={data as rawDataEntry[]} />}
          <div
            style={{
              position: "absolute",
              right: "4rem",
              top: "6rem",
              borderRadius: "50%",
              height: "3rem",
              width: "3rem",
              border: "1px solid black",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#35c6ec",
            }}

            //onClick={() => setActiveBar(true)}
          >
            <a
              style={{ color: "white" }}
              href={
                "https://drive.google.com/file/d/13TA6Z8mnwtP2uZM5hTsWIDQ-hMoC66rn/view?usp=sharing"
              }
            >
              ?
            </a>
          </div>
          {/*<Sidebar active={sidebarActive} setActive={setActiveBar} />*/}
        </main>
        <footer></footer>
      </article>
    </React.Fragment>
  );
}

export default App;
