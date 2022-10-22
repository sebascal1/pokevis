import * as d3 from "d3";
import React, { useEffect, useRef, useState } from "react";
import { rawDataEntry, VisProps } from "../Utils/types";
import { colourTypeScale, pokemonTypes } from "../Utils";
import PokedexEntry from "./pokedexEntry";
import { HierarchyNode } from "d3";

const TreeVis: React.FC<VisProps> = ({ data }) => {
  const [hoveredPokemonData, setHoveredPokemonData] =
    useState<HierarchyNode<rawDataEntry> | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);
  let width = window.innerWidth; // // outer width, in pixels
  let height = window.innerHeight; // outer height, in pixels
  let radius = Math.min(width, height) / 2;
  let donutThickness = 25;
  let innerRadius = radius / 2.4; // inner radius of pie, in pixels (non-zero for donut)
  let outerRadius = innerRadius + donutThickness; // outer radius of pie, in pixels
  let innerRadius2 = radius / 1.3;
  let outerRadius2 = innerRadius2 + donutThickness; // outer radius of pie, in pixels

  const r = 2; // radius of nodes
  // @ts-ignore
  const stroke = "#555"; // stroke for links
  const strokeWidth = 2; // stroke width for links
  const strokeOpacity = 0.4; // stroke opacity for linkss
  const halo = "#fff"; // color of label halo
  const haloWidth = 3; // padding around the labels

  //root for the tree graph
  useEffect(() => {
    const numberOfGradientStops = 3;
    const stops = d3
      .range(numberOfGradientStops)
      .map((i) => i / (numberOfGradientStops - 1));

    const partition = (data: any) =>
      d3.partition().size([2 * Math.PI, radius * radius])(
        d3
          .hierarchy(data)
          .sum((d) => d.value)
          // @ts-ignore
          .sort((a, b) => a.value - b.value)
      );

    const attackAccessor = (d: rawDataEntry) => parseInt(d.attack);
    const defenseAccessor = (d: rawDataEntry) => parseInt(d.defense);
    const spAttackAccessor = (d: rawDataEntry) => parseInt(d.sp_attack);
    const spDefenseAccessor = (d: rawDataEntry) => parseInt(d.sp_defense);
    const speedAccessor = (d: rawDataEntry) => parseInt(d.speed);

    let dataObject: any = {};

    //parse the data in an object that can then be fed into the d3 tree hierarchy
    for (let i = 0; i < data.length; i++) {
      let entry: any = data[i];
      entry.value = 1;
      if (dataObject[entry.type1] === undefined)
        dataObject[entry.type1] = { name: entry.type1, children: [] };

      let type2 = entry.type2 === "" ? entry.type1 : entry.type2;
      let typeIndex = (entry: { name: string }) => entry.name === type2;
      let index = dataObject[entry.type1].children.findIndex(typeIndex);
      if (index < 0) {
        dataObject[entry.type1].children.push({ name: type2, children: [] });
        dataObject[entry.type1].children[
          dataObject[entry.type1].children.length - 1
        ].children.push(entry);
        dataObject[entry.type1].children[
          dataObject[entry.type1].children.length - 1
        ].value = 1;
      } else {
        dataObject[entry.type1].children[index].children.push(entry);
        dataObject[entry.type1].children[index].value =
          dataObject[entry.type1].children[index].children.length;
      }
    }
    let dataArr = [];
    for (let entry in dataObject) {
      dataArr.push(dataObject[entry]);
    }

    //make a data object with a parent root node to which it's children are the previously generated data
    let dataObj = { name: "root", children: dataArr };

    const root = partition(dataObj);

    // Compute labels and titles.
    const descendants = root.descendants();
    // @ts-ignore
    const L: string[] = descendants.map((d) => d.data?.name) as string[];

    //Arc graphs
    const arc = d3
      .arc()
      // @ts-ignore
      .startAngle((d) => d.x0)
      // @ts-ignore
      .endAngle((d) => d.x1)
      .padAngle(1 / radius)
      .padRadius(radius)
      // @ts-ignore
      .innerRadius((d) => {
        // @ts-ignore
        if (d.depth === 1) {
          return innerRadius;
          // @ts-ignore
        } else if (d.depth === 2) {
          return innerRadius2;
        }
      })
      // @ts-ignore
      .outerRadius((d) => {
        // @ts-ignore
        if (d.depth === 1) {
          return outerRadius;
          // @ts-ignore
        } else if (d.depth === 2) {
          return outerRadius2;
        }
      })
      .cornerRadius(() => {
        return 5;
      });

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear svg content before adding new elements

    const defs = svg.append("defs");
    pokemonTypes.forEach((type) => {
      for (let i = 0; i < pokemonTypes.length; i++) {
        //if (type === pokemonTypes[i]) return;
        let legendGradientId = `${type}-${pokemonTypes[i]}`;
        defs
          .append("linearGradient")
          .attr("id", legendGradientId)
          .selectAll("stop")
          .data(stops)
          .enter()
          .append("stop")
          // @ts-ignore
          .attr("stop-color", (d) =>
            d3.interpolateRgb(
              // @ts-ignore
              colourTypeScale[pokemonTypes[i]],
              // @ts-ignore
              colourTypeScale[type]
            )(d)
          )
          .attr("offset", (d) => `${d < 0.5 ? 20 : d * 100}%`);
      }
    });

    svg
      .attr("viewBox", `${-radius} ${-radius} ${radius * 2} ${radius * 2}`)
      .style("max-width", `${width}px`)
      .style("font", "8px sans-serif");

    // Compute the for the tree layout.
    d3
      .tree()
      .size([2 * Math.PI, outerRadius2 + 10])
      // @ts-ignore
      .separation((a, b) => (a.parent === b.parent ? 1.5 : 1.5))(root);

    svg
      .append("g")
      .selectAll("path")
      .data(root.links())
      .join("path")
      .attr("id", "treePath")
      .attr("fill", "none")
      .attr("stroke", (d) => {
        // @ts-ignore
        if (d.target.depth > 2)
          // @ts-ignore
          return `url(#${d.source.parent.data.name}-${
            // @ts-ignore
            d.target.data.type2 === ""
              ? // @ts-ignore
                d.target.data.type1
              : // @ts-ignore
                d.target.data.type2
          })`;
        else {
          // @ts-ignore
          return colourTypeScale[d.source.data.name];
        }
      })
      .attr("stroke-opacity", strokeOpacity)
      .attr("stroke-linecap", true)
      .attr("stroke-linejoin", true)
      .attr("stroke-width", strokeWidth)
      .attr(
        "d",
        // @ts-ignore
        d3
          .linkRadial()
          // @ts-ignore
          .angle((d) => d.x)
          // @ts-ignore
          .radius((d) => d.y)
      );

    svg
      .append("g")
      .selectAll("path")
      .data(root.descendants())
      .join("path")
      // @ts-ignore
      .attr("fill", (d) => {
        if (d.depth > 0 && d.depth < 3) {
          // @ts-ignore
          return colourTypeScale[d.data.name];
        }
      })
      .attr("id", "donutArc")
      // @ts-ignore
      .attr("d", arc)
      // @ts-ignore
      .on("mouseenter", function (e, datum: HierarchyNode<rawDataEntry>) {
        d3.selectAll("#treePath").attr("stroke-opacity", 0.15);

        svg
          .selectAll("#donutArc")
          // @ts-ignore
          .filter((d: any) => {
            if (datum.depth === 1) {
              return (
                (d.depth === 2 && d.parent.data.name !== datum.data.name) ||
                (d.depth === 1 && d.data.name !== datum.data.name)
              );
            } else if (datum.depth === 2) {
              return (
                d.depth === 2 ||
                (d.depth === 1 &&
                  // @ts-ignore
                  d.data.name !== datum.parent.data.name)
              );
            } else {
              return d;
            }
          })
          .style("opacity", 0.25);
        d3.select(this).style("opacity", 1);
      })
      .on("mouseleave", function () {
        svg.selectAll("#donutArc").style("opacity", 1);
        d3.selectAll("#treePath").style("stroke-opacity", strokeOpacity);
      });

    const node = svg
      .append("g")
      .selectAll("a")
      .data(root.descendants())
      .join("a")
      //.attr("target", link == null ? null : linkTarget)
      .attr(
        "transform",
        (d: any) => `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0)`
      );

    if (L)
      node
        .append("g")
        .append("text")
        .attr("transform", (d: any) => `rotate(${d.x >= Math.PI ? 180 : 0})`)
        .attr("dy", "0.32em")
        .attr("x", (d: any) => (d.x < Math.PI && !d.children ? 12 : -12))
        .attr("text-anchor", (d: any) =>
          d.x < Math.PI && !d.children ? "start" : "end"
        )
        .attr("paint-order", "stroke")
        .attr("stroke", halo)
        .attr("stroke-width", haloWidth)
        .style("font-size", (d: HierarchyNode<any>) =>
          d.data?.name === hoveredPokemonData?.data.name ? "15px" : "5px"
        )
        .text((d, i) => (d.depth < 3 ? "" : L[i]));

    node
      .append("circle")
      .attr("fill", stroke)
      // @ts-ignore
      .attr(
        "id",
        (d) =>
          // @ts-ignore
          `${d.data.pokedex_number}-${d.data.name}`
      )
      .attr("class", "pokemonCircle")
      .attr("r", (d) => (d.children ? 0 : r))
      .on("mouseenter", function (e, datum: HierarchyNode<any>) {
        if (datum.depth !== 3) return;
        setHoveredPokemonData(datum as HierarchyNode<rawDataEntry>);
        d3.select(this).attr("r", 5);
      })
      .on("mouseleave", function () {
        setHoveredPokemonData(null);
        d3.select(this).attr("r", r);
      });

    //a circle in the inner part of the vis in order to hide the origin of the tree
    svg
      .append("circle")
      .attr("cy", 0)
      .attr("cx", 0)
      .attr("r", innerRadius)
      .attr("fill", "white");

    //draw the stats for the pokemon stats
    let maxStats: number[] = [
      d3.max(data, attackAccessor) as number,
      d3.max(data, defenseAccessor) as number,
      d3.max(data, spAttackAccessor) as number,
      d3.max(data, spDefenseAccessor) as number,
      d3.max(data, speedAccessor) as number,
    ];

    let statLabels = ["attack", "defense", "sp attack", "sp defense", "speed"];

    if (hoveredPokemonData !== null) {
      let pokemonStats = [
        attackAccessor(hoveredPokemonData?.data),
        defenseAccessor(hoveredPokemonData?.data),
        spAttackAccessor(hoveredPokemonData?.data),
        spDefenseAccessor(hoveredPokemonData?.data),
        speedAccessor(hoveredPokemonData?.data),
      ];

      pokemonStats.forEach((stat, i) => {
        //let angle = (stat / maxStats[i]) * 2 * Math.PI;
        let statThickness = 10;
        let outerRad = innerRadius - 10 - statThickness * i;
        let statArc = d3
          .arc()
          .innerRadius(outerRad - statThickness)
          .outerRadius(outerRad)
          .startAngle(0)
          .cornerRadius(5)
          .padAngle(0)
          .padRadius(0)
          .endAngle((-stat / maxStats[i]) * 2 * Math.PI);

        let shade = 120 + (i / 5) * 100;
        console.log(statArc);
        // drawing it !
        svg
          .append("path")
          // @ts-ignore
          .attr("d", statArc)
          .attr("fill", "none")
          .attr("stroke-width", "1")
          .attr("stroke", "black")
          .attr("fill", `rgb(${shade}, ${shade}, ${shade})`);

        // svg
        //   .append("text")
        //   .text(stat)
        //   .attr("x", outerRad * Math.cos(angle - 0.11))
        //   .attr("y", outerRad * Math.sin(angle - 0.1))
        //   .style("font-size", 12)
        //   .style("fill", "black");
        // .attr("stroke-width", haloWidth);

        svg
          .append("text")
          .text(statLabels[i])
          .attr("x", 5)
          .attr("y", -outerRad + statThickness / 2 + 3)
          .attr("fill", "black")
          .style("font-size", 10)
          .attr("stroke-width", haloWidth);
      });

      //   maxStats.forEach((stat, i) => {
      //     let angle = (pokemonStats[i] / stat) * 2 * Math.PI;
      //     let outerRad = innerRadius - 10 - 17 * i;
      //   //   svg
      //   //     .append("text")
      //   //     .text(stat)
      //   //     .attr("x", outerRad * Math.cos(angle))
      //   //     .attr("y", outerRad * Math.sin(angle))
      //   //     .attr("stroke", "red")
      //   //     .style("font-size", 15)
      //   //     .style("fill", "black");
      //   // });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoveredPokemonData]);

  return (
    <React.Fragment>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ position: "absolute" }}
      />
      <PokedexEntry
        data={
          hoveredPokemonData === null
            ? null
            : (hoveredPokemonData?.data as rawDataEntry)
        }
        innerRadius={innerRadius}
        // radius={radius}
      />
    </React.Fragment>
  );
};

export default TreeVis;
