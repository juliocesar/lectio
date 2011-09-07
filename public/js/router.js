(function($, undefined) {
  Router = Backbone.Router.extend({
    body    : $('body'),
    classes : 'read-later preferences offline about',

    routes : {
      ''              : 'root',
      '/'             : 'root',
      '/items/:id'    : 'open',
      '/read-later'   : 'readLater',
      '/offline'      : 'offline',
      '/preferences'  : 'preferences',
      '/about'        : 'about'
    },

    root : function() {
      if (navigator.onLine) {
        this.body.removeClass(this.classes);
      } else {
        this.navigate('/offline', true);
      }
      key.setScope('stream');
      $('#go-read-later').tipsy('hide');
    },

    offline : function() {
      this.body.removeClass(this.classes).addClass('offline');
      $('#go-read-later').tipsy('show');
    },

    preferences : function() {
      this.body.removeClass(this.classes).addClass('preferences');
    },

    about : function() {
      this.body.removeClass(this.classes).addClass('about ');
    },

    open : function(id) {
      this.body.removeClass(this.classes);
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