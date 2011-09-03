(function($, undefined) {
  var PreviewView = Backbone.View.extend({
    tagName   : 'article',
    template  : _.template($('#preview-template').html()),
    events    : {
      'click' : 'read'
    },

    initialize : function() {
      this.model.preview = this;
    },

    render : function() {
      var self = this;
      $(self.el)
        .html(self.template(self.model.toJSON()))
        .addClass(self.model.get('sourceClass'))
        .addClass('preview')
        .attr('id', 'preview-' + self.model.get('_id'))
        .find('button')
          .click(function(event) {
            event.stopPropagation();
            var item = Lectio.ReadLaterCollection.get(self.model.get('_id'));
            if (!item) {
              $('body > div.tipsy')
                .html('<div class="tipsy-arrow"></div><div class="tipsy-inner">Remove from reading list</div>');
                Lectio.ReadLaterCollection.create(self.model.attributes);              
            } else {
              $('body > div.tipsy')
                .html('<div class="tipsy-arrow"></div><div class="tipsy-inner">Read later</div>');              
              item.destroy();
            }
          });
      $(self.el).find('button').tipsy({ title: 'data-title', fade : true, gravity: 'w'});
      return this;
    },

    read : function() {
      Lectio.Router.navigate('/items/' + this.model.get('_id'), true);
    },

    readLater : function(event) {
      Lectio.ReadLaterCollection.add(this.model);
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
      _.bindAll(this, 'add', 'addBunch', 'read', 'fetch', 'highlight', 'highlightAll');
      Lectio.Items.bind('add',    this.add);
      Lectio.Items.bind('reset',  this.addBunch);
      Lectio.Items.bind('reset',  this.highlightAll);
      Lectio.Items.trigger('reset');
      this.fixScrollbars();
    },

    highlight : function(item) {
      var preview = this.el.find('#preview-' + item.get('_id'));
      preview
        .addClass('in-read-later')
        .find('button')
          .attr('data-title', 'Remove from reading list');
    },

    highlightAll : function() {
      var self = this;
      Lectio.ReadLaterCollection.each(function(item) {
        self.highlight(item);
      });
    },

    add : function(item) {
      var view = new PreviewView({ model : item }),
        el = $(view.render().el);
      el.addClass('adding');
      if (!this.el.scrollTop()) {
        this.el.prepend(el);
        this.el.scrollTop(0);
      } else {
        this.el.prepend(el);
      }
      el.removeClass('adding');
      return this;
    },

    addBunch : function() {
      Lectio.Items.each(this.add);
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
      var self = this, item = Lectio.Items.get(id);
      if (item && self.reading.attr('data-id') === item.get('_id')) return false;
      if (!item) return self.fetch(id, self.read);
      var article = new ArticleView({ model : item });
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
      $('title').text(item.get('title'));
    },

    fetch : function(id, callback) {
      var item = new Item;
      item.fetch({
        url : '/api/items/' + id,
        success : function(model, response) {
          item.initialize();
          Lectio.Items.add(item);
          if (_.isFunction(callback)) callback(item.get('_id'));
        }
      });
    }
  });

  var ReadLaterArticleView = Backbone.View.extend({
    tagName   : 'article',
    template  : _.template($('#read-later-template').html()),

    initialize : function() {
      this.model.viewLater = this;
    },

    render : function() {
      $(this.el)
        .html(this.template(this.model.toJSON()))
        .attr('data-id', this.model.get('_id'));
      return this;
    }
  });

  ReadLaterMenu = Backbone.View.extend({
    el      : $('#read-later-menu'),
    current : $('#current-article'),
    events  : {
      'click #go-next'      : 'next',
      'click #go-previous'  : 'previous',
      'click #remove'       : 'remove'
    },

    initialize : function() {
      _.bindAll(this, 'updateCurrent');
      Lectio.ReadLater.bind('open',   this.updateCurrent);
      Lectio.ReadLaterCollection.bind('remove', this.updateCurrent);
      this.el.find('#remove').tipsy({ title : 'data-title', fade : true, gravity : 's' });
      this.setupArrowsBindings();
    },

    setupArrowsBindings : function() {
      var self = this;
      $(window).keydown(function(event) {
        if (!$('body').hasClass('read-later')) return true;
        switch(event.keyCode) {
          case 37:
            self.previous();
            break;
          case 39:
            self.next();
            break;
        }
      });
    },

    next : function() {
      Lectio.ReadLater.next();
    },

    previous : function() {
      Lectio.ReadLater.previous();
    },
    
    remove : function() {
      var article = Lectio.ReadLater.el.find('.current'),
          id = article.attr('data-id'),
          item = Lectio.ReadLaterCollection.get(id),
          next = Lectio.ReadLaterCollection.indexOf(item) + 1;
      item.destroy();
      if (Lectio.ReadLaterCollection.length)
        Lectio.ReadLater.open(Lectio.ReadLaterCollection.at(next) || Lectio.ReadLaterCollection.last());
    },

    updateCurrent : function(item) {
      this.el.find('h1')
        .html(item.get('title'));
      this.current.text(
        (Lectio.ReadLaterCollection.indexOf(item) + 1) + ' / ' + Lectio.ReadLaterCollection.length
      );
    }
  });

  ReadLater = Backbone.View.extend({
    el : $('#read-later'),

    initialize : function() {
      _.bindAll(this, 'add', 'addBunch', 'open', 'next', 'previous', 'isEmpty');
      Lectio.ReadLaterCollection.bind('add',    this.add);
      Lectio.ReadLaterCollection.bind('add',    this.isEmpty);
      Lectio.ReadLaterCollection.bind('add',    this.highlightPreview);
      Lectio.ReadLaterCollection.bind('remove', this.remove);
      Lectio.ReadLaterCollection.bind('remove', this.isEmpty);
      Lectio.ReadLaterCollection.bind('remove', this.deHighlightPreview);
      Lectio.ReadLaterCollection.bind('reset',  this.addBunch);
      Lectio.ReadLaterCollection.bind('reset',  this.isEmpty);
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
    
    isEmpty : function() {
      if (Lectio.ReadLaterCollection.length) {
        this.el.find('#empty').hide();
        $('#read-later-menu').show();
      } else {
        this.el.find('#empty').show();
        $('#read-later-menu').hide();
      }
    },
        
    remove : function(item) {
      item.viewLater.remove();
    },

    highlightPreview : function(model) {
      var preview = Lectio.Stream.el.find('#preview-' + model.get('_id'));
      preview
        .addClass('in-read-later')
        .find('button')
          .attr('data-title', 'Remove from reading list');
    },
    
    deHighlightPreview : function(model) {
      var preview = Lectio.Stream.el.find('#preview-' + model.get('_id'));
      preview
        .removeClass('in-read-later')
        .find('button')
          .attr('data-title', 'Read later');
    },

    open : function(item) {
      this.currentItem = item;
      var article = $(item.viewLater.el);
      article
        .addClass('current').removeClass('previous next')
        .siblings('article').removeClass('previous next').end()
        .prev('article').addClass('previous').end()
        .next('article').addClass('next');
      this.el
        .scrollTop(0)
        .find('article').not(article).removeClass('current');
      $('title').text(item.get('title'));
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
    el      : $('#main-menu'),
    events  : {
      'click #go-read-later'  : 'readLater',
      'click #go-stream'      : 'home'
    },

    initialize : function() {
      this.el.find('#go-read-later').tipsy({ title : 'data-title', fade : true, gravity : 'n' });
      this.el.find('#go-stream').tipsy({ title : 'data-title', fade : true, gravity : 'n' });
      this.el.find('#go-add-feed').tipsy({ title : 'data-title', fade : true, gravity : 'n' });
    },

    readLater : function() {
      Lectio.Router.navigate('/read-later', true);
    },

    home : function() {
      Lectio.Router.navigate('/', true);
    }

  });
})(jQuery);