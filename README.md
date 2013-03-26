SDB
===

###### Simple DataBase is a simpler IndexedDB Module ######

This module is a vanilla-JavaScript library for manipulating the HTML5 IndexedDB API. Its main goals are simplicity and intuitiveness.

#### NOTE: ####
For ease of testing, its recommended that you use an IndexedDB-database-wiper such as "History Eraser" @ https://chrome.google.com/webstore/search-apps/history%20eraser?utm_campaign=en&utm_source=ha-en-na-us-webapp-collections-editors_picks&utm_medium=ha

...Or a better one(?)

## Quick Start ##

Point to SDB:
	
	<script src="path/to/SDB.js"></script>

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
				}
			]
		} 
	};

	var PeopleDBHook = sdb.req(PeopleDBschema, function(PeopleDB){  // create database from schema
		PeopleDBHook.tr(PeopleDB, ['humans', 'aliens'], 'readwrite')
			.store('humans')
			.put({id: 1, name: 'versions', email: 'unique@email.com', versions: [
					{versionName: 'myOtherVersionName1', pubKey: 'myOtherPubKey1'}
				] // we added "id" some that if db is created&pagerefreshed, it still "puts"
			})
			.get('unique@email.com', function(item){
				console.log('humans GOT ITEM', item);	
			})
			.store('aliens')
			.put({id: 1, name: 'versions', email: 'unique@email.com', versions: [
					{versionName: 'myOtherVersionName1', pubKey: 'myOtherPubKey1'}
				]
			})
			.get('unique@email.com', function(item){
				console.log('aliens GOT ITEM', item);	
			});
			.cursor(function(data){
				console.log('aliens data', data);
			});
	
		PeopleDBHook.tr(PeopleDB, ['humans', 'aliens'], 'readwrite')
			.store('aliens')
			.put({id: 1, name: 'versions', email: 'unique@email.com', versions: [
					{versionName: 'myOtherVersionName1', pubKey: 'myOtherPubKey1'},
					{versionName: 'myOtherVersionName2', pubKey: 'myOtherPubKey2'},
					{versionName: 'myOtherVersionName3', pubKey: 'myOtherPubKey3'},
					{versionName: 'myOtherVersionName4', pubKey: 'myOtherPubKey4'}
				]
			});
	});

	var PeopleDBHook = sdb.req('PeopleDB', function(PeopleDB){  // reopen database
		PeopleDBHook.tr(PeopleDB, ['humans', 'aliens'], 'readwrite')
			.store('aliens')
			.put({id: 1, name: 'versions1', email: 'unique@email.com', versions: [
					{versionName: 'myOtherVersionName1', pubKey: 'myOtherPubKey1'},
					{versionName: 'myOtherVersionName2', pubKey: 'myOtherPubKey2'},
					{versionName: 'myOtherVersionName3', pubKey: 'myOtherPubKey3'},
					{versionName: 'myOtherVersionName4', pubKey: 'myOtherPubKey4'},
					{versionName: 'myOtherVersionName5', pubKey: 'myOtherPubKey5'},
					{versionName: 'myOtherVersionName6', pubKey: 'myOtherPubKey6'}
				]
			})
			.put({id: 2, name: 'versions2', email: 'unique2@email.com', versions: [
					{versionName: 'myOtherVersionName1', pubKey: 'myOtherPubKey1'},
					{versionName: 'myOtherVersionName2', pubKey: 'myOtherPubKey2'},
					{versionName: 'myOtherVersionName3', pubKey: 'myOtherPubKey3'},
					{versionName: 'myOtherVersionName4', pubKey: 'myOtherPubKey4'},
					{versionName: 'myOtherVersionName5', pubKey: 'myOtherPubKey5'},
					{versionName: 'myOtherVersionName6', pubKey: 'myOtherPubKey6'}
				]
			})
			.put({id: 3, name: 'versions3', email: 'unique3@email.com', versions: [
					{versionName: 'myOtherVersionName1', pubKey: 'myOtherPubKey1'},
					{versionName: 'myOtherVersionName2', pubKey: 'myOtherPubKey2'},
					{versionName: 'myOtherVersionName3', pubKey: 'myOtherPubKey3'},
					{versionName: 'myOtherVersionName4', pubKey: 'myOtherPubKey4'},
					{versionName: 'myOtherVersionName5', pubKey: 'myOtherPubKey5'},
					{versionName: 'myOtherVersionName6', pubKey: 'myOtherPubKey6'}
				]
			})
			.put({id: 4, name: 'versions4', email: 'unique4@email.com', versions: [
					{versionName: 'myOtherVersionName1', pubKey: 'myOtherPubKey1'},
					{versionName: 'myOtherVersionName2', pubKey: 'myOtherPubKey2'},
					{versionName: 'myOtherVersionName3', pubKey: 'myOtherPubKey3'},
					{versionName: 'myOtherVersionName4', pubKey: 'myOtherPubKey4'},
					{versionName: 'myOtherVersionName5', pubKey: 'myOtherPubKey5'},
					{versionName: 'myOtherVersionName6', pubKey: 'myOtherPubKey6'}
				]
			})
			.cursor(function(data){  // just a callback
				console.log('@OpenCursor _');
				console.log('@OpenCursor:', data);
			})
			.cursor(function(data){  // callback and an index id
				console.log('@OpenCursor 2');
				console.log('@OpenCursor:', data);
			}, 2)
			.cursor(function(data){  // callback and range with direction
				console.log("@OpenCursor {bound: [1, 8], direction: 'prev'}");
				console.log('@OpenCursor:', data);
			}, {bound: [1, 8], direction: 'prev'})
			.cursor(function(data){  // range with range points excluded
				console.log("@OpenCursor {bound: [1, 3, true, true]}");
				console.log('@OpenCursor:', data);
			}, {bound: [1, 4, true, true]});  // {bound: [1, 8], direction: 'next'} 2
	});
	

