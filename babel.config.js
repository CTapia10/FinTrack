module.exports = function (api) {
  api.cache(true);

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["."],
          alias: {
            "@app": "./app",
            "@domain": "./src/domain",
            "@infra": "./src/infrastructure",
            "@presentation": "./src/presentation",
            "@shared": "./src/shared"
          }
        }
      ],
      "react-native-reanimated/plugin"
    ]
  };
};
