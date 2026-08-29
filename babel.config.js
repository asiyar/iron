module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }], "nativewind/babel"],
    // Reanimated 4 worklet dönüşümünü react-native-worklets sağlar.
    // Bu eklenti listenin EN SONUNDA kalmalı.
    plugins: ["react-native-worklets/plugin"],
  };
};