## Overview ##
### Create A New Database: ###

	var PeopleDBHook = sdb.req(PeopleDBschema, function(PeopleDB){  // create database from schema
		// ALL [INITIAL] transactions for "PeopleDB" go here!
	});

To create or open an IndexedDB database, you need to have a schema in place. In IndexedDB, you need to have a database name and a version to open/create one. (In IndexedDB, you use the same method to create a new AND open an existing database). Requesting a database will open an existing database or create a new one if it doesn't already exist.

To request a database, use the 'req' method on the API. The 'req' method takes 2 arguments: a database schema, and a callback closure for making transactions.

#### The Schema: ####
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
					name: 'aliens',
					opts: {keyPath: 'id', autoIncrement: true},
					indices: [
						{index: 'name', opts: {unique: false}},
						{index: 'email', opts: {unique: true}}
					]
				}
			]
		} 
	};
	
##### Versioning #####
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

#### The Callback: ####
The callback function will receive the database that was requested as an argument. You'll need this for all of your transactions.

	var PeopleDBHook = sdb.req(PeopleDBschema, function(PeopleDB){  // create database from schema
		var PeopleDB = PeopleDB;
	});

After you have the database-object (passed as the closure's argument), you can begin making transactions using the 'tr()' method (INSIDE OF THE CALLBACK CLOSURE):

Open a transaction:

	PeopleDBHook
		.tr(PeopleDB, ['humans'], 'readwrite');

Get an objectStore:

	PeopleDBHook
		.tr(PeopleDB, ['humans'], 'readwrite')
		.store('humans');

Make a transaction:

	PeopleDBHook
		.tr(PeopleDB, ['humans'], 'readwrite')
		.store('humans')
		.put({name: 'someName', email: 'uniqueName@mail.com'}, function(item){
			console.log('PUT ITEM', item);
		});

Chaining transactions on multiple stores:

	PeopleDBHook
		.tr(PeopleDB, ['humans', 'aliens'], 'readwrite')
		.store('humans')
			.get(/* get args */)
		.store('aliens')
			.get(/* get args */);

(Given that each transaction is encapsulated in its own closure, perhaps a more semantic way of doing this could be):

	var PeopleDB = sdb.req(PeopleDBschema, function(db){  // create database from schema
		PeopleDB
			.tr(db, ['humans'], 'readwrite')
			.store('humans')
			.put({name: 'someName', email: 'uniqueName@mail.com'}, function(item){
				console.log('PUT ITEM', item);
			});
	});

### Reopening The Database: ###
	var PeopleDBHook = sdb.req('PeopleDB', function(PeopleDB){  // reopen database
		PeopleDBHook.tr(PeopleDB, ['humans', 'aliens'], 'readwrite')
			.store('aliens')
			.put({id: 1, name: 'versions1', email: 'unique@email.com', versions: [
					{versionName: 'myOtherVersionName1', pubKey: 'myOtherPubKey1'},
					{versionName: 'myOtherVersionName2', pubKey: 'myOtherPubKey2'},
					{versionName: 'myOtherVersionName3', pubKey: 'myOtherPubKey3'},
					{versionName: 'myOtherVersionName4', pubKey: 'myOtherPubKey4'},
					{versionName: 'myOtherVersionName5', pubKey: 'myOtherPubKey5'},
					{versionName: 'myOtherVersionName6', pubKey: 'myOtherPubKey6'}
				]
			});
	});

This is the basic process for CRUDing the an IndexedDB.

See METHODS section for methods and their implementations.

## METHODS ##

### req(): ###
1. opens a new or existing database
1. takes a schema-object or a database-name-string as first argument
1. takes a callback-closure as second argument

#### req.callback() ####
receives the requested database-object as an argument.

### tr(): ###
takes three(3) arguments:

1. the database in action (passed into the req.callback closure)
1. a string of one, or an array of multiple objectStores on which to make transactions
1. the transaction type (read, write, etc)

### store(): ###
the store on which the current transactions will be. This can be any from the second argument of the tr() method.

### add(): ###
once an objectStore is chosen using the .store() method, .add() can be used to insert NEW data into the database.
This method takes two(2) arguments: the data to be added, and a callback. The callback accepts an argument for which item was added.

### put(): ###
similar to the add method, this takes data to insert into the database. However, this method is also used to update data.
- To add NEW data, use it analogously to .add().
- To UPDATE data, you MUST include ALL object-properties, ie include "id" etc. The entire object schema must be included and all unique properties must be unique.

### del(): ###
NOT YET IMPLEMENTED!!!

### get(): ###
takes two(2) arguments. An item, and a callback which accepts the item as an arguments.

### cursor(): ###
takes ONE to TWO (1-2) arguments.
When using just a callback, the cursor will retrieve ALL items in the store.

	.cursor(function(item){console.log(item)});
	
When using a callback and a Number, the cursor will retrieve the item in the store that matches the id (if autoinc' is set).

	.cursor(function(item){console.log(item)}, 2);
	
When using a callback and a range, the cursor will retrieve ALL items in the store which match the range.

	.cursor(function(item){console.log(item)}, {bound: [n, n], direction: 'prev'});
'bound' takes two numbers, while direction takes a string that is either 'prev', or 'next'.

When using a callback and a range with exclusions, the cursor will retrieve ALL items in the store according to criteria.

	.cursor(function(item){console.log(item)}, {bound: [n1, n2, true, false]});
	Finds items in range, BUT excludes "n1" and NOT "n2".
	

### count(): ###
NOT YET IMPLEMENTED!!!

### clear(): ###
NOT YET IMPLEMENTED!!!

### index(): ###
DETAIL COMMING SOON! :)

#### index.get(): ####
DETAIL COMMING SOON! :)

#### index.openCursor(): ####
DETAIL COMMING SOON! :)

#### index.openKeyCursor(): ####
DETAIL COMMING SOON! :)

### deleteIndex(): ###
NOT YET IMPLEMENTED!!!













