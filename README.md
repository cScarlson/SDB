SDB
===

###### Simple DataBase is a simpler IndexedDB Module ######

This module is a vanilla-JavaScript library for manipulating the HTML5 IndexedDB API. Its main goals are simplicity and intuitiveness.

## Quick Start ##

Point to SDB:
	
	<script src="javascripts/SDB.js"></script>

The javascript:

	var PeopleDBschema = {
		db: 'PeopleDB',
		v: 1,
		upgrade: {
			stores: [
				{
					name: 'humans',
					opts: {keyPath: 'id', autoIncrement: true},
					indices: [
						{index: 'name', opts: {unique: false}},
						{index: 'email', opts: {unique: true}}
					]
				},
				{
					name: 'aliens',
					opts: {keyPath: 'id', autoIncrement: true},
					indices: [
						{index: 'name', opts: {unique: false}},
						{index: 'email', opts: {unique: true}}
					]
				}/*,
				{  // add for version 2 (take out stores from v1)
					name: 'animals',
					opts: {keyPath: 'id', autoIncrement: true},
					indices: [
						{index: 'animalName', opts: {unique: false}},
						{index: 'animalEmail', opts: {unique: true}}
					]
				}*/
			]
		} 
	};

	var idb = sdb, PeopleDB = idb.req(PeopleDBschema, function(db){

		/**/
		console.log('success!', db, '\n\n');
		PeopleDB
			.tr(db, ['humans'], 'READ_WRITE')
			.store('humans')
			.add()
			.put({name: 'cody', email: 'otocarlson@gmail.com'}, function(item){
				console.log('PUT ITEM', item);
				})
			.del()
			.get('1', function(item){
				console.log('GOT ITEM', item);	
				});
			
		PeopleDB
			.tr(db, ['aliens'], 'READ_WRITE')
			.store('aliens')
			.add()
			.put({name: 'codius', email: 'codius@gmail.com'}, function(item){
				console.log('PUT ITEM', item);
				})
			.del()
			.get('1', function(item){
				console.log('GOT ITEM', item);	
				});
			
		// store.openCursor()
		PeopleDB.tr(db, ['humans'], 'READ_WRITE')
			.store('humans')
			.cursor(function(value){
				console.log('openCursor callback:: cursor value:', value);
				});
			
		// store.openCursor()
		PeopleDB.tr(db, ['aliens'], 'READ_WRITE')
			.store('aliens')
			.cursor(function(value){
				console.log('openCursor callback:: cursor value:', value);
				});
			
		// index.get()
		PeopleDB.tr(db, ['humans'], 'READ_WRITE')
			.store('humans')
			.index('name')
				.get('cody', function(result){
				console.log('index.get(), humans: result:', result);
				})
				.openCursor(function(result){
				console.log('index.openCursor(), humans: result:', result);
				})
				.openKeyCursor(function(result){
				console.log('index.openKeyCursor(), humans: result:', result);
				});
			
		// index.get()
		PeopleDB.tr(db, ['aliens'], 'READ_WRITE')
			.store('aliens')
			.index('name')
				.get('codius', function(result){
				console.log('index.get(), aliens: result:', result);
				})
				.openCursor(function(result){
				console.log('index.openCursor(), aliens: result:', result);
				})
				.openKeyCursor(function(result){
				console.log('index.openKeyCursor(), aliens: result:', result);
				});
			
		PeopleDB
			.tr(db, ['humans', 'aliens'], 'READ_WRITE')
			.store('humans')
			.put({name: 'versions', email: 'unique2@email.com', versions: [
					{versionName: 'myOtherVersionName1', pubKey: 'myOtherPubKey1'},
					{versionName: 'myOtherVersionName2', pubKey: 'myOtherPubKey2'},
					{versionName: 'myOtherVersionName3', pubKey: 'myOtherPubKey3'}
				]
			})
			.tr(db, ['humans', 'aliens'], 'READ_WRITE')
			.store('aliens')
			.put({name: 'versions', email: 'unique2@email.com', versions: [
					{versionName: 'myOtherVersionName1', pubKey: 'myOtherPubKey1'},
					{versionName: 'myOtherVersionName2', pubKey: 'myOtherPubKey2'},
					{versionName: 'myOtherVersionName3', pubKey: 'myOtherPubKey3'}
				]
			});
	
		/**/
	
	});

	console.log('idb', PeopleDB, '\n\n');

