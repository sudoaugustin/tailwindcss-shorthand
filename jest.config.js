/** @type {import('ts-jest').JestConfigWithTsJest} */

module.exports = {
  testMatch: ["**/?(*.)+(test).+(ts|tsx)"],
  transform: { "^.+\\.(ts|tsx)$": "esbuild-jest" },
};
