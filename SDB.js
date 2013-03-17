





window.sdb = (window.sdb || (function(){
	
	function SDB(schema, successCallback){
		this.req, this.db, this.transaction;
		
		this.req = indexedDB.open(schema.db, schema.v);
		this.req.onsuccess = function(e){
			this.db = e.target.result;
			successCallback(this.db);
		};
		
		this.req.onerror = function(e){
			console.log("IndexedDB error: " + e.target.errorCode);
		};
		
		this.req.onupgradeneeded = function(e){
			var stores = schema.upgrade.stores, objectStore;
			for(var store in stores){
				objectStore = e.currentTarget.result.createObjectStore(
					stores[store].name, stores[store].opts
				);
				createIndices(stores[store].indices);
				
				// TEST objectStore given that name and email are part of the schema.
				/*
				var peopleData = [
					{name: 'John Dow', email: 'john@company.com'},
					{name: 'Don Dow', email: 'don@company.com'},
					{name: 'versions', email: 'unique@email.com', versions: [
							{versionName: 'myVersionName1', pubKey: 'myPubKey1'},
							{versionName: 'myVersionName2', pubKey: 'myPubKey2'},
							{versionName: 'myVersionName3', pubKey: 'myPubKey3'}
						]
					}
				];
				for(i in peopleData){objectStore.add(peopleData[i]);} //END TEST
				*/
				
			}
			
			function createIndices(inds){
				for(var ind in inds){
					objectStore.createIndex(
						inds[ind].index, inds[ind].index, inds[ind].opts
					);
				}
			};
		};
		
		/**
		 * @return this[methodName] to api with alias
		 */
		return {
			req: this.req,
			tr: this.trans,
			store: this.store,
			add: this.add,
			put: this.put,
			del: this.del,
			get: this.get,
			cursor: this.cursor,
			count: this.count,
			clear: this.clear,
			index: this.index,
			deleteIndex: this.deleteIndex
		};
	};
	
	SDB.prototype = (function(){
		var transaction, objectStore;
		function createTransaction(db, store, transactionType){
			console.log('hit trans', db, store, IDBTransaction[transactionType]);
			transaction = db.transaction(store, IDBTransaction[transactionType]);
			console.log('transaction', transaction);
			return this;
		};
		
		function objectStore(store){
			
			/*
			(transaction) && ((function(){
				(
					(transaction.constructor === String)
					&&
					(objectStore = transaction.objectStore(store))
				)
				||
				(
					(transaction.constructor === Array)
					&&
					((function(){
						objectStore = [];
						for(var i in transaction){
							objectStore[i] = transaction[i].objectStore(store)
						}
					})())
				);
			})());
			*/
			
			(transaction) && (objectStore = transaction.objectStore(store));
			return this;
		};
		
		function ADD(obj){
			console.log('hit ADD function, obj', (obj && obj) || 'NO obj');
			obj && objectStore.add(obj);
			return this;
		};
		
		function PUT(obj, callback){
			
			/*
			var item, req;
			if(objectStore.constructor === String){
				req = ((obj && objectStore.put(obj))
					.onsuccess = function(e){
						item = e.target.result;
						callback && callback(item);
						return req;
					}).onerror = function(e){
						console.log('PUT ERROR!', e);
						return req;
					};
			}else if(objectStore.constructor === Array){
				for(var i in objectStore){
					req = ((obj && objectStore[i].put(obj))
						.onsuccess = function(e){
							item = e.target.result;
							callback && callback(item);
							return req;
						}).onerror = function(e){
							console.log('PUT ERROR!', e);
							return req;
						};
				}
			}
			*/
			
			var item, req = ((obj && objectStore.put(obj))
				.onsuccess = function(e){
					item = e.target.result;
					callback && callback(item);
					return req;
				}).onerror = function(e){
					console.log('PUT ERROR!', e);
					return req;
				};
			return this;
		};
		
		function GET(keyPath, callback){
			var item, req = ((keyPath && objectStore.get(keyPath))
				.onsuccess = function(e){
					item = e.target.result;
					callback && callback(item);
					return req;
				}).onerror = function(e){
					console.log('GET ERROR!', e);
					return req;
				};
			return this;
		};
		
		function DELETE(keyPath){
			console.log('hit DELETE function, keyPath', (keyPath && keyPath) || 'NO keyPath');
			keyPath && objectStore.delete(keyPath);
			return this;
		};
		
		function openCursor(callback){
			var cursor, items = [], req = objectStore.openCursor();
			req.onsuccess = function(e){
				cursor = e.target.result;
				(cursor) && ((function(){
					items.push(cursor.value);
					callback(cursor.value);
					cursor.continue();
				})());
			};
			return this;
		};
		
		function count(){
			console.log('hit count function');
			return this;
		};
		
		function CLEAR(){
			console.log('hit CLEAR function');
			return this;
		};
		
		function index(name){
			console.log('hit index function');
			var storeIndex, cursor;
			(objectStore && name) && (
				(storeIndex = objectStore.index(name))
			);
			
			function indexGET(key, callback){
				storeIndex.get(key).onsuccess = function(e){
					var result = e.target.result;
					callback(result);
				};
				return this;
			};
			
			function openCursor(callback){
				var cursor, items = [], req = storeIndex.openCursor();
				req.onsuccess = function(e){
					cursor = e.target.result;
					(cursor) && ((function(){
						items.push(cursor.value);
						callback(cursor.value);
						cursor.continue();
					})());
				};
				return this;
			};
			
			function openKeyCursor(callback){
				var cursor, items = [], req = storeIndex.openCursor();
				req.onsuccess = function(e){
					cursor = e.target.result;
					(cursor) && ((function(){
						items.push(cursor.value);
						callback(cursor.value);
						cursor.continue();
					})());
				};
				return this;
			};
			
			return {
				get: indexGET,
				openCursor: openCursor,
				openKeyCursor: openKeyCursor
			};
		};
		
		function deleteIndex(){
			console.log('hit deleteIndex function');
			return this;
		};
		
		/**
		 * @return methods to 'this'
		 */
		return {
			trans: createTransaction,
			store: objectStore,
			add: ADD,
			put: PUT,
			del: DELETE,
			get: GET,
			cursor: openCursor,
			count: count,
			clear: CLEAR,
			index: index,
			deleteIndex: deleteIndex
		};
	}());
	
	return {
		req: function(schema, callback){
			return new SDB(schema, callback);
		}
	};
	
}()));

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











