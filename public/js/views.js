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
    
    initialize : function() {
      this.model.viewLater = this;
    },
    
    render : function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;      
    }
  });
  
  ReadLaterMenu = Backbone.View.extend({
    el      : $('#read-later-menu'),
    events  : {
      'click #go-next'      : 'next',
      'click #go-previous'  : 'previous'
    },
    
    initialize : function() {
      _.bindAll(this, 'updateCurrent');
      Lectio.ReadLater.bind('open', this.updateCurrent);
    },
    
    next : function() {
      Lectio.ReadLater.next();
    },
    
    previous : function() {
      Lectio.ReadLater.previous();
    },
    
    updateCurrent : function(item) {
      this.el.find('h1')
        .html(item.get('title'));
    }
  });
  
  ReadLater = Backbone.View.extend({
    el : $('#read-later'),
    
    initialize : function() {
      _.bindAll(this, 'add', 'addBunch', 'open', 'next', 'previous');
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
    },
    
    open : function(item) {
      this.currentItem = item;
      var article = $(item.viewLater.el);
      article
        .addClass('current').removeClass('previous next')
        .siblings('article').removeClass('previous next').end()
        .prev('article').addClass('previous').end()
        .next('article').addClass('next');
      this.el.find('article').not(article).removeClass('current');
      this.trigger('open', item);
    },
    
    next : function() {
      var nextIndex = Lectio.ReadLaterCollection.indexOf(this.currentItem);
      if (nextIndex == -1 || nextIndex >= Lectio.ReadLaterCollection.length - 1) {
        return false;
      } else {
        return this.open(Lectio.ReadLaterCollection.at(nextIndex + 1));
      }   
    },
    
    previous : function() {
      var prevIndex = Lectio.ReadLaterCollection.indexOf(this.currentItem);
      if (prevIndex <= 0) {
        return false;
      } else {
        return this.open(Lectio.ReadLaterCollection.at(prevIndex - 1));
      }      
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