const sass = require("sass");
const pngquant = require("imagemin-pngquant").default || require("imagemin-pngquant");
const mozjpeg = require("imagemin-mozjpeg").default || require("imagemin-mozjpeg");

const pkg = require("./package.json");
const theme = `./public/wp-content/themes/${pkg.name}-theme/`;
const nm = "./node_modules/";

const lib = [
  nm + "vanilla-lazyload/dist/lazyload.min.js",
  nm + "gsap/dist/gsap.min.js",
  nm + "gsap/dist/ScrollTrigger.min.js",
  nm + "swiper/swiper-bundle.min.js",
];

module.exports = function (grunt) {
  grunt.initConfig({
    sass: {
      options: {
        implementation: sass,
        sourceMap: false
      },
      dist: {
        files: [
          {
            src: "src/styles/admin.scss",
            dest: theme + "assets/admin.css",
          },
          {
            src: "src/styles/index.scss",
            dest: theme + "assets/main.css",
          }
        ],
      }
    },

    cssmin: {
      target: {
        files: [
          {
            src: theme + "assets/admin.css",
            dest: theme + "assets/admin.css",
          },
          {
            src: theme + "assets/main.css",
            dest: theme + "assets/main.css",
          }
        ]
      }
    },

    postcss: {
      options: {
        map: false,
        processors: [
          require("autoprefixer")(),
        ]
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: theme,
            src: ["**/*.css"],
            dest: theme
          }
        ]
      }
    },

    purgecss: {
      target: {
        options: {
          content: [
            theme + "*.php",
            theme + "template-parts/*.php",
            theme + "template-parts/**/*.php",
            theme + "assets/main.js"
          ]
        },
        files: {
          [theme + "assets/main.css"]: [theme + "assets/main.css"]
        }
      }
    },

    concat: {
      vendor: {
        files: [
          {
            src: lib,
            dest: theme + "assets/vendor.js",
          },
        ]
      },
      main: {
        files: [
          {
            src: [
              "src/scripts/helpers/*.js",
              "src/scripts/index.js",
              "src/scripts/*.js",
              "src/scripts/**/*.js",
              "!src/scripts/*init.js",
              "src/scripts/init.js",
            ],
            dest: theme + "assets/main.js",
          },
        ]
      }
    },

    terser: {
      options: {
        compress: {
          drop_console: true,
        },
        mangle: false,
        ecma: 2015,
      },
      vendor: {
        files: [
          {
            src: theme + "assets/vendor.js",
            dest: theme + "assets/vendor.js",
          }
        ]
      },
      main: {
        files: [
          {
            src: theme + "assets/main.js",
            dest: theme + "assets/main.js",
          }
        ]
      }
    },

    imagemin: {
      options: {
        use: [
          mozjpeg({ quality: 90 }),
          pngquant({ quality: [0.5, 0.5] }),
        ]
      },
      dynamic: {
        files: [{
          expand: true,
          cwd: theme + "assets/images/",
          src: ["**/*.{png,jpg,jpeg}"],
          dest: theme + "assets/images/",
        }]
      }
    },

    svgmin: {
      options: {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                cleanupIds: false
              }
            }
          }
        ]
      },
      dist: {
        files: [{
          expand: true,
          cwd: theme + "assets/images/",
          src: "**/*.svg",
          dest: theme + "assets/images/",
        }]
      }
    },

    browserSync: {
      bsFiles: {
        src: [
          theme + "*",
          theme + "**/*",
        ],
      },
      options: {
        watchTask: true,
        proxy: `local.${pkg.name}.com`,
        host: `local.${pkg.name}.com`,
        open: 'external',
        port: 3000,
        // https: {
        //   key: `./.crt/_wildcard.${pkg.name}.com-key.pem`,
        //   cert: `./.crt/_wildcard.${pkg.name}.com.pem`
        // }
      }
    },

    watch: {
      scss: {
        files: ["src/styles/*.scss", "src/styles/**/*.scss"],
        tasks: ["sass:dist", "postcss"],
      },
      scripts: {
        files: ["src/scripts/*.js", "src/scripts/**/*.js"],
        tasks: ["concat:vendor", "concat:main"],
      },
    },
  });

  grunt.loadNpmTasks("grunt-sass"); 
  grunt.loadNpmTasks("grunt-postcss");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-terser");
  grunt.loadNpmTasks("grunt-contrib-imagemin");
  grunt.loadNpmTasks("grunt-svgmin");
  grunt.loadNpmTasks("grunt-browser-sync");
  grunt.loadNpmTasks("grunt-purgecss");

  grunt.registerTask("dev", ["sass:dist", "postcss", "concat:vendor", "concat:main", "browserSync", "watch"]);
  grunt.registerTask("prod", ["sass:dist", "postcss", "concat:vendor", "concat:main", "cssmin", "purgecss", "terser:vendor", "terser:main"]);
  grunt.registerTask("images", ["imagemin", "svgmin"]);

  grunt.registerTask("default", ["prod"]);
  
};