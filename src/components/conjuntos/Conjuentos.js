import React, { useState, useEffect } from "react";
import styles from "./Conjuntos.module.css";

const SetOperations = () => {
  const [universe, setUniverse] = useState("");
  const [subset, setSubset] = useState("");
  const [subsets, setSubsets] = useState([]);
  const [operationResult, setOperationResult] = useState("");
  const [selectedSubsets, setSelectedSubsets] = useState([]);
  const [selectedOperation, setSelectedOperation] = useState(null);

  const getSubsetLabel = (index) => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alphabet[index] || `Set ${index + 1}`;
  };

  const handleAddSubset = (event) => {
    event.preventDefault();
    const subsetArray = subset.replace(/\s/g, "").split(",");
    const validSubset = subsetArray.every((element) =>
      universe.includes(element)
    );
    if (validSubset) {
      setSubsets([...subsets, subset]);
      setSubset("");
    } else {
      alert("El subconjunto contiene elementos que no están en el universo.");
    }
  };

  const handleRemoveSubset = (index) => {
    const newSubsets = subsets.filter((_, i) => i !== index);
    setSubsets(newSubsets);
    setSelectedSubsets(selectedSubsets.filter((i) => i !== index));
  };

  const performOperation = () => {
    if (selectedOperation) {
      const result = selectedOperation();
      setOperationResult(result);
    }
  };

  const handleUnion = () => {
    const unionSet = selectedSubsets.reduce((acc, subsetIndex) => {
      const subsetPairs = subsets[subsetIndex]
        .split(",")
        .map((element) => element.trim());
      return new Set([...acc, ...subsetPairs]);
    }, new Set());
    return `Unión: {${[...unionSet].join(", ")}}`;
  };

  const handleIntersection = () => {
    if (selectedSubsets.length < 2) return "Intersección: {}";
    const firstSet = new Set(subsets[selectedSubsets[0]].split(","));
    const intersection = selectedSubsets.slice(1).reduce((acc, subsetIndex) => {
      const subsetPairs = subsets[subsetIndex]
        .split(",")
        .map((element) => element.trim());
      const subsetSet = new Set(subsetPairs);
      return new Set([...acc].filter((x) => subsetSet.has(x)));
    }, firstSet);
    return `Intersección: {${[...intersection].join(", ")}}`;
  };

  const handleDifference = () => {
    if (selectedSubsets.length < 2) return "";
    const firstSet = new Set(subsets[selectedSubsets[0]].split(","));
    const difference = selectedSubsets.slice(1).reduce((acc, subsetIndex) => {
      const subsetSet = new Set(
        subsets[subsetIndex].split(",").map((element) => element.trim())
      );
      return new Set([...acc].filter((x) => !subsetSet.has(x)));
    }, firstSet);
    return `Diferencia: {${[...difference].join(", ")}}`;
  };

  const handleSymmetricDifference = () => {
    if (selectedSubsets.length < 2) return "";
    const symmetricDifference = selectedSubsets.reduce((acc, subsetIndex) => {
      const subsetSet = new Set(
        subsets[subsetIndex].split(",").map((element) => element.trim())
      );
      return new Set(
        [...acc]
          .filter((x) => !subsetSet.has(x))
          .concat([...subsetSet].filter((x) => !acc.has(x)))
      );
    }, new Set());
    return `Diferencia Simétrica: {${[...symmetricDifference].join(", ")}}`;
  };

  const handleComplement = () => {
    const universalSet = new Set(universe.split(","));
    const complements = selectedSubsets.map((index) => {
      const subsetSet = new Set(subsets[index].split(","));
      const complement = [...universalSet].filter((x) => !subsetSet.has(x));
      return `{${complement.join(", ")}}`;
    });
    return `Complementos: ${complements.join(" ")}`;
  };

  const handleCartesianProduct = () => {
    if (selectedSubsets.length < 2) return "";
    const [indexA, indexB] = selectedSubsets;
    const cartesianProduct = subsets[indexA]
      .split(",")
      .flatMap((x) =>
        subsets[indexB].split(",").map((y) => `(${x.trim()}, ${y.trim()})`)
      )
      .join(", ");
    return `Producto Cartesiano: {${cartesianProduct}}`;
  };

  const verifySubset = () => {
    if (selectedSubsets.length < 2) return "";
    const subsetResults = [];
    for (let i = 0; i < selectedSubsets.length - 1; i++) {
      for (let j = i + 1; j < selectedSubsets.length; j++) {
        const setA = new Set(
          subsets[selectedSubsets[i]]
            .split(",")
            .map((element) => element.trim())
        );
        const setB = new Set(
          subsets[selectedSubsets[j]]
            .split(",")
            .map((element) => element.trim())
        );
        const isSubsetAB = [...setA].every((x) => setB.has(x));
        const isSubsetBA = [...setB].every((x) => setA.has(x));
        subsetResults.push(
          `${getSubsetLabel(selectedSubsets[i])} ⊆ ${getSubsetLabel(
            selectedSubsets[j]
          )}: ${isSubsetAB}, ${getSubsetLabel(
            selectedSubsets[j]
          )} ⊆ ${getSubsetLabel(selectedSubsets[i])}: ${isSubsetBA}`
        );
      }
    }
    return subsetResults.join("\n");
  };

  useEffect(() => {
    performOperation();
  }, [selectedSubsets, selectedOperation]);

  const handleSubsetSelection = (event) => {
    const value = parseInt(event.target.value);
    const checked = event.target.checked;
    setSelectedSubsets((prevSelected) =>
      checked
        ? [...prevSelected, value]
        : prevSelected.filter((i) => i !== value)
    );
  };

  const handleOperationSelection = (operationFunction) => {
    setSelectedOperation(() => operationFunction);
  };

  return (
    <section>
      <ul className={styles.menu_options}>
        <li
          className={styles.menu_options_item}
          onClick={() => handleOperationSelection(handleUnion)}
        >
          Unión
        </li>
        <li
          className={styles.menu_options_item}
          onClick={() => handleOperationSelection(handleIntersection)}
        >
          Intersección
        </li>
        <li
          className={styles.menu_options_item}
          onClick={() => handleOperationSelection(handleDifference)}
        >
          Diferencia
        </li>
        <li
          className={styles.menu_options_item}
          onClick={() => handleOperationSelection(handleSymmetricDifference)}
        >
          Diferencia Simétrica
        </li>
        <li
          className={styles.menu_options_item}
          onClick={() => handleOperationSelection(handleComplement)}
        >
          Complemento
        </li>
        <li
          className={styles.menu_options_item}
          onClick={() => handleOperationSelection(handleCartesianProduct)}
        >
          Producto Cartesiano
        </li>
        <li
          className={styles.menu_options_item}
          onClick={() => handleOperationSelection(verifySubset)}
        >
          Verificar Subconjuntos
        </li>
      </ul>

      <div className={`page ${styles.container}`}>
        <div className={styles.calculatorContainer}>
          <h2 className={styles.calculatorTitle}>Conjuntos</h2>

          <div className={styles.inputs_container}>
            <form
              className={styles.input_form}
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="universe">Conjunto Universo:</label>
              <div className={styles.input_container}>
                <input
                  type="text"
                  id="universe"
                  value={universe}
                  className={styles.input_form}
                  onChange={(e) => setUniverse(e.target.value)}
                />
                <button className={styles.button_form}>
                  <img src="/icon_send.svg" />
                </button>
              </div>
            </form>
            <form className={styles.input_form} onSubmit={handleAddSubset}>
              <label htmlFor="subset">Subconjunto:</label>
              <div className={styles.input_container}>
                <input
                  type="text"
                  id="subset"
                  className={styles.input_form}
                  value={subset}
                  onChange={(e) => setSubset(e.target.value)}
                />
                <button className={styles.button_form}>
                  <img src="/icon_send.svg" />
                </button>
              </div>
            </form>
          </div>

          <div className={styles.results_container}>
            <div className={styles.sets_container}>
              <label>Subconjuntos:</label>
              <p>Seleccione los subconjuntos con los que desea trabajar: </p>
              {subsets.map((subset, index) => (
                <div className={styles.subset_card} key={index}>
                  <input
                    type="checkbox"
                    value={index}
                    onChange={handleSubsetSelection}
                    checked={selectedSubsets.includes(index)}
                  />
                  <p className={styles.subset_card_text}>
                    {getSubsetLabel(index)} = {`{ ${subset} }`}
                  </p>
                  <img
                    onClick={() => handleRemoveSubset(index)}
                    className={styles.subset_card_icon}
                    src="/icon_x.svg"
                  />
                </div>
              ))}
            </div>

            <div className={styles.result_container}>
              <label>Resultado:</label>
              <div className={styles.result} style={{ whiteSpace: "pre-wrap" }}>
                {operationResult}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SetOperations;
