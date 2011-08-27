(function($, undefined) {  
  // Collections
  Lectio.StreamCollection = new StreamCollection;
  Lectio.StreamCollection.reset(Fixtures);
  
  // Views
  Lectio.Stream = new Stream;
  Lectio.MainMenu = new MainMenu;
  Lectio.Router = new Router;
  Backbone.history.start();
  
  Lectio.Stream.read(Lectio.StreamCollection.at(0));
})(jQuery);