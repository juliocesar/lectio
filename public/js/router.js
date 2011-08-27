(function($, undefined) {
  Router = Backbone.Router.extend({
    routes : {
      '/'           : 'root',
      '/items/:id'  : 'open'
    },
    
    root : function() {
      
    },
    
    open : function(id) {
      Lectio.Stream.read(id);
    }
  });
})(jQuery);