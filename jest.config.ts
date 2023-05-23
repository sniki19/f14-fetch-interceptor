import type { Config } from 'jest'

const ignoreDirs = [
  'dist/',
  'node_modules/',
  'packages/',
  'src/jest'
]

export default async (): Promise<Config> => ({
  preset: 'ts-jest',
  verbose: false,
  roots: ['./src'],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  testPathIgnorePatterns: ignoreDirs,
  coveragePathIgnorePatterns: ignoreDirs,
  coverageDirectory: '<rootDir>/coverage/',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.([t]sx?)$',
  moduleFileExtensions: ['ts', 'js', 'json'],
  // testEnvironment: 'node'
})