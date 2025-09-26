module.exports = {
    __esModule: true,
    default: "SvgMock",
    ReactComponent: props => {
        return require("react").createElement("svg", props);
    },
};
