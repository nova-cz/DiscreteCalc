import React from 'react';

class ModularAlgebraSolver extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      equation: '',
      unknown: '',
      modulus: 0,
      result: null,
      error: null,
    };
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  solve = () => {
    const { equation, unknown, modulus } = this.state;

    if (!equation || !unknown || !modulus) {
      this.setState({ error: 'Please enter all fields', result: null });
      return;
    }

    // Parse the equation and extract coefficients and constants
    const parts = equation.split('=');
    if (parts.length !== 2) {
      this.setState({ error: 'Invalid equation format', result: null });
      return;
    }

    const leftSide = parts[0].trim();
    const rightSide = parts[1].trim();

    const [a, b] = leftSide.split(unknown);
    const [c, d] = rightSide.split(unknown);

    const coefA = parseInt(a || '1');
    const coefB = parseInt(b || '0');
    const coefC = parseInt(c || '0');
    const coefD = parseInt(d || '0');

    // Solve for the unknown using modular arithmetic
    const inverse = this.modInverse(coefA, modulus);
    if (inverse === -1) {
      this.setState({ error: 'Modular inverse does not exist', result: null });
      return;
    }

    const result = (inverse * (coefC - coefD)) % modulus;
    const finalResult = result < 0 ? result + modulus : result; // Ensure positive result
    this.setState({ result: finalResult, error: null });
  };

  modInverse = (a, m) => {
    // Calculate modular inverse using extended Euclidean algorithm
    a = ((a % m) + m) % m; // Ensure a is positive
    for (let x = 1; x < m; x++) {
      if ((a * x) % m === 1) {
        return x;
      }
    }
    return -1; // Modular inverse does not exist
  };

  render() {
    const { equation, unknown, modulus, result, error } = this.state;

    return (
      <div>
        <h2>Álgebra modular</h2>
        <input type="text" name="equation" value={equation} onChange={this.handleInputChange} />
        <input type="text" name="unknown" value={unknown} onChange={this.handleInputChange} />
        <input type="number" name="modulus" value={modulus} onChange={this.handleInputChange} />
        <button onClick={this.solve}>Solve</button>
        {result !== null && <p>Result: {result}</p>}
        {error && <p>Error: {error}</p>}
      </div>
    );
  }
}

export default ModularAlgebraSolver;
