(function($, undefined) {
  var PreviewView = Backbone.View.extend({
    tagName   : 'article',
    template  : _.template($('#preview-template').html()),
    events    : {
      'click'         : 'read'
    },
        
    render : function() {
      var self = this;
      $(self.el)
        .html(self.template(self.model.toJSON()))
        .addClass(self.model.get('sourceClass'))
        .attr('id', 'preview-' + self.model.get('_id'))
        .find('button')
          .click(function(event) {
            event.stopPropagation();
            Lectio.ReadLaterCollection.create(self.model.attributes);
          });
      return this;
    },
    
    read : function() {
      Lectio.Router.navigate('/items/' + this.model.get('_id'), true);
    },
    
    readLater : function(event) {
      Lectio.ReadingList.add(this.model);
    }
  });
  
  var ArticleView = Backbone.View.extend({
    template : _.template($('#article-template').html()),
    
    render : function() {
      $(this.el)
        .html(this.template(this.model.toJSON()))
        .attr('id', 'laters-' + this.model.get('_id'));
      return this;
    }
  });
    
  Stream = Backbone.View.extend({
    el      : $('#stream'),
    reading : $('#reading-now'),
    
    initialize : function() {
      _.bindAll(this, 'add', 'addBunch');
      Lectio.StreamCollection.bind('add',   this.add);
      Lectio.StreamCollection.bind('reset', this.addBunch);
      Lectio.StreamCollection.trigger('reset');
      this.fixScrollbars();
    },
    
    add : function(item) {
      var view = new PreviewView({ model : item });
      this.el.append(view.render().el);
      return this;
    },
    
    addBunch : function() {
      Lectio.StreamCollection.each(this.add);
    },
    
    fixScrollbars : function() {
      var self = this, timer;
      this.el.scroll(_.throttle(function() {
        self.el.removeClass('inactive');
        clearTimeout(timer);
        timer = setTimeout(function() { self.el.addClass('inactive'); }, 500);
      }, 250));
    },
    
    read : function(id) {
      var item = Lectio.StreamCollection.get(id);
      if (!item || (this.reading.attr('data-id') === item.get('_id'))) return false;
      var self = this,
        article = new ArticleView({ model : item });
      self.reading.removeClass('reading');
      _.delay(
        function() {
          self.reading
            .html(article.render().el.innerHTML)
            .attr('data-id', item.get('_id'))
            .addClass('reading');
          self.reading.scrollTop(0);
        }, 
      270);
    }
  });
  
  var ReadLaterArticleView = Backbone.View.extend({
    tagName   : 'article',
    template  : _.template($('#read-later-template').html()),
    
    render : function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;      
    }
  });
  
  ReadLater = Backbone.View.extend({
    el : $('#read-later'),
    
    initialize : function() {
      _.bindAll(this, 'add', 'addBunch');
      Lectio.ReadLaterCollection.bind('add',    this.add);
      Lectio.ReadLaterCollection.bind('reset',  this.addBunch);
      Lectio.ReadLaterCollection.fetch();
    },
    
    add : function(item) {
      var view = new ReadLaterArticleView({ model : item });
      this.el.append(view.render().el);
      return this; 
    },
    
    addBunch : function() {
      Lectio.ReadLaterCollection.each(this.add);
    }
  });
  
  MainMenu = Backbone.View.extend({
    el      : $('#main-menu menu'),
    events  : {
      'click #go-read-later' : 'readLater'
    },
    
    readLater : function() {
      Lectio.Router.navigate('/read-later', true);
    }
  });
})(jQuery);