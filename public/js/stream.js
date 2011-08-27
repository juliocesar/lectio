(function($, undefined) {
  PreviewView = Backbone.View.extend({
    template  : _.template($('#preview-template').html()),
    events    : {
      'click' : 'read'
    },
        
    render : function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },
    
    read : function() {
      Lectio.Stream.read(this.model);
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
    },
    
    add : function(item) {
      var view = new PreviewView({ model : item });
      this.el.append(view.render().el);
      return this;
    },
    
    addBunch : function() {
      Lectio.StreamCollection.each(this.add);
    },
    
    read : function(item) {
      if (this.reading.attr('data-id') === item.get('id')) return false;
      var self = this,
        article = new ArticleView({ model : item });
      self.reading.removeClass('reading');
      _.delay(
        function() {
          self.reading
            .html(article.render().el.innerHTML)
            .attr('data-id', item.get('id'))
            .addClass('reading');
        }, 
      250);
    }
  });
})(jQuery);