(function($, undefined) {
  // Collections
  Lectio.Items = new ItemsCollection;
  Lectio.ReadLaterCollection = new ReadLaterCollection;
  Lectio.Items.fetch({
    success : function() {
      if (!location.hash) Lectio.Stream.read(Lectio.Items.at(0));
    }
  });

  // Views
  Lectio.Stream = new Stream;
  Lectio.MainMenu = new MainMenu;
  Lectio.ReadLater = new ReadLater;
  Lectio.ReadLaterMenu = new ReadLaterMenu;

  Lectio.Router = new Router;
  Backbone.history.start();
})(jQuery);
