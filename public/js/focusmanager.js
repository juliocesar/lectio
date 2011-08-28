(function($, undefined) {
  FocusManager = function() {
    var self = this,
      $stream = $('#stream');
      
    $(window).click(function(event) {
      var target = $(event.target);
      clearFocus();
      if (target.parents('article').hasClass('preview')) {
        var preview = target.parents('article');
        preview.addClass('focused');
        self.focused = 'stream';
        self.element = preview;
      }
    });
        
    $(window).keyup(function(event) {
      if (self.focused === 'stream') {
        event.preventDefault();
        switch(event.keyCode) {
          case 40:
            var next = self.element.next('article');
            if (next.length) focus(next);            
            break;
          case 38:
            var previous = self.element.prev('article');
            if (previous.length) focus(previous);
            break;
        }
      }
    });    
    
    function focus(element) {
      self.element.removeClass('focused');
      element.addClass('focused');
      self.element = element;
      Lectio.Stream.read(element.attr('id').split('-')[1]);
      scrollTo(element);
    }
    
    function clearFocus() {
      if (self.element) {
        self.element.removeClass('focused');
      }
      delete self.element;
      delete self.focused;
    }
    
    function scrollTo(element) {
      var area = _.reduce(
        element.prevUntil(), 
        function(total, article) { return total + $(article).outerHeight(); },
        0
      );
      $stream.animate({ scrollTop : area });
    }
  };
})(jQuery);