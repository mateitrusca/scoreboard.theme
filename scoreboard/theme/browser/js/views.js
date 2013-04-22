if(window.Scoreboard === undefined){
  var Scoreboard = {
    version: '1.0'
  };
}

Scoreboard.Views = {
  templates: {},
  initViews: function(){
    var self = this;
    self.ScenarioNavigationView = Backbone.View.extend({
      template: self.getTemplate('scenario-navigation'),
      initialize: function(options){
        this.cube_url = options.cube_url;
        this.scenario_url = options.scenario_url;
        this.scenarios = [];
        this.has_selected_scenario = false;
        this.update();
      },
      update: function(){
        var view = this;
        jQuery.ajax({
          'url': view.cube_url + '/@@relations',
          'success': function(data){
            view.scenarios = jQuery.map(data, function(scenario){
              if(scenario.url == view.scenario_url){
                scenario.selected = true;
                view.has_selected_scenario = true;
              }
              return scenario;
            });
            view.render();
          }
        });
      },
      render: function(){
        this.$el.html(this.template({
          scenarios: this.scenarios,
          has_selected_scenario: this.has_selected_scenario
        }));
      }
    });

    self.DatasetNavigationView = Backbone.View.extend({
      template: self.getTemplate('datacube-navigation'),
      initialize: function(options){
        this.cube_url = options.cube_url;
        this.selected_url = options.selected_url;
        this.cubes = [];
        this.has_selected = false;
        this.update();
      },
      update: function(){
        var view = this;
        jQuery.ajax({
          'url': view.cube_url + '/@@datacubes',
          'success': function(data){
            view.cubes = jQuery.map(data, function(cube){
              if(cube.url == view.selected_url){
                cube.selected = true;
                view.has_selected = true;
              }
              return cube;
            });
            view.render();
          }
        });
      },
      render: function(){
        this.$el.html(this.template({
          cubes: this.cubes,
          has_selected: this.has_selected
        }));
      }
    });
  },
  loadTemplates: function(){
    var self = this;
    jQuery.ajax({
      'url': '@@scoreboard.js.templates',
      'async': false,
      'success': function(data){
        self.templates = data;
        self.initViews();
      }
    });
  },
  getTemplate: function(name){
    var self = this;
    return Handlebars.compile(self.templates[name]);
  },
  init: function(){
    var self = this;
    self.loadTemplates();
  }
};


jQuery(document).ready(function(){
  Scoreboard.Views.init();
});
