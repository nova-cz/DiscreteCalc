import React, { useState, useRef } from "react";
import * as venn from "venn.js";
import * as d3 from "d3";
import styles from "./Venn.module.css";

const VennDiagram = () => {
  const [universalSet, setUniversalSet] = useState([]);
  const [tempUniversalSet, setTempUniversalSet] = useState("");
  const [sets, setSets] = useState([]);
  const [currentSet, setCurrentSet] = useState("");
  const [error, setError] = useState("");
  const [vennRegions, setVennRegions] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [outsideElements, setOutsideElements] = useState([]);
  const vennRef = useRef(null);

  const generateVennDiagram = () => {
    if (vennRef.current) {
      const colors = d3.scaleOrdinal(d3.schemeCategory10);
      const labels = sets.map((set, index) => ({
        label: `${String.fromCharCode(65 + index)} (${set.length})`,
        color: colors(index),
      }));

      const setsData = sets.map((set, index) => ({
        sets: [`${String.fromCharCode(65 + index)}`],
        size: set.length,
        label:
          set.length > 0
            ? labels[index].label
            : String.fromCharCode(65 + index),
        elements: set.length > 0 ? set : [],
        color: labels[index].color,
      }));

      // Calculate pairwise intersections
      for (let i = 0; i < sets.length; i++) {
        for (let j = i + 1; j < sets.length; j++) {
          const intersection = sets[i].filter((x) => sets[j].includes(x));
          if (intersection.length > 0) {
            const intersectionSet = {
              sets: [
                `${String.fromCharCode(65 + i)}`,
                `${String.fromCharCode(65 + j)}`,
              ],
              size: intersection.length,
              elements: intersection,
              color: colors(sets.length),
            };
            setsData.push(intersectionSet);
            // Remove intersection elements from the original sets
            setsData[i].elements = setsData[i].elements.filter(
              (elem) => !intersection.includes(elem)
            );
            setsData[j].elements = setsData[j].elements.filter(
              (elem) => !intersection.includes(elem)
            );
          }
        }
      }

      const chart = venn.VennDiagram().width(500).height(500);

      d3.select(vennRef.current).datum(setsData).call(chart);

      const regions = d3.select(vennRef.current).datum();
      setVennRegions(regions);

      const regionList = regions.map((region, index) => {
        const regionSets = region.sets.join(" ∩ ");
        const regionElements = region.elements.join(", ");
        return (
          <li key={index}>
            {regionSets}: {regionElements}
          </li>
        );
      });
      setRegionList(regionList);

      const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "venntooltip")
        .style("width", "fit-content")
        .style("position", "absolute")
        .style("background", "#141414")
        .style("border", "1px solid #000")
        .style("padding", "10px")
        .style("border-radius", "5px")
        .style("opacity", 0);

      d3.selectAll("g")
        .on("mouseover", function (event, d) {
          tooltip.transition().duration(400).style("opacity", 0.9);
          tooltip
            .html(`Conjunto ${d.sets.join(" ∩ ")}: ${d.elements.join(", ")}`)
            .style("left", `${event.pageX + 28}px`)
            .style("top", `${event.pageY - 28}px`);

          d3.select(this).transition("tooltip").duration(400);

          d3.select(this)
            .select("path")
            .style("stroke", "#000")
            .style("stroke-opacity", 1)
            .style("stroke-width", 3);
        })
        .on("mousemove", function (event) {
          tooltip
            .style("left", `${event.pageX + 50}px`)
            .style("top", `${event.pageY - 50}px`);
        })
        .on("mouseout", function () {
          tooltip.transition().duration(400).style("opacity", 0);
          d3.select(this).select("path").style("stroke-opacity", 0);
        });

      d3.selectAll("text").each(function (d) {
        let labelText = "";
        if (d.elements.length > 0) {
          labelText = `${d.sets.join(" ∩ ")}: ${d.elements.join(", ")}`;
        }
        d3.select(this).text(labelText);
      });

      // Find elements in the universal set that are not in any subset
      const allElementsInSets = sets.flat();
      const outsideElems = universalSet.filter(
        (elem) => !allElementsInSets.includes(elem)
      );
      setOutsideElements(outsideElems);
    }
  };

  const parseInput = (input) => {
    return input
      .split(",")
      .map((item) => item.trim())
      .map(Number)
      .filter((n) => !isNaN(n));
  };

  const handleUniversalSetSubmit = (e) => {
    e.preventDefault();
    const newSet = parseInput(tempUniversalSet);
    setUniversalSet(newSet);
    setTempUniversalSet("");
    setError("");
  };

  const handleUniversalSetChange = (e) => {
    setTempUniversalSet(e.target.value);
  };

  const handleChangeSet = (e) => {
    setCurrentSet(e.target.value);
    setError("");
  };

  const handleAddSet = () => {
    if (currentSet) {
      const newSet = parseInput(currentSet);
      if (newSet.every((n) => universalSet.includes(n))) {
        setSets([...sets, newSet]);
        setCurrentSet("");
        setError("");
      } else {
        setError(
          "Todos los elementos del subconjunto deben estar en el conjunto universal."
        );
      }
    }
  };

  const handleClear = () => {
    setUniversalSet([]);
    setTempUniversalSet("");
    setSets([]);
    setCurrentSet("");
    setError("");
    setVennRegions([]);
    setRegionList([]);
    setOutsideElements([]);
    if (vennRef.current) {
      d3.select(vennRef.current).selectAll("*").remove();
    }
  };

  return (
    <div className={`page ${styles.container}`}>
      <h2>Diagramas de Venn</h2>

      <div className={styles.inputs_container}>
        <form className={styles.input_form} onSubmit={handleUniversalSetSubmit}>
          <label htmlFor="universe">Conjunto Universo:</label>
          <div className={styles.input_container}>
            <input
              id="universe"
              type="text"
              className={styles.input_form}
              placeholder="Conjunto Universal"
              onChange={handleUniversalSetChange}
              value={tempUniversalSet}
            />
            <button type="submit" className={styles.button_form}>
              <img src="/icon_send.svg" />
            </button>
          </div>
        </form>

        <form
          className={styles.input_form}
          onSubmit={(e) => {
            e.preventDefault();
            handleAddSet();
          }}
        >
          <label>Ingrese un Conjunto</label>
          <div className={styles.input_container}>
            <input
              type="text"
              placeholder={`Ingrese un Conjunto`}
              value={currentSet}
              onChange={handleChangeSet}
              className={styles.input_form}
              disabled={universalSet.length === 0}
            />
            <button
              type="submit"
              className={styles.button_form}
              disabled={!currentSet}
            >
              <img src="/icon_send.svg" />
            </button>
          </div>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      <div className={styles.cols_container}>
        <div className={styles.venn_container}>
          <div className={styles.venn} ref={vennRef}>
            <div className={styles.outsideElements}>
              <p>{outsideElements.join(" , ")}</p>
            </div>
          </div>
        </div>

        <div className={styles.results_container}>
          <div className={styles.buttons_container}>
            <button className={styles.button} onClick={generateVennDiagram}>
              Generar Diagrama de Venn
            </button>
            <button className={styles.button} onClick={handleClear}>
              Limpiar
            </button>
          </div>

          <h3>Conjunto Universo:</h3>
          <p>{universalSet.join(", ")}</p>
          <h3>Subconjuntos Ingresados:</h3>
          <ul>
            {sets.map((set, index) => (
              <li key={index}>
                {String.fromCharCode(65 + index)}: {set.join(", ")}
              </li>
            ))}
          </ul>
          <h3>Regiones del Diagrama:</h3>
          <ul>{regionList}</ul>
        </div>
      </div>
    </div>
  );
};

export default VennDiagram;
