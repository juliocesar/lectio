(function($, undefined) {
  Preview = Backbone.Model.extend({
    idAttribute : '_id',
    
    initialize : function() {
      this.set({ summary : $(this.get('body')).text() });      
      this.set({ sourceClass : this.sourceClass(this.get('source').name) });
    },
    
    sourceClass : function(name) {
      switch(name) {
        case 'Hacker News':
          return 'yc';
        case 'New York Times':
          return 'nyt';
        case 'ConversationEDU':
          return 'conversation';
      }
    }
  });

  StreamCollection = Backbone.Collection.extend({
    model : Preview,
    url   : '/api/items.json'
  });
})(jQuery);