(function($, undefined) {
  FocusManager = function() {
    var self = this,
      focused, lastStreamFocus,
      containers = '#stream, #reading-now, #read-later',
      $stream = $('#stream'),
      $readingNow = $('#reading-now'),
      $readLater = $('#read-later');
    
    _.extend(self, Backbone.Events);

    $(window).click(function(event) {
      var $target = $(event.target);
      switch($target.parents(containers)[0]) {
        case $stream[0]:
          setFocus($target.parents('article'));
          break;
        default:
          setFocus($target.parents(containers));
          break;
      }
    });

    key('left', 'stream', function() {
      var element = lastStreamFocus || $stream.find('article:first');
      setFocus(element);
    });

    key('right', 'stream', function() {
      if (focused.is('article.preview')) lastStreamFocus = focused;
      setFocus($readingNow);
      $readingNow.focus();
    });

    key('down', 'stream', function(event) {
      if (focused.parents('#stream').length) {
        event.preventDefault();
        var next = focused.next('article');
        if (next.length) {
          var criteria = next.outerHeight() + (next.outerHeight() / 0.6);
          if (focused.offset().top + criteria > window.innerHeight) scrollTo(next, '+=');
          setFocus(next);
        }
      }
    });

    key('up', 'stream', function(event) {
      if (focused.parents('#stream').length) {
        event.preventDefault();
        var previous = focused.prev('article');
        if (previous.length) {
          if (focused.offset().top - previous.outerHeight() < 70) scrollTo(previous, '-=');
          setFocus(previous);
        }
      }
    });

    function setFocus(element) {
      if (focused) focused.removeClass('focused');
      element.addClass('focused');
      element.focus();
      focused = element;
      self.trigger('focused', focused);
    }

    function scrollTo(element, operator) {
      $stream.animate({ scrollTop : operator + element.outerHeight() });
    }
  };
})(jQuery);