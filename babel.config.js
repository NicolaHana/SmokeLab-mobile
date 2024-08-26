module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
        ["react-native-worklets-core/plugin"],
        ["@babel/plugin-transform-private-methods", { "loose": true }],
    ]
};
