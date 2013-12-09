
"use strict";
var events = require('events');
var util = require('util');
var DBs = {};
function PouchEvents(db) {
  if(!(this instanceof PouchEvents)){
    return new PouchEvents(db);
  }
  db.info(function(err, info) {
    if(err){
      db.emit('error',err);
      return;
    }
    DBs[info.db_name] = db;
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
  });

}
util.inherits(PouchEvents, events.EventEmitter);
PouchEvents._delete = function(name){
  if(name in DBs){
    DBs[name].emit('destroy',true);
    DBs[name].removeAllListeners();
    delete DBs[name];
  }
}


module.exports = PouchEvents;
