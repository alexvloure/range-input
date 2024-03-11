# Range input

This is a custom implementation of an input range. The use of `<input type="range" />` has been avoided.

The input range has two modes:
- Continuous mode: user can select values continuously from min to max.
- Step mode: users can only select those values provided as steps in the range.

## Component details

To achieve a reliable component some points as robustness or granularity have been taken into account. 
In terms of robustness, multiple aspects were considered:
- Handling errors: by checking the states before passing them as props to the component itself, the tolerance to fails is accomplished.
- Loading states: the use of loading states helps the user to understand the current state of the app and allows the rendering of the component only when data is fetched.
- Event handling: using both mouse and touch events assure the component is usable in all devices.

Talking about granularity, the composition pattern has been used. This means that the component is composed of multiple smaller components, allowing us to easily identify what is the responsibility of each part among other advantages.

## Technology selection

Use of TailwindCSS: in order to develop the component in a straightforward way, TailwindCSS has been used. This allowed the agile implementation of styles, not relying on external CSS files or other approaches that may perhaps can be more maintainable but also more time consuming in terms of development.

Use of mockable.io: other approaches like mocky.io or MSW have also been considered but since mockable.io was the one suggested as example and its use is pretty straightforward that's the one that has been selected for this purpose.

## Installation

Clone the project

```bash
  git clone git@github.com:alexvloure/range-input.git
```

Go to the project directory

```bash
  cd range-input
```

Install dependencies

```bash
  npm install
```
## Run development mode

This will run range-input in development mode.

```bash
  npm run dev
```
## Run production mode

This will run the production bundle of range-input.

```bash
  npm run serve
```

## Running unit tests

To run unit tests, execute the following command

```bash
  npm run test
```
