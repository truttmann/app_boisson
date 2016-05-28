({
	// Nice not to inline/minify things for debugging
	optimize: "none",

	// Base js directory relative to the build js
	baseUrl : '.',
	//appDir: "./",
	paths : {
            requireLib : 'lib/require',
	},
	
	name : 'main',
	mainConfigFile : 'main.js',

	// File to output compiled js to
	out : 'main_app.js',
	
	inlineText: true,
	 
	stubModules: ['text'],

	include : [ "requireLib" ]
})