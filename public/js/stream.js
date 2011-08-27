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
    
    read : function() {}
  });
  
  Stream = Backbone.View.extend({
    el : $('#stream'),
    
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
    }
  });
})(jQuery);