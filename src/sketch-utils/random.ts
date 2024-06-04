import type p5 from "p5";
// Define function used to find weights. Usage:
//
// chooseWeighted([
//   [0.6, color('red')],
//   [0.3, color('blue')],
//   [0.1, color('yellow')]
// ]);
//
export function chooseWeighted(
  p: p5,
  options: [number, (() => unknown) | unknown][]
) {
  // get sum of all the weights.
  const sum = options.reduce((total, [weight]) => total + weight, 0);

  // now pick a random number between 0 and the sum of the weights
  let ran = p.random(sum);

  // loop through all the options until you find a weight that is greater
  // or equal to the random number. Subtract weight from random num every time.
  for (let i = 0; i < options.length; i++) {
    const opt = options[i];

    if (opt[0] >= ran) {
      if (typeof opt[1] === "function") {
        return opt[1]();
      }

      return opt[1];
    }

    ran -= opt[0];
  }
}
