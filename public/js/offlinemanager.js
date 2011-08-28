(function($, undefined) {
  OfflineManager = function() {
    var body = $('body');
    $(window).bind('offline', function() {
      Lectio.Router.navigate('/offline', true);
    })
    
    $(window).bind('online', function() {
      body.removeClass('offline');
      Lectio.Router.navigate('/', true);
    });
  }
})(jQuery);