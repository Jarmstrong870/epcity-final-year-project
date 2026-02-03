module.exports = {
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|svg|mp4|gif)$': '<rootDir>/__mocks__/fileMock.js', // 👈 added gif
    '\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.js',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!lucide-react).+\\.js$', // 👈 allow lucide-react to be transformed
  ],
};
