export default [
  {
    files: ['**/*.js'], //only check .js files in server
    rules: {
      semi: 'error',
      //'no-unused-vars': 'warn', //if varaibles are enused
    },
  },
];
