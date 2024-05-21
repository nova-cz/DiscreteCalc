import React, { useState, useRef } from "react";
import * as venn from "venn.js";
import * as d3 from "d3";

const VennDiagram = () => {
  const [universalSet, setUniversalSet] = useState([]);
  const [sets, setSets] = useState([[], [], []]);
  const [error, setError] = useState("");
  const vennRef = useRef(null);

  const generateVennDiagram = () => {
    const validateSubsets = () => {
      for (let i = 0; i < sets.length; i++) {
        if (!sets[i].every((n) => universalSet.includes(n))) {
          setError(
            `Todos los elementos de Set ${
              i + 1
            } deben estar en el conjunto universal.`
          );
          return false;
        }
      }
      setError("");
      return true;
    };

    if (validateSubsets() && vennRef.current) {
      const setsData = sets.map((set, index) => ({
        sets: [`Set ${index + 1}`],
        size: set.length,
        label: `Set ${index + 1} (${set.length})`,
      }));

      for (let i = 0; i < sets.length; i++) {
        for (let j = i + 1; j < sets.length; j++) {
          const intersection = sets[i].filter((x) =>
            sets[j].includes(x)
          ).length;
          if (intersection > 0) {
            setsData.push({
              sets: [`Set ${i + 1}`, `Set ${j + 1}`],
              size: intersection,
            });
          }
        }
      }

      const chart = venn.VennDiagram().width(500).height(500);

      const colors = d3.scaleOrdinal(d3.schemeCategory10);

      d3.select(vennRef.current).datum(setsData).call(chart);

      d3.selectAll("path")
        .style("fill", (d, i) => colors(i))
        .style("opacity", 0.6);

      var tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "venntooltip");

      d3.selectAll("path")
        .style("stroke-opacity", 0)
        .style("stroke", "#fff")
        .style("stroke-width", 3);
    }
  };

  const parseInput = (input) => {
    return input
      .split(",")
      .map((item) => item.trim())
      .map(Number)
      .filter((n) => !isNaN(n));
  };

  const handleUniversalSetChange = (e) => {
    const newSet = parseInput(e.target.value);
    setUniversalSet(newSet);
    setError("");
  };

  const handleChangeSet = (index, e) => {
    const newSet = parseInput(e.target.value);
    const newSets = [...sets];
    newSets[index] = newSet;
    setSets(newSets);
    setError("");
  };

  const addNewSet = () => {
    setSets([...sets, []]);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Universal Set"
        onChange={handleUniversalSetChange}
      />
      {sets.map((set, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Set ${index + 1}`}
          onChange={(e) => handleChangeSet(index, e)}
          disabled={universalSet.length === 0}
        />
      ))}
      <button onClick={addNewSet} disabled={universalSet.length === 0}>
        Agregar nuevo conjunto
      </button>
      <button onClick={generateVennDiagram}>Generar Diagrama de Venn</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div ref={vennRef}></div>
    </div>
  );
};

export default VennDiagram;
