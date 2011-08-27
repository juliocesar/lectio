(function(){
  // let's make our scrollbar sexy
  var scrollbars = {
    stream: $("#stream"),
    activate: function () {
      scrollbars.stream.removeClass("inactive");
    },
    deactivate: function () {
      scrollbars.stream.addClass("inactive");
    },
    trigger: function () {
      var timer;
      scrollbars.stream.scroll(function (){
        scrollbars.activate();
        window.clearTimeout(timer);
        timer = window.setTimeout(scrollbars.deactivate, 500);
      });
    }
  };
  $(scrollbars.trigger);
})();
