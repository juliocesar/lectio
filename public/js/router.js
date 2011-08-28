(function($, undefined) {
  Router = Backbone.Router.extend({
    body : $('body'),
    
    routes : {
      '/'           : 'root',
      '/items/:id'  : 'open',
      '/read-later' : 'readLater'
    },
    
    root : function() {
      console.log("ROUTE");
      this.body.removeClass('read-later');
    },
    
    open : function(id) {
      this.body.removeClass('read-later');
      Lectio.Stream.read(id);
    },
    
    readLater : function() {
      this.body.addClass('read-later');
      Lectio.ReadLater.open(Lectio.ReadLaterCollection.at(0));
    }
  });
})(jQuery);