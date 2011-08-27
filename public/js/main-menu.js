(function($, undefined) {
  MainMenu = Backbone.View.extend({
    el      : $('#main-menu menu'),
    events  : {
      'click #go-read-later' : 'readLater'
    },
    
    readLater : function() {
      Lectio.Router.navigate('/read-later', true);
    }
  });
})(jQuery);