(function($, undefined) {
  $(document).ready(function() {
    // Collections
    Lectio.Items = new ItemsCollection;
    Lectio.ReadLaterCollection = new ReadLaterCollection;
    Lectio.Items.fetch({
      success : function() {
        if ((!location.hash || location.hash === '#/') && Lectio.Items.last()) {
          Lectio.Stream.read(Lectio.Items.last().get('_id'));
        }
      }
    });

    // Views
    Lectio.Stream = new Stream;
    Lectio.MainMenu = new MainMenu;
    Lectio.ReadLater = new ReadLater;
    Lectio.ReadLaterMenu = new ReadLaterMenu;
    Lectio.FocusManager = new FocusManager;
    Lectio.OfflineManager = new OfflineManager;
    Lectio.Router = new Router;

    Lectio.FocusManager.bind('focused', function(article) {
      if (article.is('article.preview')) Lectio.Stream.read(article.attr('id').split('-')[1]);
    });

    Backbone.history.start();  
  });
})(jQuery);
