import React, { useEffect, useState } from "react";
import "./App.css";
import Vis from "./Components/Vis";
import * as d3 from "d3";
import { rawDataEntry } from "./Utils/types";
import TreeVis from "./Components/TreeVis";

function App() {
  const [data, setData] = useState<Promise<void> | null | rawDataEntry[]>(null);

  //get the data upon loading the screen
  useEffect(() => {
    const getData = async () => {
      await d3
        .csv("./pokemon.csv")
        .then((response) => {
          console.log("getting response");
          setData(response as unknown as rawDataEntry[]);
        })
        .catch((e) => {
          console.log(e);
        });
    };
    getData();
  }, []);
  return (
    <div className="App" style={{ position: "absolute" }}>
      {data !== null && <TreeVis data={data as rawDataEntry[]} />}
    </div>
  );
}

export default App;
