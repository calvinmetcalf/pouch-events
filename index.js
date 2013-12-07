
"use strict";
var events = require('events');
var util = require('util');
var DBs = {};
function PouchEvents(db) {
  if(!(this instanceof PouchEvents)){
    return new PouchEvents(db);
  }
  var self = this;
  db.info(function(err, info) {
    if(err){
      self.emit('error',err);
      return;
    }
    DBs[info.db_name] = self;
    db.changes({
        conflicts: true,
        include_docs: true,
        continuous:true,
        since:info.update_seq,
        onChange: function (change) {
          self.emit('change',change);
          if('deleted' in change){
            self.emit('delete',change.doc);
          } else if(change.doc._rev.split('_')[0]==='1'){
            self.emit('create',change.doc);
          } else {
            self.emit('update',change.doc);
          }
      });
  });
};
PouchEvents._destroy = function(name){
  if(name in DBs){
    DBs[name].emit('destroy');
    DBs[name].removeAllListeners();
    delete DBs[name];
  }
}
util.inherits(PouchEvents, events.EventEmitter);

module.exports = PouchEvents;
