module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transformIgnorePatterns: [
    '/node_modules/(?!(shared)/)', // Transforma arquivos dentro do pacote 'shared'
  ],
};
