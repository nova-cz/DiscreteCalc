import React from "react";
import styles from "./Matriz.module.css";

class RelationalMatrix extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      n: 0, // Número de conjuntos ingresado por el usuario
      sets: [], // Conjuntos ingresados por el usuario
      pairs: [], // Pares ordenados de relaciones ingresados por el usuario
      relations: [], // Relaciones generadas entre los conjuntos
      isFunction: [], // Indica si cada relación es una función o no
      matrices: [], // Matrices de relación generadas
      generated: false, // Indica si los campos de entrada se han generado
      inverses: [], // Matrices inversas calculadas
      complementaries: [], // Matrices complementarias calculadas
      compositions: [], // Resultado de la composición de matrices
      selectedMatrix1: null, // Índice de la primera matriz seleccionada para composición
      selectedMatrix2: null, // Índice de la segunda matriz seleccionada para composición
    };
  }

  // Función para manejar cambios en el número de conjuntos
  handleSetN = (e) => {
    const newValue = parseInt(e.target.value);
    this.setState({ n: newValue });
  };

  // Función para manejar cambios en los conjuntos ingresados por el usuario
  handleSetSet = (index, value) => {
    const newSets = [...this.state.sets];
    newSets[index] = value;
    this.setState({ sets: newSets });
  };

  // Función para generar las relaciones entre los conjuntos ingresados
  generateRelations = () => {
    const { sets } = this.state;
    const relations = [];
    const isFunction = [];
  
    // Generar todas las posibles relaciones entre los conjuntos
    for (let i = 0; i < sets.length; i++) {
      for (let j = 0; j < sets.length; j++) {
        if (i !== j) {
          const set1 = sets[i].split(",").map((item) => item.trim());
          const set2 = sets[j].split(",").map((item) => item.trim());
          const cartesianProduct = [];
  
          // Obtener el producto cartesiano entre los dos conjuntos
          for (const element1 of set1) {
            for (const element2 of set2) {
              cartesianProduct.push(`(${element1},${element2})`);
            }
          }
  
          relations.push(cartesianProduct);
  
          // Determinar si la relación es una función o no
          const set1Unique = new Set(set1);
          if (cartesianProduct.length === set1Unique.size) {
            isFunction.push(true);
          } else {
            isFunction.push(false);
          }
        }
      }
    }
  
    this.setState({ relations, isFunction, generated: true }, () => {
      // Generar las matrices de relación
      this.generateMatrices();
    });
  };
  

  // Función para manejar cambios en los pares ordenados de un conjunto
  handleSetPair = (index, value) => {
    const newPairs = [...this.state.pairs];
    newPairs[index] = value;
    this.setState({ pairs: newPairs });
  };

  // Función para generar las matrices de relación
  generateMatrices = () => {
    const { relations } = this.state;
    const matrices = [];

    for (const relation of relations) {
      const pairsArray = relation.map((pair) => pair.match(/\d+/g));
      const max = Math.max(...pairsArray.flat().map(Number));
      const newMatrix = Array.from({ length: max }, () =>
        Array.from({ length: max }, () => 0)
      );

      for (const pair of pairsArray) {
        const [x, y] = pair.map(Number);
        newMatrix[x - 1][y - 1] = 1;
      }

      matrices.push(newMatrix);
    }

    this.setState({ matrices });
  };

  // Función para calcular la inversa de una matriz (transponerla)
  calculateInverse = (matrix) => {
    return matrix[0].map((col, i) => matrix.map((row) => row[i]));
  };

  // Función para calcular la matriz complementaria
  calculateComplementary = (matrix) => {
    return matrix.map((row) => row.map((cell) => (cell === 0 ? 1 : 0)));
  };

  // Función para calcular la composición (producto) entre dos matrices seleccionadas
  calculateComposition = (index1, index2) => {
    const matrix1 = this.state.matrices[index1];
    const matrix2 = this.state.matrices[index2];
    if (!matrix1 || !matrix2) {
      alert("Seleccione dos matrices válidas para realizar la composición.");
      return;
    }

    const result = matrix1.map((row, i) =>
      row.map((_, j) =>
        row.reduce((sum, _, k) => sum + matrix1[i][k] * matrix2[k][j], 0)
      )
    );
    return result;
  };

  // Función para manejar cambios en la selección de la primera matriz para composición
  handleSetSelectedMatrix1 = (e) => {
    const index = parseInt(e.target.value);
    this.setState({ selectedMatrix1: index });
  };

  // Función para manejar cambios en la selección de la segunda matriz para composición
  handleSetSelectedMatrix2 = (e) => {
    const index = parseInt(e.target.value);
    this.setState({ selectedMatrix2: index });
  };

  // Función para calcular la composición de las matrices seleccionadas
  calculateSelectedComposition = () => {
    const { selectedMatrix1, selectedMatrix2 } = this.state;
    if (selectedMatrix1 === null || selectedMatrix2 === null) {
      alert("Seleccione dos matrices para realizar la composición.");
      return;
    }

    const composition = this.calculateComposition(
      selectedMatrix1,
      selectedMatrix2
    );
    if (composition) {
      this.setState((prevState) => ({
        compositions: [...prevState.compositions, composition],
      }));
    }
  };

  // Función para limpiar la página
  handleCleanPage = () => {
    this.setState({
      n: 0,
      sets: [],
      pairs: [],
      relations: [],
      isFunction: [],
      matrices: [],
      generated: false,
      inverses: [],
      complementaries: [],
      compositions: [],
      selectedMatrix1: null,
      selectedMatrix2: null,
    });
  };

  render() {
    return (
      <div className={`page ${styles.content}`}>
        <h2>Matriz de relaciones</h2>
        <div className={styles.cols}>
          {/* Sección para ingresar conjuntos */}
          <div
            className={styles.inputs_container}
            style={{ flexBasis: "100%" }}
          >
            <div className={styles.input_container}>
              <label className="instruction">
                Ingrese el número de conjuntos (n):
              </label>
              <input
                type="number"
                value={this.state.n}
                onChange={this.handleSetN}
              />
            </div>
            <br />
            {Array.from({ length: this.state.n }, (_, i) => (
              <div key={i} className={styles.set_input_container}>
                <label>Conjunto {i + 1}:</label>
                <input
                  type="text"
                  placeholder="Ingrese los elementos separados por coma (ejemplo: 1,2,3)"
                  value={this.state.sets[i] || ""}
                  onChange={(e) => this.handleSetSet(i, e.target.value)}
                />
              </div>
            ))}
            <div className={styles.buttons_container}>
              {this.state.n > 0 && (
                <button
                  className={styles.main_button}
                  onClick={this.generateRelations}
                >
                  Generar Relaciones
                </button>
              )}
              {this.state.n > 0 && (
                <button
                  className={styles.main_button}
                  onClick={this.handleCleanPage}
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>

          {/* Sección para mostrar las relaciones generadas y si son funciones */}
          <div className={styles.results}>
            {this.state.generated &&
              this.state.relations.map((relation, index) => (
                <div key={index}>
                  <h3>
                    Relaciones entre Conjunto{" "}
                    {Math.floor(index / (this.state.n - 1)) + 1} y Conjunto{" "}
                    {(index % (this.state.n - 1)) + 2}:
                  </h3>
                  <p>{relation.join(", ")}</p>
                  <p>
                    {this.state.isFunction[index]
                      ? "Es una función"
                      : "No es una función"}
                  </p>
                </div>
              ))}

            {/* Área para mostrar las matrices de relación */}
            {this.state.generated &&
              this.state.matrices.map((matrix, index) => (
                <div key={index}>
                  <h3>Matriz de Relación {index + 1}:</h3>
                  <table>
                    <tbody>
                      {matrix.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* Botón para calcular la inversa de la matriz */}
                  <button
                    className={styles.sec_button}
                    onClick={() => {
                      const inverses = [...this.state.inverses];
                      inverses[index] = this.calculateInverse(matrix);
                      this.setState({ inverses });
                    }}
                  >
                    Calcular Inversa
                  </button>
                  {/* Botón para calcular la matriz complementaria */}
                  <button
                    className={styles.sec_button}
                    onClick={() => {
                      const complementaries = [...this.state.complementaries];
                      complementaries[index] =
                        this.calculateComplementary(matrix);
                      this.setState({ complementaries });
                    }}
                  >
                    Calcular Complementaria
                  </button>
                  {/* Mostrar la matriz inversa si está calculada */}
                  {this.state.inverses[index] && (
                    <div>
                      <h3>Inversa de la Matriz {index + 1}:</h3>
                      {this.state.inverses[index].map((row, rowIndex) => (
                        <div key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <span key={cellIndex}>{cell}</span>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Mostrar la matriz complementaria si está calculada */}
                  {this.state.complementaries[index] && (
                    <div>
                      <h3>Complementaria de la Matriz {index + 1}:</h3>
                      {this.state.complementaries[index].map(
                        (row, rowIndex) => (
                          <div key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <span key={cellIndex}>{cell}</span>
                            ))}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              ))}
            <br />
            {/* Selector para la composición de matrices */}
            {this.state.generated && (
              <div>
                <label>Seleccione dos matrices para composición:</label>
                <select onChange={this.handleSetSelectedMatrix1}>
                  <option value="">Seleccione la primera matriz</option>
                  {this.state.matrices.map((matrix, index) => (
                    <option key={index} value={index}>
                      Matriz {index + 1}
                    </option>
                  ))}
                </select>
                <select onChange={this.handleSetSelectedMatrix2}>
                  <option value="">Seleccione la segunda matriz</option>
                  {this.state.matrices.map((matrix, index) => (
                    <option key={index} value={index}>
                      Matriz {index + 1}
                    </option>
                  ))}
                </select>
                <button
                  className={styles.sec_button}
                  onClick={this.calculateSelectedComposition}
                >
                  Calcular Composición
                </button>
              </div>
            )}

            {/* Área para mostrar la composición de matrices */}
            {this.state.compositions.length > 0 && (
              <div>
                <h2>Composición de Matrices:</h2>
                {this.state.compositions.map((composition, index) => (
                  <div key={index}>
                    <h3>Composición {index + 1}:</h3>
                    <table>
                      <tbody>
                        {composition.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default RelationalMatrix;
