import plugin from "tailwindcss/plugin";

export type Options = {
  nths?: number[];
  data?: { [k: string]: string[] };
  states?: string[];
  zIndexes?: string[];
  separator?: string;
};

function arrToObj(values: string[], filters: string[] = []) {
  return values.reduce(
    (total, index) =>
      // To fix tailwind generating duplicate classes. If removed, tailwind will generate .z-10,-20,-30... twice.
      filters.includes(`${index}`) ? total : { ...total, [index]: index },
    {}
  );
}

function pairVals(x = {}, y = {}, separator = "", removeIfSameValue = false) {
  return Object.entries(x).reduce((acc1, [xKey, xVal]) => {
    const paris = Object.entries(y).reduce((acc2, [yKey, yVal]) => {
      const isSameValue = xKey === yKey;
      return removeIfSameValue && isSameValue
        ? acc2
        : {
            ...acc2,
            [isSameValue ? xKey : `${xKey}${separator}${yKey}`]: [xVal, yVal],
          };
    }, {});
    return { ...acc1, ...paris };
  }, {});
}

function parseVal(values: string | string[], separator: string) {
  if (typeof values === "string") {
    const tags = [
      ["px", "p@"],
      ["min-", "min@"],
      ["fit-", "fit@"],
      ["max-", "ma@@"],
    ];
    const $value = tags.reduce(
      (str, [key, val]) => str.replaceAll(key, val),
      values
    );
    const [x, y = x] = $value
      .split(separator)
      .map((str) =>
        tags.reduce((str, [key, val]) => str.replaceAll(val, key), str)
      );
    return [x, y];
  }
  return values;
}

const defaults = {
  nths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  states: [
    "open",
    "closed",
    "active",
    "inactive",
    "on",
    "off",
    "checked",
    "unchecked",
    "visible",
    "hidden",
    "expanded",
    "collapsed",
    "loading",
    "loaded",
    "selected",
    "success",
    "error",
    "enabled",
    "disabled",
  ],
  zIndexes: ["5", "10", "15", "20", "25", "30", "35", "40", "45", "50"],
};

export default function tailwindcssPlugin({
  data = {},
  nths = defaults.nths,
  states = defaults.states,
  zIndexes = defaults.zIndexes,
  separator = "x",
}: Options = {}) {
  return plugin(
    ({ theme, addVariant, addUtilities, matchUtilities, matchVariant }) => {
      // Area utils
      matchUtilities(
        {
          a: (value) => {
            const [width, height] = parseVal(value, separator);
            return { width, height };
          },
        },
        { values: pairVals(theme("width"), theme("height"), separator) }
      );

      // Space utils
      ["gap", "padding", "margin"].forEach((prop) => {
        const util = `${prop === "gap" ? prop : prop[0]}`;
        const values = theme(prop);
        matchUtilities(
          {
            [util]: (value) => {
              // For p-5, p-[2.5rem], transfer the responsibility to built-in.
              if (typeof value === "string") return null;
              const [y, x] = parseVal(value, separator);
              return { [prop]: `${y} ${x}` };
            },
          },
          { values: pairVals(values, values, separator, true) }
        );
      });

      // Flex utils
      [
        { name: "start", value: "flex-start" },
        { name: "center", value: "center" },
        { name: "end", value: "flex-end" },
        { name: "stretch", value: "stretch" },
      ].forEach(({ name, value }) => {
        addUtilities({
          [`.flex-${name}`]: {
            "align-items": value,
            "justify-content": value,
          },
        });
      });

      // Data variants
      Object.entries({ state: states, ...data }).forEach(([name, $values]) => {
        const values = arrToObj($values);

        matchVariant(name, (value) => `&[data-${name}="${value}"]`, {
          values,
        });

        matchVariant(
          `group-${name}`,
          (value) => `:merge(.group)[data-${name}="${value}"] &`,
          { values }
        );

        matchVariant(
          `peer-${name}`,
          (value) => `:merge(.peer)[data-${name}="${value}"] ~ &`,
          { values }
        );
      });

      // Child variants
      nths.forEach((child) => {
        const order = `${child}${
          child === 1 ? "st" : child === 2 ? "nd" : child === 3 ? "rd" : "th"
        }`;

        [
          { variant: order, pseudo: "nth-child" },
          { variant: `${order}-of`, pseudo: "nth-of-type" },
        ].forEach(({ variant, pseudo }) => {
          const selector = `${pseudo}(${child})`;
          addVariant(variant, `&:${selector}`);
          addVariant(`group-${variant}`, `:merge(.group):${selector} &`);
          addVariant(`peer-${variant}`, `:merge(.peer):${selector} ~ &`);
        });
      });
    },
    { theme: { zIndex: arrToObj(zIndexes) } }
  );
}
