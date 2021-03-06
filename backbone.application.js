(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    // AMD. Register as an anonymous module.
    define(["underscore","backbone"], function(_, Backbone) {
      // Use global variables if the locals are undefined.
      return factory(_ || root._, Backbone || root.Backbone);
    });
  }
  else if (typeof exports === 'object') {
    // Commonjs module
    module.exports = factory(require("underscore"), require("backbone"));
  } 
  else {
    // RequireJS isn't being used. Assume underscore and backbone are loaded in <script> tags
    factory(_, Backbone);
  }
}(this, function(_, Backbone) {

  var global = this;

  var App = function (options) {
    if (!(this instanceof App)) return new app(options);
    this.options = options || {};
    this.plugins = [];
  }

  _.extend(App.prototype, Backbone.Events);

  App.prototype.use = function (plugin) {
    if (plugin instanceof App) {
      return this.use(plugin.plugins);
    }

    if (plugin instanceof Array) {
      for (var i = 0, p; p = plugin[i++];) this.use(p);
      return this;
    }

    this.plugins.push(plugin);
    return this;
  }

  App.prototype.start = function () {
    var plugins = this.plugins;
    var ctx = this;
    var i = 0;
    var last = arguments[arguments.length - 1];
    var done = 'function' == typeof last && last;
    var args = done
      ? slice.call(arguments, 0, arguments.length - 1)
      : slice.call(arguments);

    // next step
    function next (err) {
      if (err) return done(err);
      var plugin = plugins[i++];
      var arr = slice.call(args);

      if (!plugin) {
        return done && done.apply(null, [null].concat(args));
      }

      wrap(fn, next).apply(ctx, arr);
    }

    next();

    return this;
  };

  return App;

}));