exports.config =
  conventions:
    ignored: '/^_.+/' # for _config.yml to be copied in production
  files:
    javascripts:
      joinTo:
        'js/vendor.js': /^bower_components/,
        'js/app.js': /^(app|vendor)/,
        'js/appProgramme.js': /^(appProgramme|vendor)/
    stylesheets:
      joinTo: 'styles/main.css'
  server:
    run: yes
  plugins:
    less:
      optimize: true
    jshint:
      pattern: /^(app|vendor)\/.*\.js$/
    digest:
      environments: []
  overrides:
    production:
      optimize: true
      sourceMaps: false
      plugins:
        autoReload:
          enabled: false
  watcher:
    usePolling: true
