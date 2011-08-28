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
      if (this.has('published'))
        this.set({ published: this.get('published').replace(/\.\d\d\d/g, "") });
      this.set({ date: prettyDate(this.get('published')) });
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
          return 'gimmebar';
        case 'Gimme Bar Collection: Wanderlust':
          return 'gimmebar';
        case 'Gimme Bar Collection: Illustration':
          return 'gimmebar';
        case 'Gimme Bar Collection: Music Art':
          return 'gimmebar';
        case 'Freakonomics':
          return 'freakonomics';
        case 'Wired':
          return 'wired';
        case 'Comment is free':
          return 'commentisfree';
        case 'If we don&rsquo;t, remember me':
          return 'iwdrm';
        case 'Anil Dash':
          return 'anildash';
        case 'The Atlantic: Technology':
          return 'atlantictech';
        case 'The Big Picture':
          return 'bigpicture';
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
      return (new Date(item.get("published"))).getTime();
    }
  });

  ReadLaterCollection = Backbone.Collection.extend({
    model         : ReadLaterItem,
    localStorage  : new Store('reading-list-yo')
  });
})(jQuery);
