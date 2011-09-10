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
      console.log("Checking for update");
    }

    function noupdate() {
      console.log("No updates available");
    }

    function update() {
      console.log("New version available");
      window.applicationCache.swapCache();
      //window.location.reload();
    }

    function progress(event) {
      console.log("Got cache progress", event);
    }
  };
})(jQuery);
