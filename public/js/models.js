Lectio = {};

(function($, undefined) {
  Item = Backbone.Model.extend({
    idAttribute : '_id',
    
    initialize : function() {
      if (this.has('body')) {
        var words = $(this.get('body')).text().ellipsisAfter(20);
        this.set({ summary : words.split(/\s+/).length > 1 ? words : '' });
      } else {
        this.set({ body : '', summary : '' });
      }
      if (this.has('source')) this.set({ sourceClass : this.sourceClass(this.get('source').name) });
    },
    
    sourceClass : function(name) {
      switch(name) {
        case 'Hacker News':
          return 'yc';
        case 'New York Times':
          return 'nyt';
        case 'ConversationEDU':
          return 'conversation';
        case 'Engadget':
          return 'engadget';
        case 'Function Source':
          return 'functionsource';
        case 'The Setup':
          return 'usesthis';
        case 'Flickr Explore Interestingess':
          return 'flickr';
        case 'Gimme Bar Collection: Color':
          return 'gimmebar'
        default:
          return 'foo';
      }
    }
  });

  ReadLaterItem = Item.extend();

  ItemsCollection = Backbone.Collection.extend({
    model : Item,
    url   : '/api/items',
    comparator : function(item) {
      return item.get("date");
    }
  });

  ReadLaterCollection = Backbone.Collection.extend({
    model         : ReadLaterItem,
    localStorage  : new Store('reading-list-yo')
  });
})(jQuery);
