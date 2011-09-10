(function($, undefined) {
  
  // modal( { title: 'foo', message: 'bar' , negative: true });
  
  function modal(options) {
    var sheet = $('<div id="sheet"></div>'),
      panel = $('<div id="modal"></div>'),
      menu  = $('<menu></menu>'),
      yes   = $('<button role="yes"></button>'),
      no   = $('<button role="no"></button>');
      yes.html(
        '<svg version="1.0" x="0px" y="0px" width="40px" height="40px" fill="#fff" viewBox="0 0 95.445 100" enable-background="new 0 0 95.445 100">' +
        '<path d="M92.113,56.538c0.216-1.638,3.234-4.062,3.332-5.712c0.175-3-3.879-8.87-6.664-9.997  c-4.422-1.789-26.896-0.952-26.896-0.952c-2.197-3.84,3.914-13.323,5.594-17.416c2.466-5.999,2.05-13.959-1.07-18.048  c-3.81-4.996-10.805-5.329-10.949-3.093c-1.042,16.214-4.146,20.712-8.302,23.918c-2.496,1.926-4.679,3.611-5.83,6.547  c-7.083,18.038-12.798,21.744-15.533,22.373h-1.75l0,0h-0.517v40.938l21.463,3.809c0,0,26.065,2.466,34.273,0  c2.582-0.775,7.039-4.653,8.092-7.141c0.602-1.428-0.233-4.809,0.478-6.188c1.049-2.043,5.478-4.602,5.474-7.378  c-0.004-1.979-2.31-5.405-2.142-7.379c0.167-1.976,4.288-4.685,4.284-6.664C95.441,62.077,91.84,58.598,92.113,56.538z"/>' +
        '<path d="M20.188,93.483c0,2.353-2.005,4.262-4.477,4.262H4.475c-2.473,0-4.479-1.909-4.479-4.262V56.17  c0-2.354,2.005-4.267,4.479-4.267h11.237c2.471,0,4.477,1.912,4.477,4.267L20.188,93.483L20.188,93.483L20.188,93.483z"/>' +
        '</svg>');
      no.html(
        '<svg version="1.0" x="0px" y="0px" width="40px" height="40px" fill="#fff" viewBox="0 0 95.45 100" enable-background="new 0 0 95.45 100">' +
        '<path d="M3.337,43.461c-0.215,1.638-3.236,4.061-3.332,5.712c-0.174,3,3.879,8.87,6.664,9.997  c4.422,1.788,26.895,0.951,26.895,0.951c2.197,3.838-3.914,13.323-5.594,17.414c-2.464,6.001-2.048,13.959,1.072,18.05  c3.81,4.996,10.805,5.329,10.948,3.094c1.042-16.214,4.146-20.712,8.304-23.92c2.495-1.924,4.679-3.609,5.831-6.545  c7.081-18.039,12.797-21.745,15.532-22.373h1.75h0.002h0.517V4.904L50.463,1.096c0,0-26.067-2.465-34.273,0  c-2.584,0.777-7.042,4.654-8.092,7.14c-0.604,1.428,0.232,4.809-0.476,6.188c-1.05,2.043-5.48,4.6-5.474,7.378  c0.003,1.98,2.309,5.405,2.142,7.378c-0.167,1.975-4.288,4.684-4.284,6.665C0.009,37.924,3.607,41.401,3.337,43.461z"/>' +
        '<path d="M75.259,6.518c0-2.354,2.005-4.264,4.478-4.264h11.236c2.474,0,4.478,1.91,4.478,4.264V43.83  c0,2.356-2.004,4.266-4.478,4.266H79.736c-2.473,0-4.478-1.91-4.478-4.266V6.518z"/>' +
        '</svg>');
    if (options.negative) {
      menu.append(yes, no);
      panel.append(menu);
    } else {
      yes.find('svg').attr({height: '150px', width: '150px'});
      panel.append(yes).addClass('single');
      panel.click(function() { 
        sheet.fadeOut(150, function() {
          sheet.remove();
          if (_.isFunction(options.success)) options.success();
        }); 
      });
    }
    if (options.title) panel.append('<h1>' + options.title + '</h1>');
    panel.append('<p>' + options.message + '</p>');
    sheet.append(panel).appendTo('body');
    sheet.fadeIn(250);
  }
  
  Lectio.modal = modal;
})(jQuery);