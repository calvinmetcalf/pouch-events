
"use strict";
var events = require('events');
var util = require('util');
function PouchEvents(db) {
  if(!(this instanceof PouchEvents)){
    return new PouchEvents(db);
  }
  db.info(function(err, info) {
    if(err){
      db.emit('error',err);
      return;
    }
    db.changes({
        conflicts: true,
        include_docs: true,
        continuous:true,
        since:info.update_seq,
        onChange: function (change) {
          db.emit('change',change);
          if(change.doc._deleted){
            db.emit('delete',change.doc);
          } else if(change.doc._rev.split('-')[0]==='1'){
            db.emit('create',change.doc);
          } else {
            db.emit('update',change.doc);
          }
        }
    });
    PouchEvents._delete = function(name){
      db.emit('destroy',{name:name});
      db.removeAllListeners();
    }
  });
}
util.inherits(PouchEvents, events.EventEmitter);



module.exports = PouchEvents;
