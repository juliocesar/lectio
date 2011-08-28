(function($, undefined) {
  Router = Backbone.Router.extend({
    body : $('body'),
    
    routes : {
      ''            : 'root',
      '/'           : 'root',
      '/items/:id'  : 'open',
      '/read-later' : 'readLater'
    },
    
    root : function() {
      this.body.removeClass('read-later');
    },
    
    open : function(id) {
      this.body.removeClass('read-later');
      Lectio.Stream.read(id);
    },
    
    readLater : function() {
      this.body.addClass('read-later');
      if (Lectio.ReadLaterCollection.length) {
        Lectio.ReadLater.open(Lectio.ReadLaterCollection.at(0));
      } else {
        Lectio.ReadLater.isEmpty();
      }
    }
  });
})(jQuery);