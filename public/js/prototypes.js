(function(undefined) {
  String.prototype.ellipsisAfter = function(count) {
    var summary = this.split(/\s+/), out = [];
    if (summary.length <= 1) return this;
    for (var i = 0; i < count; i++) out.push(summary[i]);
    return out.join(' ') + '...';    
  };
})();