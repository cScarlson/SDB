SDB
===

###### Simple DataBase is a simpler IndexedDB Module ######

This module is a vanilla-JavaScript library for manipulating the HTML5 IndexedDB API. Its main goals are simplicity and intuitiveness.

## Quick Start ##


## Overview ##
Hook the API:

	var idb = sdb, PeopleDB = idb.req(PeopleDBschema, function(db){
		// ALL transactions for "PeopleDB" go here!
	});

To create or open an IndexedDB database, you need to have a schema in place. In IndexedDB, you need to have a database name and a version to open/create one. (In IndexedDB, you use the same method to create a new AND open an existing database). Requesting a database will open an existing database or create a new one if it doesn't already exist.

To request a database, use the 'req' method on the API. The 'req' method take 2 arguments: a database schema, and a callback closure for making transactions.

###### The Schema: ######
The schema is an object-literal. It must consist of a db' property (which is a string containing the database's name), and a version (for database verioning).

###### The Callback: ######
The callback function will receive the database that was requested as an argument. You'll need this for all of your transactions.

	var idb = sdb, PeopleDB = idb.req(PeopleDBschema, function(db){
		var db = db;
	});















