'use strict';

// Public
exports.printMediaHistory = function(li, entry) {
  li
    .append($('<p>').text('DVB: '))
    .append($('<p>').text(this.getCaption({data: entry.data.media})))
  ;
};
