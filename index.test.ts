import cssNano from "cssnano";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import tailwindcssPlugin, { type Options } from ".";

async function compile(content: string, config: Options = {}) {
  const tailwindConfig = {
    content: [{ raw: content }] as never[],
    plugins: [tailwindcssPlugin(config)],
  };

  const result = await postcss([
    tailwindcss(tailwindConfig),
    cssNano(),
  ]).process("@tailwind utilities;", { from: undefined });
  return result.css;
}

test("Test 'z-' utility", async () => {
  expect(await compile("z-5")).toBe(".z-5{z-index:5}");

  expect(await compile("z-6", { zIndexes: ["6"] })).toBe(".z-6{z-index:6}");
});

test("Test 'a-' utility", async () => {
  // Check with built-in value
  expect(await compile("a-5")).toBe(".a-5{height:1.25rem;width:1.25rem}");
  expect(await compile("a-5x10")).toBe(".a-5x10{height:2.5rem;width:1.25rem}");
  expect(await compile("a-5xmax")).toBe(
    ".a-5xmax{height:max-content;width:1.25rem}"
  );

  // Check with arbitary value
  expect(await compile("a-[100%]")).toBe(
    ".a-\\[100\\%\\]{height:100%;width:100%}"
  );
  expect(await compile("a-[5remx10rem]")).toBe(
    ".a-\\[5remx10rem\\]{height:10rem;width:5rem}"
  );
  expect(await compile("a-[5remxmax-content]")).toBe(
    ".a-\\[5remxmax-content\\]{height:max-content;width:5rem}"
  );
});

test("Test 'p-' utility", async () => {
  // Check original utils aren't affected
  expect(await compile("p-5")).toBe(".p-5{padding:1.25rem}");
  expect(await compile("p-[1px]")).toBe(".p-\\[1px\\]{padding:1px}");

  // Check with built-in values
  expect(await compile("p-5x10")).toBe(".p-5x10{padding:1.25rem 2.5rem}");
});

test("Test 'm-' utility", async () => {
  // Check original utils aren't affected
  expect(await compile("m-5")).toBe(".m-5{margin:1.25rem}");
  expect(await compile("m-[1px]")).toBe(".m-\\[1px\\]{margin:1px}");

  // Check with built-in values
  expect(await compile("m-5x10")).toBe(".m-5x10{margin:1.25rem 2.5rem}");
});

test("Test 'gap-' utility", async () => {
  // Check original utils aren't affected
  expect(await compile("gap-5")).toBe(".gap-5{gap:1.25rem}");
  expect(await compile("gap-[1px]")).toBe(".gap-\\[1px\\]{gap:1px}");

  // Check with built-in values
  expect(await compile("gap-5x10")).toBe(".gap-5x10{gap:1.25rem 2.5rem}");
});

test("Test 'flex-' utility", async () => {
  expect(await compile("flex-start")).toBe(
    ".flex-start{align-items:flex-start;justify-content:flex-start}"
  );
  expect(await compile("flex-end")).toBe(
    ".flex-end{align-items:flex-end;justify-content:flex-end}"
  );
  expect(await compile("flex-center")).toBe(
    ".flex-center{align-items:center;justify-content:center}"
  );
  expect(await compile("flex-stretch")).toBe(
    ".flex-stretch{align-items:stretch;justify-content:stretch}"
  );
});

