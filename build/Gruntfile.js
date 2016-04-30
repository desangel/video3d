/*!
 * video3d's Gruntfile
 */

/* jshint node: true */
module.exports = function(grunt) {
	'use strict';

	// Force use of Unix newlines
	grunt.util.linefeed = '\n';

	function readOptionalJSON( filepath ) {
		var stripJSONComments = require( "strip-json-comments" ),
			data = {};
		try {
			data = JSON.parse( stripJSONComments(
				fs.readFileSync( filepath, { encoding: "utf8" } )
			) );
		} catch ( e ) {}
		return data;
	}
	
	var fs = require( "fs" );
	var	srcHintOptions = readOptionalJSON( "../src/js/.jshintrc" );
		
	if ( !grunt.option( "filename" ) ) {
		grunt.option( "filename", "src/js/index.js" );
	}
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// Metadata.
		meta: {
			banner: {
				jshint: {
					global: '/* global window document */',
					node: '/* jshint node: true */'
				}
			},
			dist: {
				jsDist: 'dist/js/'+'<%= pkg.name %>'+'.js',
				jsMapDist: 'dist/js/'+'<%= pkg.name %>'+'.min.map',
				jsMinDist: 'dist/js/'+'<%= pkg.name %>'+'.min.js',
				cssDist: 'dist/css/'+'<%= pkg.name %>'+'.css',
				cssMapDist: 'dist/css/'+'<%= pkg.name %>'+'.css.map',
				cssMinDist: 'dist/css/'+'<%= pkg.name %>'+'.min.css'
			},
			main: {
				jsMain: 'index.js',
				sassMain: 'main.scss'
			},
			path: {
				basePath: '../',
				libPath: 'libs/',
				distPath: 'dist/',
				jsPath: 'src/js/',
				sassPath: 'src/sass/',
				examplesPath: 'example/',
				tempPath: 'temp/'
			}
		},

		banner: '/*!\n' +
			' * =====================================================\n' +
			' * <%= pkg.name %> v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
			' * =====================================================\n' +
			' */\n',

		//tasks
		clean: {
			all: ['<%= meta.path.distPath %>'],
			temp: ['temp'],
			sourceMap: ['<%= meta.path.distPath %>css/*.map']
		},

		//css
		sass: {
			options: {
				banner: '<%= banner %>',
				style: 'expanded',
				unixNewlines: true
			},
			dist: {
				files: {
					'<%= meta.path.distPath %>css/<%= pkg.name %>.css': '<%= meta.path.basePath %><%= meta.path.sassPath %><%= meta.main.sassMain %>'
				}
			}
		},

		csscomb: {
			options: {
				config: 'sass/.csscomb.json'
			},
			dist: {
				files: {
					'<%= meta.path.distPath %>/css/<%= pkg.name %>.css': '<%= meta.path.distPath %>/css/<%= pkg.name %>.css'
				}
			}
		},
		
		cssmin: {
			options: {
				banner: '', // set to empty; see bellow
				keepSpecialComments: '*', // set to '*' because we already add the banner in sass
				sourceMap: false
			},
			main: {
				src: '<%= meta.path.distPath %>css/<%= pkg.name %>.css',
				dest: '<%= meta.path.distPath %>css/<%= pkg.name %>.min.css'
			}
		},

		//js
		jsonlint: {
			pkg: {
				src: [ 'package.json' ]
			}
		},
		
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: {
				src: [
					"<%= meta.path.distPath %>/*.js"
				],
				options: {
					jshintrc: true,
					node: true
				}
			},
			dist: {
				src: "<%= meta.path.distPath %>/*.js",
				options: srcHintOptions
			},
			grunt: {
				src: ['Gruntfile.js', 'grunt/*.js']
			},
			src: {
				//src: '<%= meta.path.jsPath %>*.js'
				src: '<%= meta.path.basePath %><%= meta.path.jsPath %>*'
			}
		},

		jscs: {
			options: {
				config: '.jscsrc'
			},
			//docs: { src: '<%= jshint.docs.src %>' },
			grunt: { src: '<%= jshint.grunt.src %>' },
			src: { src: '<%= jshint.src.src %>' }
		},
		
		browserify: {
			//import libs
			vendor: {
				src: [],
				dest: '<%= meta.path.tempPath %>vendor.js',
				options: {
					//require: ['jquery'],
					//alias: { three: '../libs/three/three.js' },
					banner: '<%= meta.banner.jshint.node %>'
				}
			},
			app: {
				src: ['<%= meta.path.basePath %><%= meta.path.jsPath %>/*.js'],
				dest: '<%= meta.path.tempPath %>app.js',
				options: {
					external: ['three'],
					banner: '<%= meta.banner.jshint.node %>'
				}
			}
		},
		
		//no amd js build
		concat: {
			main: {
				options: {
					banner: '<%= banner %>'
				},
				src: [
					'<%= meta.path.tempPath %>vendor.js',
					'<%= meta.path.tempPath %>app.js'
				],
				dest: '<%= meta.path.distPath %>js/<%= pkg.name %>.js'
			}
		},
		
		uglify: {
			options: {
				banner: '<%= banner %>',
				mangle: true,
				preserveComments: false,
				sourceMap: true,
				report: 'min',
				compress: {
					'hoist_funs': false,
					loops: false,
					unused: false
				}
			},
			main: {
				src: '<%= concat.main.dest %>',
				dest: '<%= meta.path.distPath %>js/<%= pkg.name %>.min.js'
			}
		},
		
		copy: {
			dist: {
				expand: true,
				cwd: '<%= meta.path.distPath %>',
				src: ['**/<%= pkg.name %>*'],
				dest: '<%= meta.path.basePath %><%= meta.path.distPath %>'
			},
			examples: {
				expand: true,
				cwd: '<%= meta.path.basePath %><%= meta.path.distPath %>',
				src: ['**/<%= pkg.name %>*'],
				dest: '<%= meta.path.basePath %><%= meta.path.examplesPath %>'
			}
		},
		
		watch: {
			options: {
				dateFormat: function(time) {
					grunt.log.writeln('The watch finished in ' + time + 'ms at' + (new Date()).toString());
					grunt.log.writeln('Waiting for more changes...');
				},
				livereload: true
			},
			scripts: {
				files: [
					'<%= meta.path.basePath %><%= meta.path.sassPath %>/**/*.scss',
					'<%= meta.path.basePath %><%= meta.path.jsPath %>/**/*.js'
				],
				tasks: 'dist'
			}
		}
		
	});
	// Load the plugins
	require('load-grunt-tasks')(grunt, {
		scope: 'devDependencies'
	});
	require('time-grunt')(grunt);
	//grunt.loadTasks( "build/tasks" );
	
	// Default task(s).
	grunt.registerTask('cleanAll', ['clean']);
	
	grunt.registerTask('lint', ['jsonlint', 'jshint', 'jscs']);
	grunt.registerTask('dist-css', ['sass', 'csscomb', 'cssmin']);
	grunt.registerTask('dist-js', [ 'browserify', 'concat', 'lint', 'uglify']); 
	grunt.registerTask('dist', ['dist-css', 'dist-js', 'copy']); 
	//grunt.registerTask('dev', ['clean', 'dist', 'clean:temp']);
	grunt.registerTask('dev', ['clean', 'dist']);
	grunt.registerTask('default', ['dev']);
	
	grunt.registerTask('dev-js', ['clean', 'dist-js', 'copy']);

	grunt.registerTask('server', ['dist','watch']);

	grunt.event.on('watch', function(action, filepath, target) {
		grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
	});
};