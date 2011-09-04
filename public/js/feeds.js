(function($, undefined) {
  
  function S4() {
     return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };

  function guid() {
     return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  };
  
  function loaded(result) {
    _.each(result.feed.entries, function(entry) {
      var item = new Item({ 
        _id : guid(),
        title: entry.title, 
        body : entry.content, 
        summary: entry.contentSnippet, 
        published: entry.publishedDate,
        source: { name : 'blog' }
      });
      Lectio.Items.add(item);
    });
  }
  
  // $(document).ready(function() {
  //   var feed = new google.feeds.Feed('http://julio-ody.tumblr.com/rss');
  //   feed.load(loaded);
  // });  
})(jQuery);