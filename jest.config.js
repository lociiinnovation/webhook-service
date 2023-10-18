/* eslint-disable */
const tsPreset = require('ts-jest/jest-preset');
const mongoPreset = require('@shelf/jest-mongodb/jest-preset');

module.exports = {
  ...tsPreset,
  ...mongoPreset,
  testEnvironment: 'node',
	collectCoverage: true,
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 85,
			lines: 85,
			statements: 85,
		}
	}
};
