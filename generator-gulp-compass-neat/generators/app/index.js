'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the super ' + chalk.red('Gulp-Compass-Neat') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'someOption',
      message: 'Press Enter to proceed'
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;
      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      // Make App Directory
      this.mkdir('app');
      this.mkdir('app/source');
      this.mkdir('app/source/sass');
      this.mkdir('app/source/js');
      this.mkdir('app/source/images');


      // Files within the App Directory
      this.copy('index.html', 'app/index.html');

      // SCSS Files
      this.copy('_breakpoints.scss', 'app/source/sass/_breakpoints.scss');
      this.copy('_mixins.scss', 'app/source/sass/_mixins.scss');
      this.copy('_variables.scss', 'app/source/sass/_variables.scss');
      this.copy('_reset.scss', 'app/source/sass/_reset.scss');
      this.copy('app.scss', 'app/source/sass/app.scss');

      //Bowerrc file
      this.copy('.bowerrc');

      this.fs.copy(
        this.templatePath('_package.json'),
        this.destinationPath('package.json')
      );
      this.fs.copy(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json')
      );
    },

    projectfiles: function () {
      // Gulp File
      this.copy('gulpfile.js', 'gulpfile.js');
      this.copy('README.MD', 'README.MD');

      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
    }
  },

  install: function () {
    this.installDependencies();
  }
});
