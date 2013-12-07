var Pouch = require('pouchdb');
var Events = require('../');
Pouch.plugin('events',Events);
var should = require('chai').should();

