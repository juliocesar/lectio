(function($, undefined) {  
  // Collections
  Lectio.StreamCollection = new StreamCollection;
  Lectio.StreamCollection.reset(Fixtures);  
  
  // Views
  Lectio.Stream = new Stream;
  Lectio.Router = new Router;
  Backbone.history.start();
})(jQuery);