module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    "react-native-reanimated/plugin",
    [
      "module:react-native-dotenv",
      {
        "envName": "APP_ENV",
        "moduleName": "@env",
        "path": ".env",
        "safe": false,
        "allowUndefined": true,
        "verbose": false
      },
    ],
    [
      "module-resolver",
      {
        root: ["./src"],
        alias: {
          "@src": "./src",
          "@components": "./src/components",
          "@screens": "./src/screens",
          "@styles": "./src/styles",
          "@hooks": "./src/hooks",
          "@configs": "./src/configs",
        },
      },
    ],
  ],
};
