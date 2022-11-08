import React, { useEffect, useState } from "react";
import "./App.css";
import * as d3 from "d3";
import { rawDataEntry } from "./Utils/types";
import TreeVis from "./Components/TreeVis";
import Map from "./Components/Map";

function App() {
  const [data, setData] = useState<Promise<void> | null | rawDataEntry[]>(null);

  //get the data upon loading the screen
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
          <h1>Welcome to Kanto</h1>
        </header>
        <main className="main">
          <Map />
          {data !== null && <TreeVis data={data as rawDataEntry[]} />}
        </main>
        <footer></footer>
      </article>
    </React.Fragment>
  );
}

export default App;
