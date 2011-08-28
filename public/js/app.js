(function($, undefined) {  
  // Collections
  Lectio.StreamCollection = new StreamCollection;
  Lectio.ReadLaterCollection = new ReadingList;  
  Lectio.StreamCollection.fetch();
  
  // Views
  Lectio.Stream = new Stream;
  Lectio.MainMenu = new MainMenu;
  Lectio.ReadLater = new ReadLater;
  Lectio.ReadLaterMenu = new ReadLaterMenu;
  
  Lectio.Router = new Router;
  Backbone.history.start();
  
  Lectio.Stream.read(Lectio.StreamCollection.at(0));
})(jQuery);
