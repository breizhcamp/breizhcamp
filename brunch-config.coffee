exports.config =
  files:
    javascripts:
      joinTo:
        'js/vendor.js': /^bower_components/
        'js/app.js': /^(app|vendor)/
    stylesheets:
      joinTo: 'styles/main.css'
  server:
    run: yes
  plugins:
    less:
      optimize: true
    jshint:
      pattern: /^(app|vendor)\/.*\.js$/
  overrides:
    production:
      optimize: true
      sourceMaps: false
      plugins:
        autoReload:
          enabled: false