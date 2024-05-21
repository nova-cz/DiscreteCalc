import React from "react";
import styles from "./Algebra.module.css";

class ModularAlgebraSolver extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number1: "",
      number2: "",
      modulus: "",
      result: null,
      error: null,
      explanation: [],
      equation1: "",
      equation2: "",
      linearResult: null,
      linearError: null,
    };
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  solve = (event) => {
    event.preventDefault();

    const { number1, number2, modulus } = this.state;

    if (!number1 || !number2 || !modulus) {
      this.setState({
        error: "Please enter all fields",
        result: null,
        explanation: [],
      });
      return;
    }

    const num1 = parseInt(number1);
    const num2 = parseInt(number2);
    const mod = parseInt(modulus);

    if (isNaN(num1) || isNaN(num2) || isNaN(mod)) {
      this.setState({
        error: "Please enter valid numbers",
        result: null,
        explanation: [],
      });
      return;
    }

    const residue1 = num1 % mod;
    const residue2 = num2 % mod;

    const result = residue1 === residue2;
    const explanation = [
      `Números: ${num1} y ${num2}, Módulo: ${mod}`,
      `Pertenecen a la misma clase: ${result ? "Sí" : "No"}`,
      "Explicación:",
      `${num1} mod ${mod} = ${residue1}`,
      `${num2} mod ${mod} = ${residue2}`,
      `Ambos pertenecen a la clase ${residue1} mod ${mod}.`,
    ];

    this.setState({ result, error: null, explanation });
  };

  solveLinearEquations = (event) => {
    event.preventDefault();

    const { equation1, equation2, modulus } = this.state;

    if (!equation1 || !equation2 || !modulus) {
      this.setState({
        linearError: "Please enter all fields",
        linearResult: null,
      });
      return;
    }

    const { result, explanation } = this.calculateLinearEquations(
      equation1,
      equation2,
      modulus
    );

    this.setState({ linearResult: result, linearError: explanation });
  };

  calculateLinearEquations = (equation1, equation2, modulus) => {
    const [coef1, constant1] = this.parseEquation(equation1);
    const [coef2, constant2] = this.parseEquation(equation2);

    if (
      isNaN(coef1) ||
      isNaN(constant1) ||
      isNaN(coef2) ||
      isNaN(constant2) ||
      isNaN(modulus)
    ) {
      return {
        result: null,
        explanation:
          "Por favor, ingrese ecuaciones válidas y un módulo válido.",
      };
    }

    const constantDifference = constant2 - constant1;

    const gcd = this.greatestCommonDivisor(coef1, coef2);

    if (constantDifference % gcd !== 0) {
      return {
        result: null,
        explanation: "No hay solución para el sistema de ecuaciones.",
      };
    }

    const x =
      (this.modularInverse(coef1 / gcd, coef2 / gcd, modulus / gcd) *
        (constantDifference / gcd)) %
      (modulus / gcd);
    const solution = x < 0 ? x + modulus / gcd : x;

    return {
      result: solution,
      explanation: `La solución para el sistema de ecuaciones es x ≡ ${solution} (mod ${
        modulus / gcd
      }).`,
    };
  };

  parseEquation = (equation) => {
    const parts = equation.split(" ≡ ");
    if (parts.length !== 2) {
      return [NaN, NaN];
    }
    const [coefficient, constant] = parts.map((part) => {
      const trimmedPart = part.trim();
      if (trimmedPart.includes("x")) {
        const [coef, _] = trimmedPart.split("x");
        return parseInt(coef.trim());
      } else {
        return parseInt(trimmedPart);
      }
    });
    return [coefficient, constant];
  };

  greatestCommonDivisor = (a, b) => {
    if (b === 0) {
      return a;
    }
    return this.greatestCommonDivisor(b, a % b);
  };

  modularInverse = (a, b, m) => {
    let [x, y] = [0, 1];
    let [lastX, lastY] = [1, 0];
    while (b !== 0) {
      const quotient = Math.floor(a / b);
      [a, b] = [b, a % b];
      [x, lastX] = [lastX - quotient * x, x];
      [y, lastY] = [lastY - quotient * y, y];
    }
    return lastX < 0 ? lastX + m : lastX;
  };

  render() {
    const {
      number1,
      number2,
      modulus,
      result,
      error,
      explanation,
      equation1,
      equation2,
      linearResult,
      linearError,
    } = this.state;

    return (
      <div className={`page ${styles.container}`}>
        <h2>Álgebra modular</h2>

        <div className={styles.operation_container}>
          <h3>Verificar si dos dígitos pertenecen a la misma clase:</h3>
          <form className={styles.form} onSubmit={this.solve}>
            <input
              type="number"
              placeholder="Ingrese el primer dígito"
              name="number1"
              value={number1}
              onChange={this.handleInputChange}
            />
            <input
              type="number"
              placeholder="Ingrese el segundo dígito"
              name="number2"
              value={number2}
              onChange={this.handleInputChange}
            />
            <input
              type="number"
              placeholder="Ingrese el módulo"
              name="modulus"
              value={modulus}
              onChange={this.handleInputChange}
            />
            <button className={styles.button_form} type="submit">
              Verificar
            </button>
          </form>
          <div className={styles.result_container}>
            <h4>Resultado:</h4>
            {result !== null && (
              <div>
                {explanation.map((line, index) => (
                  <p className={styles.result_item} key={index}>
                    {line}
                  </p>
                ))}
              </div>
            )}
            {error && <p>Error: {error}</p>}
          </div>
        </div>

        <div className={styles.operation_container}>
          <h3>Resolver sistema de ecuaciones lineales:</h3>
          <form className={styles.form} onSubmit={this.solveLinearEquations}>
            <input
              type="text"
              placeholder="Ecuación 1 (ax ≡ b mod m)"
              name="equation1"
              value={equation1}
              onChange={this.handleInputChange}
            />
            <input
              type="text"
              placeholder="Ecuación 2 (ax ≡ b mod m)"
              name="equation2"
              value={equation2}
              onChange={this.handleInputChange}
            />
            <input
              type="number"
              placeholder="Ingrese el módulo"
              name="modulus"
              value={modulus}
              onChange={this.handleInputChange}
            />
            <button className={styles.button_form} type="submit">
              Resolver
            </button>
          </form>
          <div className={styles.result_container}>
            <h4>Resultado:</h4>
            {linearResult !== null && (
              <div>
                <p className={styles.result_item}>{linearResult}</p>
              </div>
            )}
            {linearError && <p>Error: {linearError}</p>}
          </div>
        </div>
      </div>
    );
  }
}

export default ModularAlgebraSolver;
