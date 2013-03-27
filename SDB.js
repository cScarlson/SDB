/**
 * Amy's number is: 3039029711
 */





window.sdb = (window.sdb || (function(){
	
	function SDB(schema, successCallback){
		this.req, this.db, this.transaction;
		
		this.req = indexedDB.open((schema.db || schema), (schema.v || !''));  // takes schema or DBnameString
		this.req.onsuccess = function(e){
			this.db = e.target.result;
			successCallback(this.db);
		};
	
		this.req.onerror = function(e){
			console.log("IndexedDB error: " + e.target.errorCode);
		};
			
		if(schema.constructor === Object){  // CLEAN THIS UP! - ITS REPEATATIVE!!!
			
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
		
		}
		
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
			// IDBTransaction[transactionType] is deprecated
			transaction = db.transaction(store, transactionType);
			return this;
		};
		
		function getObjectStore(store){
			(transaction) && (objectStore = transaction.objectStore(store));
			return this;
		};
		
		function ADD(obj, callback){
			
			var item, req = ((obj && objectStore.add(obj))
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
		
		function PUT(obj, callback){
			
			var item, req;
			req = ( (obj) && objectStore.put(obj) );
			req.onsuccess = function(e){
				console.log('PUT.onsuccess', e);
				item = e.target.result;
				callback && callback(item);
				return req;
			};
			req.onerror = function(e){
				console.log('PUT ERROR!', e);
				return req;
			};
			return this;
		};
		
		function GET(keyPath, callback){
			
			var item, req = ((keyPath && objectStore.get(keyPath))
				.onsuccess = function(e){
					item = e.target.source;
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
		
		function openCursor(callback, directives){
			var cursor, keyRange, direction, items = [], req;
			
			(!directives) && (function(){
				req = objectStore.openCursor();
			}())
			||
			(directives) && (function(){
				(directives.constructor === Object) && (function(){
					keyRange = (directives.bound && IDBKeyRange.bound(
							directives.bound[0], directives.bound[1],
							(directives.bound[2] && directives.bound[2]),
							(directives.bound[3] && directives.bound[3])
						));
				
					direction = ((directives.direction) && directives.direction);
					((direction) && (req = objectStore.openCursor(keyRange, direction)))
					||
					(req = objectStore.openCursor(keyRange));
					//req = objectStore.openCursor(IDBKeyRange.bound(1, 3, false, false));
				}())
				||
				(directives.constructor === Number) && (function(){
					keyRange = (directives && directives);
					req = objectStore.openCursor(keyRange);
				}());
			}());
			
			req.onsuccess = function(e){
				cursor = e.target.result;
				if(cursor){
					items.push(cursor.value);
					callback(cursor.value, cursor);
					//cursor.continue();  // passing cursor to callback for in-process cursor-control.
				}
			};
			
			/*  req = objectStore.openCursor();
			req.onsuccess = function(e){
				cursor = e.target.result;
				(cursor) && (function(){
					items.push(cursor.value);
					callback(cursor.value);
					cursor.continue();
				}());
			};
			*/
			
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
					(cursor) && (function(){
						items.push(cursor.value);
						callback(cursor.value);
						cursor.continue();
					}());
				};
				return this;
			};
			
			function openKeyCursor(callback){
				var cursor, items = [], req = storeIndex.openCursor();
				req.onsuccess = function(e){
					cursor = e.target.result;
					(cursor) && (function(){
						items.push(cursor.value);
						callback(cursor.value);
						cursor.continue();
					}());
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
			store: getObjectStore,
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










