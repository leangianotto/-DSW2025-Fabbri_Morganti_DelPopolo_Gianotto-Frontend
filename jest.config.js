module.exports = {
    displayName: 'mi-ecommerce',
    maxWorkers: 3,
    bail:true,
    preset:'jest-preset-angular',
    roots:['<rootDir>/src/'],
    testMatch:['**/+(*.)+(spec).+(ts)'],
    setupFilesAfterEnv:['<rootDir>/test.ts'],
    collectCoverage:true,
    cacheDirectory: '<rootDir>/jestCache',
    coverageReporters: ['text-summary', 'lcov'],
    coverageDirectory: 'coverage/mi-ecommerce',
    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tsconfig.spec.json',
        },
    },
    moduleNameMapper: {
  '^src/(.*)$': '<rootDir>/src/$1',
},
};