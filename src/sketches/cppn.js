// The supplied sketch in p5 instance mode. Each slide owns its network.
export default function cppnSketch(p) {
  const RESET_TIMER = 5 * 1000;
  const NUM_LAYERS = 2;
  const NUM_NODES = 2;
  const hiddenWeights = [];
  const outputWeightsR = [];
  const outputWeightsG = [];
  const outputWeightsB = [];
  const activations = [Math.sin];

  function initializeNetwork() {
    for (let layer = 0; layer < NUM_LAYERS; layer++) {
      hiddenWeights[layer] = [];
      const numInputs = layer === 0 ? 3 : NUM_NODES;

      for (let n = 0; n < NUM_NODES; n++) {
        hiddenWeights[layer][n] = [];

        for (let i = 0; i < numInputs; i++) {
          hiddenWeights[layer][n][i] = p.random(-3, 3);
        }
      }
    }

    for (let i = 0; i < NUM_NODES; i++) {
      outputWeightsR[i] = p.random(-3, 3);
      outputWeightsG[i] = p.random(-3, 3);
      outputWeightsB[i] = p.random(-3, 3);
    }
  }

  p.setup = () => {
    p.createCanvas(100, 100);
    p.pixelDensity(1);

    initializeNetwork();

    setInterval(() => {
      initializeNetwork();
    }, RESET_TIMER);

    p.background(0);
  };

  function gaussian(value) {
    return Math.exp(-(value * value));
  }

  function node(inputs, weights, activation) {
    let sum = 0;

    for (let i = 0; i < inputs.length; i++) {
      sum += inputs[i] * weights[i];
    }

    return activation(sum);
  }

  function evaluateCPPN(x, y, z) {
    const nx = (x / (p.width - 1)) * 2 - 1;
    const ny = (y / (p.height - 1)) * 2 - 1;
    let currentInputs = [nx, ny, z];

    for (let layer = 0; layer < NUM_LAYERS; layer++) {
      const nextInputs = [];

      for (let n = 0; n < NUM_NODES; n++) {
        nextInputs.push(node(
          currentInputs,
          hiddenWeights[layer][n],
          activations[n % activations.length],
        ));
      }

      currentInputs = nextInputs;
    }

    const rVal = node(currentInputs, outputWeightsR, Math.sin);
    const gVal = node(currentInputs, outputWeightsG, Math.cos);
    const bVal = node(currentInputs, outputWeightsB, gaussian);

    return [(rVal + 1) * 127.5, (gVal + 1) * 127.5, bVal * 255];
  }

  p.draw = () => {
    p.loadPixels();
    const z = p.frameCount * 0.01;

    for (let y = 0; y < p.height; y++) {
      for (let x = 0; x < p.width; x++) {
        const [r, g, b] = evaluateCPPN(x, y, z);
        const index = (x + y * p.width) * 4;

        p.pixels[index] = r;
        p.pixels[index + 1] = g;
        p.pixels[index + 2] = b;
        p.pixels[index + 3] = 255;
      }
    }

    p.updatePixels();
  };
}
