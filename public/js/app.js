(function($, undefined) {
  Lectio.boot = function() {
    Lectio.StreamCollection.reset(Fixtures);
  };
  
  // Collections
  Lectio.StreamCollection = new StreamCollection;
  
  // Views
  Lectio.Stream = new Stream;
  
  $(document).ready(Lectio.boot);
})(jQuery);