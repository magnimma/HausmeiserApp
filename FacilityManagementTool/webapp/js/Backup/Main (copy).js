require.config({
  paths: {
    f7: 'libs/framework7.min.js',
  }

});

require([
  // Load our app module and pass it to our definition function
  'FMApp',

], function(FMApp){
  // The "app" dependency is passed in as "App"
  // Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
  FMApp.init();
});