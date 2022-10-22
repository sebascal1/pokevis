import * as d3 from "d3";
import React, { useEffect, useRef } from "react";
import { VisProps } from "../Utils/types";
import { colourTypeScale } from "../Utils";

type PieCharEntry = {
  name: string;
  value: number;
};

export type treeEntry = {
  name: string;
  children: treeEntry[];
};

const Vis: React.FC<VisProps> = ({ data }) => {
  console.log(data);
  const svgRef = useRef<SVGSVGElement | null>(null);
  let donutThickness = 50;
  let width = window.innerWidth; // outer width, in pixels
  let height = window.innerHeight; // outer height, in pixels
  let innerRadius = Math.min(width, height) / 4; // inner radius of pie, in pixels (non-zero for donut)
  let outerRadius = innerRadius + donutThickness; // outer radius of pie, in pixels
  let innerRadius2 = Math.min(width, height) / 3;
  let outerRadius2 = innerRadius2 + donutThickness; // outer radius of pie, in pixels
  let labelRadius = (innerRadius + outerRadius) / 2; // center radius of labels
  let stroke = innerRadius > 0 ? "none" : "white"; // stroke separating widths
  let strokeWidth = 1; // width of stroke separating wedges
  let strokeLinejoin = "round"; // line join of stroke separating wedges
  let padAngle = stroke === "none" ? 1 / outerRadius : 0; // angular separation between wedges

  const nameAccessor = (d: PieCharEntry) => d.name;
  const valueAccessor = (d: PieCharEntry) => d.value;

  // Construct arcs.

  useEffect(() => {
    let pieChartData: any = {};
    let secondaryData: any = {};

    console.log(data);
    //need to parse the data, print out a simple donut chart to begin with
    for (let i = 0; i < data.length; i++) {
      let entry = data[i];

      if (pieChartData[entry.type1] !== undefined) {
        pieChartData[entry.type1].value = pieChartData[entry.type1].value + 1;
      } else {
        pieChartData[entry.type1] = { name: entry.type1, value: 1 };
      }

      if (entry.type1 === "fire") {
        let type2 = entry.type2 === "" ? "fire" : entry.type2;

        if (secondaryData[type2] !== undefined) {
          secondaryData[type2].value = secondaryData[type2].value + 1;
        } else {
          secondaryData[type2] = { name: type2, value: 1 };
        }
      }
    }

    let dataObject: any = {};

    for (let i = 0; i < data.length; i++) {
      let entry = data[i];
      if (dataObject[entry.type1] === undefined)
        dataObject[entry.type1] = { name: entry.type1, children: [] };

      let type2 = entry.type2 === "" ? entry.type1 : entry.type2;
      let typeIndex = (entry: { name: string }) => entry.name === type2;
      //console.log(dataObject[entry.type1].children.findIndex(typeIndex));
      let index = dataObject[entry.type1].children.findIndex(typeIndex);
      if (index < 0) {
        dataObject[entry.type1].children.push({ name: type2, children: [] });
        dataObject[entry.type1].children[
          dataObject[entry.type1].children.length - 1
        ].children.push(entry);
      } else {
        dataObject[entry.type1].children[index].children.push(entry);
      }
    }

    console.log(dataObject);

    console.log(secondaryData);

    let primaryTypeArray: PieCharEntry[] = [];
    for (let entry in pieChartData) {
      primaryTypeArray.push({ name: entry, value: pieChartData[entry].value });
    }

    console.log(primaryTypeArray);

    // Compute values.
    const N = d3.map(primaryTypeArray, nameAccessor);
    const V = d3.map(primaryTypeArray, valueAccessor);
    const I = d3.range(N.length).filter((i) => !isNaN(V[i]));

    console.log(N);
    console.log(V);
    console.log(I);

    //draw the graph
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear svg content before adding new elements

    const arcs = d3
      .pie()
      .padAngle(padAngle)
      .sort((a: any, b: any) => d3.descending(V[a], V[b]))
      .value((i: any) => V[i])(I);
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
    const outerArc = d3
      .arc()
      .innerRadius(innerRadius2)
      .outerRadius(outerRadius2);

    console.log(arcs);
    console.log(arc);

    //need to get the data for the smaller arcs, however as a whole

    //try to get the smaller arcs
    let smallerArcs = [];
    let initAngle = arcs[1].startAngle;
    let endAngle = arcs[1].endAngle;

    console.log(Object.entries(secondaryData));

    let arrayObject = Object.entries(secondaryData);
    let angleSofar = initAngle;
    let radsPerValue = (endAngle - initAngle) / arcs[1].value;

    for (let i = 0; i < arrayObject.length; i++) {
      // @ts-ignore
      let totalRads = radsPerValue * arrayObject[i][1].value;

      let start = angleSofar;
      let end = start + totalRads;

      angleSofar += totalRads;

      let payload = {
        data: i,
        index: i,
        padAngle: 0.0033927056827820186 / 1.5,
        // @ts-ignore
        value: arrayObject[i][1].value,
        // @ts-ignore
        name: arrayObject[i][1].name,
        startAngle: start,
        endAngle: end,
      };

      smallerArcs.push(payload);
    }

    console.log(smallerArcs);

    //setup of the svg graph
    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    //setup of the inner pie chart (for the primary data types)
    svg
      .append("g")
      .attr("stroke", stroke)
      .attr("stroke-width", strokeWidth)
      .attr("stroke-linejoin", strokeLinejoin)
      .selectAll("path")
      .data(arcs)
      .join("path")
      // @ts-ignore
      .attr("fill", (d) => colourTypeScale[N[d.data]])
      // @ts-ignore
      .attr("d", arc);

    //setup of the outer pie chart (for the primary data types)
    svg
      .append("g")
      .attr("stroke", stroke)
      .attr("stroke-width", strokeWidth)
      .attr("stroke-linejoin", strokeLinejoin)
      .selectAll("path")
      .data(smallerArcs)
      .join("path")
      // @ts-ignore
      .attr("fill", (d) => colourTypeScale[d.name])
      // @ts-ignore
      .attr("d", outerArc);
  }, [data]);

  return <svg ref={svgRef} width={width} height={height} />;
};

export default Vis;
