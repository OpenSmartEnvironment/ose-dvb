'use strict';

// Public
exports.printMediaHistory = function(li, entry) {
  li.append('div').add([
    '<h3>DVB:</h3>',
    li.new('p').text(this.getCaption({dval: entry.dval.media})),
  ]);

  return li;
};