## Overview ##
Hook the API:

	var idb = sdb, PeopleDB = idb.req(PeopleDBschema, function(db){
		// ALL transactions for "PeopleDB" go here!
	});

To create or open an IndexedDB database, you need to have a schema in place. In IndexedDB, you need to have a database name and a version to open/create one. (In IndexedDB, you use the same method to create a new AND open an existing database). Requesting a database will open an existing database or create a new one if it doesn't already exist.

To request a database, use the 'req' method on the API. The 'req' method takes 2 arguments: a database schema, and a callback closure for making transactions.

##### The Schema: #####
The schema is an object-literal. It must consist of a 'db' property (which is a string containing the database's name), and a version (for database verioning). On top of a db name and version, you'll need to set up your "ObjectStores" and Indices. You can add multiple ObjectStores and Indices using arrays. The following elucidates what properties are necessary.

	var PeopleDBschema = {
		db: 'PeopleDB',
		v: 1,
		upgrade: {
			stores: [
				{
					name: 'humans',
					opts: {keyPath: 'id', autoIncrement: true},
					indices: [
						{index: 'name', opts: {unique: false}},
						{index: 'email', opts: {unique: true}}
					]
				},
				{
					name: 'aliens', // aliens are people too!
					opts: {keyPath: 'id', autoIncrement: true},
					indices: [
						{index: 'name', opts: {unique: false}},
						{index: 'email', opts: {unique: true}}
					]
				}
			]
		} 
	};
	
###### Versioning ######
To change your DB-Schema based upon version, use the 'v'-property of the schema-object-literal and make sure to remove any stores (schema.upgrade.stores[i]) from the previous versio(s); then add a new store with the appropriate options and indices:

	var PeopleDBschema = {
		db: 'PeopleDB',
		v: 2,
		upgrade: {
			stores: [
				{
					name: 'cats',  // I'm a cat-lover
					opts: {keyPath: 'id', autoIncrement: true},
					indices: [
						{index: 'name', opts: {unique: false}},
						{index: 'email', opts: {unique: true}}
					]
				},
				{
					name: 'dogs',  // I'm a dog-lover
					opts: {keyPath: 'id', autoIncrement: true},
					indices: [
						{index: 'name', opts: {unique: false}},
						{index: 'email', opts: {unique: true}}
					]
				}
			]
		} 
	};

After creating a new schema-object for this new version, it is recommended that you store previous version-schemas in a README file with a Code-Comment-Note in you code that references the README. (DB-VERSIONING GETS MESSY!!!).

##### The Callback: #####
The callback function will receive the database that was requested as an argument. You'll need this for all of your transactions.

	var idb = sdb, PeopleDB = idb.req(PeopleDBschema, function(db){
		var db = db;
	});

After you have the database-object ('db'), you can begin making transactions using the 'tr()' method (INSIDE OF THE CALLBACK CLOSURE):

Open a transaction:

	PeopleDB
		.tr(db, ['humans'], 'READ_WRITE');

Get an objectStore:

	PeopleDB
		.tr(db, ['humans'], 'READ_WRITE')
		.store('humans');

Make a transaction:

	PeopleDB
		.tr(db, ['humans'], 'READ_WRITE')
		.store('humans')
		.put({name: 'someName', email: 'uniqueName@mail.com'}, function(item){
			console.log('PUT ITEM', item);
			});

This is the basic process for CRUDing the an IndexedDB.

See METHODS section for methods and their implementations.

## METHODS ##

### req(): ###
1. opens a new or existing database
1. takes a schema-object as first argument
1. takes a callback-closure as second argument

#### req.callback() ####
receives the requested database-object as an argument.













