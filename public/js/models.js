(function($, undefined) {
  Item = Backbone.Model.extend({
    idAttribute : '_id',
    
    initialize : function() {
      this.set({ summary      : $(this.get('body')).text().ellipsisAfter(20) });      
      this.set({ sourceClass  : this.sourceClass(this.get('source').name) });
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
        default:
          return 'foo';
      }
    }
  });

  StreamCollection = Backbone.Collection.extend({
    model : Item,
    url   : '/api/items/engadget'
  });
  
  ReadingList = Backbone.Collection.extend({
    model         : Item,
    localStorage  : new Store('reading-list-yo')
  });
})(jQuery);