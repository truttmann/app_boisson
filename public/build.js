({
    optimize: "none",
    mainConfigFile : "js/main.js",
    baseUrl : "js",
    name: "main",
    out: "js/main_app.js",
    paths : {
        requireLib : 'lib/require',
    },
    inlineText: true,
    stubModules: ['text'],
    include : [ "requireLib" ]
})
