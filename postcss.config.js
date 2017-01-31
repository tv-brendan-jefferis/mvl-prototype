module.exports = {
    use: [
        "postcss-partial-import",
        "postcss-cssnext",
        "postcss-advanced-variables",
        "postcss-discard-empty",
        "postcss-merge-rules",
        "cssnano"
    ],
    input: "src/css/app.scss",
    "local-plugins": true,
    map: true,
    "postcss-partial-import": {
        glob: true,
        extensions: [".css", ".scss"],
        prefix: false,
        onImport: function(sources) {
            global.watchCSS(sources, this.from);
        }
    },
    "postcss-cssnext": {
        warnForDuplicates: false
    },
    "cssnano": {
        "svgo": false
    }
};