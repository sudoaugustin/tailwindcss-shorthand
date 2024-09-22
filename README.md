# Useful tailwindcss classes and variants to boost productivity

## Installation

```bash
// NPM
npm install tailwindcss-shorthand --save-dev

// YARN
yarn add tailwindcss-shorthand -D

// PNPM
pnpm add tailwindcss-shorthand -D
```

```javascript
// tailwind.config.js

module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-shorthand")()],
};
```

## Utilities

### `a-$wx$h`

```html
// Before
<div class="w-5 h-10"></div>

// After
<div class="a-5x10"></div>
```

#### Arbitrary values

```html
<div class="a-[5rem]"></div>

<div class="a-[5remx100%]"></div>
```

If you feel like the built-in `size-5` is long, you can do `a-5`.

### `p-$yx$x`

Extends the built-in `p-*` to declare shorthand padding.

```html
// Before
<div class="py-5 px-10"></div>

// After
<div class="p-5x10"></div>
```

Note: You can still use the built-in padding utilities `p-5` and `p-[5rem]`.

### `m-$yx$x`

Extends the built-in `m-*` to declare shorthand margin.

```html
// Before
<div class="my-5 mx-10"></div>

// After
<div class="m-5x10"></div>
```

Note: You can still use the built-in margin utilities `m-5` and `m-[5rem]`.

### `gap-$yx$x`

Extends the built-in `gap-*` to declare shorthand gap.

```html
// Before
<div class="gap-y-5 gap-x-10"></div>

// After
<div class="gap-5x10"></div>
```

Note: You can still use the built-in gap utilities `gap-5` and `gap-[5rem]`.

### `z-*`

Extend the built-in `z-*`.

```javascript
// tailwind.config.js

module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [
    require("tailwindcss-shorthand")({
      // Default ["5", "10", "15", "20", "25", "30", "35", "40", "45", "50"]
      zIndexes: new Array(50).fill(null).map((_, i) => i + 1),
    }),
  ],
};
```

### Flex alignments

```html
// Before
<div class="justify-start items-start"></div>
<div class="justify-center items-center"></div>
<div class="justify-end items-end"></div>
<div class="justify-stretch items-stretch"></div>

// After
<div class="flex-start"></div>
<div class="flex-center"></div>
<div class="flex-end"></div>
<div class="flex-stretch"></div>
```

## Variants

### `state-*:`

```TSX
// Before
<div className={`${isOn ? "bg-green-600" : "bg-slate-800"}`}></div>
<div data-state={ isOn ? "on" : "off" } className="bg-slate-800 data-[state=on]:bg-green-600"></div>

// After
<div data-state={ isOn ? "on" : "off" } className="bg-slate-800 state-on:bg-green-600"></div>
<div data-state={ isOn ? "on" : "off" } className="bg-slate-800 state-on:bg-green-600"></div>
```

You can also use the `group-state-*` & `peer-state-*` modifiers. To add custom states, see [here](#states).

### `$dataName-$dataValue`

This is a extended version of the `state-*` variant.

```javascript
// tailwind.config.js

module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [
    require("tailwindcss-shorthand")({
      // Default {}
      data: {
        align: ["left", "center", "women"],
      },
    }),
  ],
};
```

```TSX
// Before
<div data-align={alignment} class="data-[align=left]:left-0 data-[align=top]:top-0" ></div>

// After
<div data-align={alignment} class="align-left:left-0 align-top:top-0" ></div>
```

### `1st`, `2nd`, `3rd`, ..., `10th`

```TSX
// Before
<div className={`${index === 1 ? "col-span-4" : index === 2 ? "col-span-3" : "col-span-1"}`}></div>

// After
<div className="1st:col-span-4 2nd:col-span-3 col-span-1"></div>
```

> To use the `nth-of-type` selector please use `1st-of`, `2nd-of`, `3rd-of`, ..., `10th-of`.

You can also use the `group-1st*` & `peer-1st*` modifiers. To add custom nths, see [here](#states).

## Options

### `nths`

Use this option to override the default child selectors.

```javascript
// tailwind.config.js

module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [
    require("tailwindcss-shorthand")({
      // Default [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      nths: [11, 99],
    }),
  ],
};
```

```html
<div class="11th:w-10"></div>
<div class="11th-of:w-10"></div>
```

### `states`

Use this option to override the default states variants.

```javascript
// tailwind.config.js

module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [
    require("tailwindcss-shorthand")({
      // Default ["open", "closed", "active", "inactive", "on", "off", "checked", "unchecked", "visible", "hidden", "expanded", "collapsed", "loading", "loaded", "selected", "success", "error", "enabled", "disabled"]
      states: ["pending"],
    }),
  ],
};
```

```html
<div class="state-pending:w-10"></div>
```

### `separator`

Use the `separator` option to override the default separator(`x`) in shorthand utilities.

```javascript
// tailwind.config.js

module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [
    require("tailwindcss-shorthand")({
      // Default "x"
      separator: "-",
    }),
  ],
};
```

```html
<div class="a-5-10"></div>
<div class="a-[5rem-10rem]"></div>
```
