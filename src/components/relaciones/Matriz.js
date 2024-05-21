import React from 'react';
import styles from "./Matriz.module.css"

class RelationalMatrix extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            n: 0, // Número de conjuntos ingresado por el usuario
            pairs: [], // Pares ordenados de relaciones ingresados por el usuario
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

    // Función para generar los campos de entrada para los pares de cada conjunto
    generateFields = () => {
        const fields = [];
        for (let i = 0; i < this.state.n; i++) {
            fields.push(
                <div key={i} className={styles.set_input_container} >
                    <label>Conjunto {i + 1}:</label>
                    <input
                        type="text"
                        placeholder="Ingrese los pares ordenados (ejemplo: (1,2) (2,3) ...)"
                        value={this.state.pairs[i] || ""}
                        onChange={(e) => this.handleSetPair(i, e.target.value)}
                    />
                </div>
            );
        }
        return fields;
    };

    // Función para manejar cambios en los pares ordenados de un conjunto
    handleSetPair = (index, value) => {
        const newPairs = [...this.state.pairs];
        newPairs[index] = value;
        this.setState({ pairs: newPairs });
    };

    // Función para generar las matrices de relación
    generateMatrices = () => {
        const { pairs, n } = this.state;
        const matrices = [];
        for (let i = 0; i < n; i++) {
            const pairsArray = pairs[i]?.match(/\(\d+,\d+\)/g);
            if (!pairsArray) {
                alert('Ingrese pares ordenados válidos para todos los conjuntos.');
                return;
            }

            const max = pairsArray.reduce((max, pair) => {
                const [x, y] = pair.match(/\d+/g).map(Number);
                return Math.max(max, x, y);
            }, 0);

            const newMatrix = Array.from({ length: max }, () => Array.from({ length: max }, () => 0));

            pairsArray.forEach(pair => {
                const [x, y] = pair.match(/\d+/g).map(Number);
                newMatrix[x - 1][y - 1] = 1;
            });

            matrices.push(newMatrix);
        }

        this.setState({ matrices, generated: true });
    };

    // Función para calcular la inversa de una matriz (transponerla)
    calculateInverse = (matrix) => {
        return matrix[0].map((col, i) => matrix.map(row => row[i]));
    };

    // Función para calcular la matriz complementaria
    calculateComplementary = (matrix) => {
        return matrix.map(row => row.map(cell => (cell === 0 ? 1 : 0)));
    };

    // Función para calcular la composición (producto) entre dos matrices seleccionadas
    calculateComposition = (index1, index2) => {
        const matrix1 = this.state.matrices[index1];
        const matrix2 = this.state.matrices[index2];
        if (!matrix1 || !matrix2) {
            alert('Seleccione dos matrices válidas para realizar la composición.');
            return;
        }

        const result = matrix1.map((row, i) => row.map((_, j) => row.reduce((sum, _, k) => sum + (matrix1[i][k] * matrix2[k][j]), 0)));
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
            alert('Seleccione dos matrices para realizar la composición.');
            return;
        }

        const composition = this.calculateComposition(selectedMatrix1, selectedMatrix2);
        if (composition) {
            this.setState(prevState => ({
                compositions: [...prevState.compositions, composition],
            }));
        }
    };

    // Función para limpiar la página
    handleCleanPage = () => {
        this.setState({
            n: 0,
            pairs: [],
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
            <div className={styles.content}>
                <h2>Matriz de relaciones</h2>
                <div className={styles.cols}>

                    <div style={{ flexBasis: '100%' }} >
                        <div className={styles.input_container}>
                            <label className="instruction" >Ingrese el número de conjuntos (n):</label>
                            <input type="number" value={this.state.n} onChange={this.handleSetN} />
                        </div>
                        <br />
                        {this.state.n > 0 && this.generateFields()}
                        {this.state.n > 0 && <button className={styles.main_button} onClick={this.generateMatrices}>Generar Matrices de Relación</button>}
                        {this.state.n > 0 && <button className={styles.clean_button} onClick={this.handleCleanPage}>Limpiar</button>}

                    </div>
                    
                    <div className={styles.results}>
                        {/* Área para mostrar las matrices de relación */}
                        {this.state.generated && this.state.matrices.map((matrix, index) => (
                            <div key={index}>
                                <h3>Matriz de Relación del Conjunto {index + 1}:</h3>
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
                                <button className={styles.sec_button} onClick={() => {
                                    const inverses = [...this.state.inverses];
                                    inverses[index] = this.calculateInverse(matrix);
                                    this.setState({ inverses });
                                }}>Calcular Inversa</button>
                                {/* Botón para calcular la matriz complementaria */}
                                <button className={styles.sec_button} onClick={() => {
                                    const complementaries = [...this.state.complementaries];
                                    complementaries[index] = this.calculateComplementary(matrix);
                                    this.setState({ complementaries });
                                }}>Calcular Complementaria</button>
                                {/* Mostrar la matriz inversa si está calculada */}
                                {this.state.inverses[index] && (
                                    <div>
                                        <h3>Inversa de la Matriz {index + 1}:</h3>
                                        {this.state.inverses[index].map((row, rowIndex) => (
                                            <div key={rowIndex}>{row.map((cell, cellIndex) => <span key={cellIndex}>{cell}</span>)}</div>
                                        ))}
                                    </div>
                                )}
                                {/* Mostrar la matriz complementaria si está calculada */}
                                {this.state.complementaries[index] && (
                                    <div>
                                        <h3>Complementaria de la Matriz {index + 1}:</h3>
                                        {this.state.complementaries[index].map((row, rowIndex) => (
                                            <div key={rowIndex}>{row.map((cell, cellIndex) => <span key={cellIndex}>{cell}</span>)}</div>
                                        ))}
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
                                        <option key={index} value={index}>Matriz {index + 1}</option>
                                    ))}
                                </select>
                                <select onChange={this.handleSetSelectedMatrix2}>
                                    <option value="">Seleccione la segunda matriz</option>
                                    {this.state.matrices.map((matrix, index) => (
                                        <option key={index} value={index}>Matriz {index + 1}</option>
                                    ))}
                                </select>
                                <button className={styles.comp}  onClick={this.calculateSelectedComposition}>Calcular Composición</button>
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
