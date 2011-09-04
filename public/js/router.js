(function($, undefined) {
  Router = Backbone.Router.extend({
    body    : $('body'),

    routes : {
      ''            : 'root',
      '/'           : 'root',
      '/items/:id'  : 'open',
      '/read-later' : 'readLater',
      '/offline'    : 'offline'
    },

    root : function() {
      if (navigator.onLine) {
        this.body.removeClass('read-later');
      } else {
        this.navigate('/offline', true);
      }
      key.setScope('stream');
      $('#go-read-later').tipsy('hide');
    },

    offline : function() {
      this.body.removeClass('read-later').addClass('offline');
      $('#go-read-later').tipsy('show');
    },

    open : function(id) {
      this.body.removeClass('read-later');
      var item = Lectio.Stream.read(id);
      if (!item) Lectio.Stream.delayedRead(id);
      key.setScope('stream');
      $('#go-read-later').tipsy('hide');
    },

    readLater : function() {
      this.body.addClass('read-later');
      if (Lectio.ReadLaterCollection.length) {
        Lectio.ReadLater.open(Lectio.ReadLaterCollection.at(0));
      } else {
        Lectio.ReadLater.isEmpty();
      }
      key.setScope('read later');
      $('#go-read-later').tipsy('hide');
    }
  });
})(jQuery);