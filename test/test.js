var Pouch = require('pouchdb');
var Events = require('../');
Pouch.plugin('events',Events);
var should = require('chai').should();

describe('events',function(){
  var root = '';
  var i = 0;
  var db;
  beforeEach(function(done){
    i++;
    Pouch(root + 'dbtest' + i,function(err,d){
      if(err){
        console.log(err);
        return done(err);
      }
      db = d;
      done();
    });
  });
  afterEach(function(done){
    db = undefined;
    Pouch.destroy(root + 'dbtest' + i,function(){
      done();
    });
  });
  it('change works',function(done){
    db.on('change',function(){
      done();
    });
    db.put({
      '_id':'hello'
    });
  });
  it('create works',function(done){
    db.on('create',function(){
      done();
    });
    db.put({
      '_id':'hello'
    });
  });
  it('update works',function(done){
    db.on('update',function(){
      done();
    });
    db.put({
      '_id':'hello'
    },function(err,resp){
      if(err){
        done(err);
      }
      db.get('hello',function(err,doc){
        if(err){
          done(err);
        }
        doc.blah='abc';
        db.put(doc);
      })
    });
  });
  it('delete works',function(done){
    db.on('delete',function(){
      done();
    });
    db.put({
      '_id':'hello'
    },function(err,resp){
      if(err){
        done(err);
      }
      db.get('hello',function(err,doc){
        if(err){
          done(err);
        }
        db.remove(doc);
      })
    });
  });
  it("destroy work",function(done){
      db.on('destroy',function(db){
        done();
      });
      setTimeout(function(){
        Pouch.destroy(root + 'dbtest' + i);
      },500);
  });
});