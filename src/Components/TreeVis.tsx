import * as d3 from "d3";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { rawDataEntry, VisProps } from "../Utils/types";
import { baseTotalColors, colourTypeScale, pokemonTypes } from "../Utils";
import PokedexEntry from "./pokedexEntry";
import { HierarchyNode } from "d3";
import { selectPokemon, UpdateClicked } from "../Actions";
import { RootState } from "../rootReducer";

const TreeVis: React.FC<VisProps> = ({ data }) => {
  const [pokemon, setPokemon] = useState<rawDataEntry | null>(null);
  //const [clicked, toggleClick] = useState(false);
  const combatStats = useSelector((state: RootState) => state.combatStats);
  const selectedPokemon = useSelector(
    (state: RootState) => state.selectedPokemon
  );
  const clicked = useSelector((state: RootState) => state.clicked);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const width =
    window.innerWidth < 700
      ? window.innerWidth * 0.95
      : 0.5 * window.innerWidth * 0.95; // // outer width, in pixels
  let radius = width / 2.5; //get the radius as half the width
  let donutThickness = 10; //thickness for each arc
  let innerRadius = radius / 2; // inner radius of pie, in pixels (non-zero for donut)
  let outerRadius = innerRadius + donutThickness; // outer radius of pie, in pixels
  let innerRadius2 = radius / 1.4;
  let outerRadius2 = innerRadius2 + donutThickness; // outer radius of pie, in pixels
  const mobileView = window.innerWidth < 700;

  const r = 2; // radius of nodes
  // @ts-ignore
  const stroke = "#555"; // stroke for links
  const strokeWidth = 2; // stroke width for links
  const strokeOpacity = 0.4; // stroke opacity for linkss
  //const halo = "#fff"; // color of label halo
  //const haloWidth = 3; // padding around the labels
  const dispatch = useDispatch();
  const filteredData = data.filter((d) => parseInt(d.pokedex_number) < 152);
  const chosenPokemon = pokemon !== null ? pokemon : selectedPokemon;

  //when the component loads, or the selected pokemon changes, run the following useEffect hook
  useEffect(() => {
    //number of colour stops to use to create the line gradients for the flow lines connecting the two circles
    const numberOfGradientStops = 2;
    const stops = d3
      .range(numberOfGradientStops)
      .map((i) => i / (numberOfGradientStops - 1));

    //set up the size for the circular tree graph
    const partition = (data: any) =>
      d3.partition().size([2 * Math.PI, radius * radius])(
        d3
          .hierarchy(data)
          .sum((d) => d.value)
          // @ts-ignore
          .sort((a, b) => a.value - b.value)
      );

    //accessors to access the data in the file
    const attackAccessor = (d: rawDataEntry) => parseInt(d.attack);
    const defenseAccessor = (d: rawDataEntry) => parseInt(d.defense);
    const spAttackAccessor = (d: rawDataEntry) => parseInt(d.sp_attack);
    const spDefenseAccessor = (d: rawDataEntry) => parseInt(d.sp_defense);
    const speedAccessor = (d: rawDataEntry) => parseInt(d.speed);

    //create an initial data object to store the data
    let dataObject: any = {};

    //parse the data in an object that can then be fed into the d3 tree hierarchy
    for (let i = 0; i < data.length; i++) {
      let entry: any = data[i];
      //grab only the original 151 pokemon
      if (entry.pokedex_number > 151) continue;
      entry.value = 1; //dummy variable, has no use in the roots of the tree but is needed to create the tree correctly in the lower levels, as we use it for sorting purposes

      //if there is no entry yet for the primary data type, create one along with a children node to store secondary types
      if (dataObject[entry.type1] === undefined)
        dataObject[entry.type1] = { name: entry.type1, children: [] };

      //if type2 field is empty, assign it as type1 (it means it only has 1 type)
      let type2 = entry.type2 === "" ? entry.type1 : entry.type2;
      //function to get a matching data type
      let typeIndex = (entry: { name: string }) => entry.name === type2;
      //get the index of the data type in the children array of the first data type
      let index = dataObject[entry.type1].children.findIndex(typeIndex);

      //if index is less than 0, it means it doesnt exist yet, so create it and append it to the children of type1
      //also include a children node in order to store the pokemons
      if (index < 0) {
        dataObject[entry.type1].children.push({ name: type2, children: [] });
        dataObject[entry.type1].children[
          dataObject[entry.type1].children.length - 1
        ].children.push(entry);
        dataObject[entry.type1].children[
          dataObject[entry.type1].children.length - 1
        ].value = 1;
      } else {
        //the type exists already, simply push the pokemon entry
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
    // @ts-ignore
    const baseStatScale = d3
      .scaleLinear()
      // @ts-ignore
      .domain([0, d3.extent(filteredData, (d) => d.base_total)[1]])
      .range([0, 30]);

    //create the root object for the tree data
    const root = partition(dataObj);

    // Compute labels and titles.
    // const descendants = root.descendants();
    // @ts-ignore
    //const L: string[] = descendants.map((d) => d.data?.name) as string[];

    //create the Arcs for the inner and outer circles in order to group pokemon of similar types together
    const arc = d3
      .arc()
      // @ts-ignore
      .startAngle((d) => {
        // @ts-ignore
        return d.x0;
      })
      // @ts-ignore
      .endAngle((d) => {
        // @ts-ignore
        return d.x1;
      })
      .padAngle(1 / radius)
      .padRadius(radius)
      //set the innerRadius of the tree arc depending on the level
      // @ts-ignore
      .innerRadius((d) => {
        // @ts-ignore
        if (d.depth === 1) {
          return innerRadius;
          // @ts-ignore
        } else if (d.depth === 2) {
          return innerRadius2;
          // @ts-ignore
        }
      })
      //set the outerRadius of the tree arc depending on the level
      // @ts-ignore
      .outerRadius((d) => {
        // @ts-ignore
        if (d.depth === 1) {
          return outerRadius;
          // @ts-ignore
        } else if (d.depth === 2) {
          return outerRadius2;
          // @ts-ignore
        }
      })
      //set the corner radius
      .cornerRadius(() => {
        return 5;
      });

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear svg content before adding new elements

    //create definitions for the color gradients we may have for the paths connecting the inner and outer arc trees
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
          .attr("stop-color", (d) => {
            return d3.interpolateRgb(
              // @ts-ignore
              colourTypeScale[pokemonTypes[i]],
              // @ts-ignore
              colourTypeScale[type]
            )(d);
          })
          .attr("offset", (d) => `${d * 100}%`);
      }
    });

    //def for setting the glow effect
    //Container for the gradients

    //Filter for the outside glow
    const filter = defs.append("filter").attr("id", "glow");
    filter
      .append("feGaussianBlur")
      .attr("stdDeviation", "1.5")
      .attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    //set the svg attributes
    svg
      .attr("viewBox", `${-radius} ${-radius} ${radius * 2} ${radius * 2}`)
      .style("max-width", `${width}px`)
      .style("font", "8px sans-serif");

    // Compute the tree layout.
    d3
      .tree()
      .size([2 * Math.PI, outerRadius2 + 10])
      //separation value for the leaves of the tree (i.e the pokemons), set up so their separation coincides the types in the arc tree
      // @ts-ignore
      .separation((a, b) => (a.parent === b.parent ? 1.5 : 1.5))(root);

    //create the paths that connect the tree arcs and extend to the leaves (individual pokemon entries)
    svg
      .append("g")
      .selectAll("path")
      .data(root.links())
      .join("path")
      .attr("id", "treePath")
      .attr("fill", "none")
      .attr("stroke", (d: any) => {
        // @ts-ignore
        if (d.target.depth > 2) {
          let type1;
          let type2;
          //need to determine which half of the circle the node is at in order to select the correct colour gradient
          // as the gradient flow is reverse for the second half of the circ;e
          //for the path
          if (d.target.x < Math.PI) {
            type1 =
              d.target.data.type2 === ""
                ? d.target.data.type1
                : d.target.data.type2;
            type2 = d.source.parent.data.name;
          } else {
            type2 =
              d.target.data.type2 === ""
                ? d.target.data.type1
                : d.target.data.type2;
            type1 = d.source.parent.data.name;
          }

          // @ts-ignore
          return `url(#${type1}-${type2})`;
        } else {
          // @ts-ignore
          return "none";
        }
      })
      .style("stroke-opacity", strokeOpacity)
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
      ); //generate the link

    //create the arcs for both the inner and outer donuts
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
      //when the mouse enter an arc, highlight the subset of pokemon (and secondary types if it is an inner arc) that belong to that arc
      // @ts-ignore
      .on("mouseenter", function (e, datum: HierarchyNode<rawDataEntry>) {
        if (clicked) return;
        //mute all paths that dont belong to the subset
        d3.selectAll("#treePath")
          .filter((d: any) => {
            if (datum.depth === 1) {
              return (
                d.source.depth === 2 &&
                d.source.parent.data.name !== datum.data.name
              );
            } else {
              return (
                (d.source.depth === 2 &&
                  d.source.parent.data.name !== datum.parent?.data.name) ||
                d.source.data.name !== datum.data.name
              );
            }
          })
          .style("stroke-opacity", 0.05);

        //mute all the leaves that dont belong to the subset
        svg
          .selectAll("#pokeball")
          // @ts-ignore
          .filter((d: any) => {
            if (datum.depth === 1) {
              return d.data.type1 !== datum.data.name;
            } else {
              return (
                (d.data.type2 !== "" ? d.data.type2 : d.data.type1) !==
                  datum.data.name ||
                !(
                  d.depth === 3 &&
                  datum.data.name === d.parent.data.name &&
                  datum.parent?.data.name === d.parent.parent.data.name
                )
              );
            }
          })
          .style("opacity", 0.05);

        //mute all the donut arcs that dont belong to the subset
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
          .style("opacity", 0.05);
        d3.select(this).style("opacity", 1);
      })
      //on mouse leave event, reset everything to default
      .on("mouseleave", function () {
        if (clicked) return;
        svg.selectAll("#donutArc").style("opacity", 1);
        d3.selectAll("#treePath").style("stroke-opacity", strokeOpacity);
        svg.selectAll("#pokeball").style("opacity", 1);
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

    // if (L)
    //   node
    //     .append("g")
    //     .append("text")
    //     .attr("transform", (d: any) => `rotate(${d.x >= Math.PI ? 180 : 0})`)
    //     .attr("dy", "0.32em")
    //     .attr("x", (d: any) => (d.x < Math.PI && !d.children ? 12 : -12))
    //     .attr("text-anchor", (d: any) =>
    //       d.x < Math.PI && !d.children ? "start" : "end"
    //     )
    //     .attr("paint-order", "stroke")
    //     .attr("stroke", halo)
    //     .attr("stroke-width", haloWidth)
    //     .style("font-size", (d: HierarchyNode<any>) =>
    //       d.data?.name === hoveredPokemonData?.data.name ? "15px" : "5px"
    //     )
    //     .text((d, i) => (d.depth < 3 ? "" : L[i]))
    //     .style("background", "#def1f1");

    //Apply to your element(s)
    node
      .append("circle")
      .attr("r", (d) => (d.children ? 0 : 3.5))
      .attr("cx", 0)
      .attr("cy", 0)
      .style("fill", "none")
      .style("stroke", (d: any) => {
        const { strengths, weakness } = combatStats;
        if (strengths.includes(d.data.type1)) {
          return "#0154a5";
        } else if (weakness.includes(d.data.type1)) {
          return "red";
        } else {
          return "none";
        }
      })
      .style("filter", (d: any) => {
        const { strengths, weakness } = combatStats;
        if (
          strengths.includes(d.data.type1) ||
          weakness.includes(d.data.type1)
        ) {
          return "url(#glow)";
        }

        return "";
      });

    // @ts-ignore
    node
      .append("circle")
      .attr("fill", (d: HierarchyNode<any>) =>
        d.data.is_legendary > 0 ? "#e29f12" : stroke
      )
      .attr("id", "pokeball")
      .attr("class", "pokemonCircle")
      .attr("r", (d: any) =>
        d.children
          ? 0
          : d.data.name === chosenPokemon?.name ||
            d.data.name === selectedPokemon?.name
          ? 5
          : r
      )
      .style("fill", `#url("https://github.com/favicon.ico")`)

      .on("mouseenter", function (e, datum: HierarchyNode<any>) {
        //make sure the events only occur for the pokemon circles (the leaves)
        if (datum.depth !== 3) return;
        if (clicked) {
          setPokemon(datum.data);
        } else {
          console.log("entering dispath");
          dispatch(selectPokemon(datum.data));
        }
        svg
          .selectAll("#treePath")
          .filter((d: any) => {
            return d.target.data.name !== datum.data.name;
          })
          .style("opacity", 0.05);

        svg
          .selectAll("#donutArc")
          .filter((d: any) => {
            return (
              (d.depth === 1 &&
                d.data.name !== datum.parent?.parent?.data.name) ||
              (d.depth === 2 &&
                !(
                  d.data.name === datum.parent?.data.name &&
                  d.parent.data.name === datum.parent?.parent?.data.name
                ))
            );
          })
          .style("opacity", 0.05);

        // @ts-ignore
        svg.selectAll("#pokeball").attr("opacity", (d: any) => {
          if (
            !combatStats.strengths.includes(d.data.type1) &&
            !combatStats.weakness.includes(d.data.type1)
          )
            return 0.05;
        });

        // @ts-ignore
        svg.selectAll("#baseStatTotal").attr("opacity", (d: any) => {
          if (d.data.name === datum.data.name) return 1;

          if (
            !combatStats.strengths.includes(d.data.type1) &&
            !combatStats.weakness.includes(d.data.type1)
          )
            return 0.05;
        });

        d3.select(this).attr("opacity", 5);
        d3.select(this).attr("r", 5);
      })
      .on("mouseout", function () {
        if (!clicked) {
          dispatch(selectPokemon(null));
          d3.select(this).attr("r", r);
        }
        setPokemon(null);
      })
      .on("click", function (d, datum: any) {
        // if (pokemon === datum.data.name) setPokemon(null);
        // else setPokemon(datum.data.name);
        if (clicked) {
          if (datum.data.name === selectedPokemon?.name) {
            dispatch(UpdateClicked(false));
          } else {
            dispatch(selectPokemon(datum.data));
          }
        } else {
          dispatch(UpdateClicked(true));
        }

        if (!clicked) setPokemon(null);
      });

    node
      .append("rect")
      .attr("id", "baseStatTotal")
      .attr("transform", (d: any) => `rotate(${d.x >= Math.PI ? -90 : -90})`)
      .attr("y", "6px")
      .attr("x", "-2px")
      .attr("width", (d) => {
        if (d.depth < 3) return "0px";
        return "4px";
      })
      .attr("height", (d: any) => {
        if (d.depth < 3) return "0px";
        return `${baseStatScale(d.data.base_total)}px`;
      })
      .style("rx", "2px")
      .attr("fill", (d: any) => {
        const baseTotal = d.data.base_total;
        if (baseTotal <= 390) {
          return baseTotalColors["low"];
        } else if (baseTotal <= 585) {
          return baseTotalColors["medium"];
        } else {
          return baseTotalColors["high"];
        }
      });

    //a circle in the inner part of the vis in order to hide the origin of the tree
    svg
      .append("circle")
      .attr("cy", 0)
      .attr("cx", 0)
      .attr("r", innerRadius)
      .attr("fill", "#def1f1");

    //define an array of accessors for the different statistics in order to go through them in an array
    let statAccessors = [
      attackAccessor,
      defenseAccessor,
      spAttackAccessor,
      spDefenseAccessor,
      speedAccessor,
    ];

    let statsArr: any = [];

    //generate the labels for the statistics that will be shown
    const statLabels = ["Atk", "Def", "Sp. Atk.", "Sp. Def", "Spd."];
    const statColors = [
      "red",
      "CornflowerBlue",
      "crimson",
      "darkcyan",
      "goldenrod",
    ];
    const Offsets = [15, 15, 30, 30, 18];

    statLabels.forEach((stat, i) => {
      let statObject: any = { name: stat };

      statObject.max = d3.max(filteredData, statAccessors[i]) as number;
      statObject.min = d3.min(filteredData, statAccessors[i]) as number;
      statObject.mean = d3.mean(filteredData, statAccessors[i]) as number;
      statObject.lq = d3.quantile(
        filteredData,
        0.25,
        statAccessors[i]
      ) as number;
      statObject.uq = d3.quantile(
        filteredData,
        0.75,
        statAccessors[i]
      ) as number;

      statsArr.push(statObject);
    });

    let scaleLength = 2 * (innerRadius - 80);

    let statScale = d3.scaleLinear().domain([0, 255]).range([0, scaleLength]);

    if (chosenPokemon !== null && !mobileView) {
      let pokemonStats = [
        attackAccessor(chosenPokemon),
        defenseAccessor(chosenPokemon),
        spAttackAccessor(chosenPokemon),
        spDefenseAccessor(chosenPokemon),
        speedAccessor(chosenPokemon),
      ];

      statsArr.forEach((stat: any, i: number) => {
        let spacing = 15;
        let boxHeight = 10;
        let yTranslate = 20;

        //scale line
        let statGroup = svg.append("g");

        //pokemon position
        statGroup
          .append("rect")
          .attr("x", 0)
          .attr("y", i * spacing)
          .attr("width", statScale(pokemonStats[i]))
          .attr("height", boxHeight)
          .style(
            "transform",
            `translate(${-scaleLength / 2}px,${yTranslate}px)`
          )
          .style("rx", `${boxHeight / 2}`)
          .style("fill", statColors[i]);

        statGroup
          .append("rect")
          .attr("x", 0)
          .attr("y", i * spacing)
          .attr("width", scaleLength)
          .attr("height", boxHeight)
          .style(
            "transform",
            `translate(${-scaleLength / 2}px,${yTranslate}px)`
          )
          .style("rx", `${boxHeight / 2}`)
          .style("fill", "none")
          .style("stroke", "black");

        //median
        statGroup
          .append("line")
          .attr("x1", statScale(stat.mean))
          .attr("x2", statScale(stat.mean))
          .attr("y1", i * spacing - boxHeight)
          .attr("y2", i * spacing)
          .style("stroke", "black")
          .style("fill", "none")
          .style(
            "transform",
            `translate(${-scaleLength / 2}px,${yTranslate + boxHeight}px)`
          );

        //upper quartile
        statGroup
          .append("line")
          .attr("x1", statScale(stat.uq))
          .attr("x2", statScale(stat.uq))
          .attr("y1", i * spacing - boxHeight)
          .attr("y2", i * spacing)
          .style("stroke", "black")
          .style("fill", "none")
          .style(
            "transform",
            `translate(${-scaleLength / 2}px,${yTranslate + boxHeight}px)`
          );

        //lower quartile
        statGroup
          .append("line")
          .attr("x1", statScale(stat.lq))
          .attr("x2", statScale(stat.lq))
          .attr("y1", i * spacing)
          .attr("y2", i * spacing - boxHeight)
          .style("stroke", "black")
          .style("fill", "none")
          .style(
            "transform",
            `translate(${-scaleLength / 2}px,${yTranslate + boxHeight}px)`
          );

        //min
        statGroup
          .append("line")
          .attr("x1", statScale(stat.min))
          .attr("x2", statScale(stat.min))
          .attr("y1", i * spacing)
          .attr("y2", i * spacing - boxHeight)
          .style("stroke", "black")
          .style("fill", "none")
          .style(
            "transform",
            `translate(${-scaleLength / 2}px,${yTranslate + boxHeight}px)`
          );

        //max
        statGroup
          .append("line")
          .attr("x1", statScale(stat.max))
          .attr("x2", statScale(stat.max))
          .attr("y1", i * spacing)
          .attr("y2", i * spacing - boxHeight)
          .style("stroke", "black")
          .style("fill", "none")
          .style(
            "transform",
            `translate(${-scaleLength / 2}px,${yTranslate + boxHeight}px)`
          );

        //labels
        statGroup
          .append("text")
          .text(statLabels[i])
          .attr("x", 0)
          .attr("y", i * spacing)
          .style("font-weight", "bold")
          .style(
            "transform",
            `translate(${-scaleLength / 2 - Offsets[i]}px,${
              yTranslate + boxHeight - 2
            }px)`
          );
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clicked, chosenPokemon, combatStats]);

  console.log(`value of clicked ${clicked}`);
  console.log(pokemon);

  return (
    <section
      style={{
        display: "inline-block",
        position: "relative",
        // width: `${mobileView ? "100%" : "50%"}`,
        width: "95%",
        clipPath: "polygon(0% 0%, 100% 0%, 100% 80%, 80% 100%, 0% 100%)",
      }}
      className="vis"
    >
      <svg
        ref={svgRef}
        width={width}
        height={width}
        style={{
          background: "#def1f1",
          padding: "15px auto",
          // border: "5px solid blue",
        }}
      />
      <PokedexEntry
        data={pokemon !== null ? pokemon : selectedPokemon}
        innerRadius={innerRadius}
        // radius={radius}
      />
    </section>
  );
};

export default TreeVis;
