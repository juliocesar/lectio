(function($, undefined) {
  CacheManager = function() {
    var self = this;

    _.extend(self, Backbone.Events);

    if(!window.applicationCache) return;

    // Check if the browser's managed to fully retrieve an update before we
    // were called
    if(window.applicationCache.status === window.applicationCache.UPDATEREADY) {
      update();
    }

    $(window.applicationCache)
      .bind('checking',     checking)
      .bind('updateready',  update)
      .bind('noupdate',     noupdate)
      .bind('error',        error)
      .bind('progress',     progress);

    function error(e) { console.log('error', e); }
    
    function checking() {
    }

    function noupdate() {
    }

    function update() {
      console.log("New version available");
      window.applicationCache.swapCache();
      Lectio.modal({
        title   : 'Updates available!',
        message : 'There are updates available for Lectio. Refresh the window to grab them.',
        success : function() { window.location.reload(); }
      });
    }

    function progress(event) {
    }
  };
})(jQuery);
