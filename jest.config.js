module.exports = {
    extensionsToTreatAsEsm: ['.ts'],
    globals: {
      'jest': {
        useESM: true,
      },
    },
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1',
    },
  }