test("Test nth-child variant", async () => {
  const options: Options = { nths: [11] };

  expect(await compile("1st:w-10")).toBe(
    ".\\31st\\:w-10:first-child{width:2.5rem}"
  );
  expect(await compile("2nd:w-10")).toBe(
    ".\\32nd\\:w-10:nth-child(2){width:2.5rem}"
  );
  expect(await compile("11th:w-10", options)).toBe(
    ".\\31 1th\\:w-10:nth-child(11){width:2.5rem}"
  );

  // Group variants
  expect(await compile("group-1st:w-10")).toBe(
    ".group:first-child .group-1st\\:w-10{width:2.5rem}"
  );
  expect(await compile("group-2nd:w-10")).toBe(
    ".group:nth-child(2) .group-2nd\\:w-10{width:2.5rem}"
  );
  expect(await compile("group-11th:w-10", options)).toBe(
    ".group:nth-child(11) .group-11th\\:w-10{width:2.5rem}"
  );

  // Peer variants
  expect(await compile("peer-1st:w-10")).toBe(
    ".peer:first-child~.peer-1st\\:w-10{width:2.5rem}"
  );
  expect(await compile("peer-2nd:w-10")).toBe(
    ".peer:nth-child(2)~.peer-2nd\\:w-10{width:2.5rem}"
  );
  expect(await compile("peer-11th:w-10", options)).toBe(
    ".peer:nth-child(11)~.peer-11th\\:w-10{width:2.5rem}"
  );
});

test("Test nth-of-type variant", async () => {
  const options: Options = { nths: [11] };
  expect(await compile("1st-of:w-10")).toBe(
    ".\\31st-of\\:w-10:first-of-type{width:2.5rem}"
  );
  expect(await compile("2nd-of:w-10")).toBe(
    ".\\32nd-of\\:w-10:nth-of-type(2){width:2.5rem}"
  );
  expect(await compile("11th-of:w-10", options)).toBe(
    ".\\31 1th-of\\:w-10:nth-of-type(11){width:2.5rem}"
  );

  // Group variants
  expect(await compile("group-1st-of:w-10")).toBe(
    ".group:first-of-type .group-1st-of\\:w-10{width:2.5rem}"
  );
  expect(await compile("group-2nd-of:w-10")).toBe(
    ".group:nth-of-type(2) .group-2nd-of\\:w-10{width:2.5rem}"
  );
  expect(await compile("group-11th-of:w-10", options)).toBe(
    ".group:nth-of-type(11) .group-11th-of\\:w-10{width:2.5rem}"
  );

  // Peer variants
  expect(await compile("peer-1st-of:w-10")).toBe(
    ".peer:first-of-type~.peer-1st-of\\:w-10{width:2.5rem}"
  );
  expect(await compile("peer-2nd-of:w-10")).toBe(
    ".peer:nth-of-type(2)~.peer-2nd-of\\:w-10{width:2.5rem}"
  );
  expect(await compile("peer-11th-of:w-10", options)).toBe(
    ".peer:nth-of-type(11)~.peer-11th-of\\:w-10{width:2.5rem}"
  );
});

test("Test data-state variant", async () => {
  const options = { states: ["pending"] };

  expect(await compile("state-on:w-10")).toBe(
    ".state-on\\:w-10[data-state=on]{width:2.5rem}"
  );
  expect(await compile("state-off:w-10")).toBe(
    ".state-off\\:w-10[data-state=off]{width:2.5rem}"
  );
  expect(await compile("state-pending:w-10", options)).toBe(
    ".state-pending\\:w-10[data-state=pending]{width:2.5rem}"
  );

  // Group variants
  expect(await compile("group-state-on:w-10")).toBe(
    ".group[data-state=on] .group-state-on\\:w-10{width:2.5rem}"
  );
  expect(await compile("group-state-off:w-10")).toBe(
    ".group[data-state=off] .group-state-off\\:w-10{width:2.5rem}"
  );
  expect(await compile("group-state-pending:w-10", options)).toBe(
    ".group[data-state=pending] .group-state-pending\\:w-10{width:2.5rem}"
  );

  // Peer variants
  expect(await compile("peer-state-on:w-10")).toBe(
    ".peer[data-state=on]~.peer-state-on\\:w-10{width:2.5rem}"
  );
  expect(await compile("peer-state-off:w-10")).toBe(
    ".peer[data-state=off]~.peer-state-off\\:w-10{width:2.5rem}"
  );
  expect(await compile("peer-state-pending:w-10", options)).toBe(
    ".peer[data-state=pending]~.peer-state-pending\\:w-10{width:2.5rem}"
  );
});
