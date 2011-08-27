(function($, undefined) {
  PreviewView = Backbone.View.extend({
    template  : _.template($('#preview-template').html()),
    events    : {
      'click'         : 'read'
    },
        
    render : function() {
      var self = this;
      $(self.el)
        .html(self.template(self.model.toJSON()))
        .find('button')
          .click(function(event) {
            event.stopPropagation();
            Lectio.ReadingList.add(self.model);
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
  
  ArticleView = Backbone.View.extend({
    template : _.template($('#article-template').html()),
    
    render : function() {
      $(this.el).html(this.template(this.model.toJSON()));
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
      this.el.scroll(function() {
        self.el.removeClass('inactive');
        clearTimeout(timer);
        timer = setTimeout(function() { self.el.addClass('inactive'); }, 500);
      });
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
        }, 
      270);
    }
  });
})(jQuery);