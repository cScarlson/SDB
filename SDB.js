





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
				
				/* TEST objectStore given that name
				 * ...and email are part of the schema. */
				var peopleData = [
					{ name: "John Dow", email: "john@company.com" },
					{ name: "Don Dow", email: "don@company.com" }
				];
				for(i in peopleData){objectStore.add(peopleData[i]);}/* END TEST */
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
			index: this.index
		};
	};
	
	SDB.prototype = (function(){
		var transaction, objectStore;
		function transaction(db, store, transactionType){
			console.log('hit trans', db, store, IDBTransaction[transactionType]);
			transaction = db.transaction(store, IDBTransaction[transactionType]);
			console.log('transaction', transaction);
			return this;
		};
		
		function objectStore(store){
			console.log('#transaction', transaction);
			objectStore = transaction.objectStore(store);
			console.log('#objectStore', objectStore);
			return this;
		};
		
		function ADD(obj){
			console.log('hit ADD function, obj', (obj && obj) || 'NO obj');
			obj && objectStore.add(obj);
			return this;
		};
		
		function PUT(obj){
			console.log('hit PUT function, obj', (obj && obj) || 'NO obj');
			obj && objectStore.put(obj);
			return this;
		};
		
		function DELETE(keyPath){
			console.log('hit DELETE function, keyPath', (keyPath && keyPath) || 'NO keyPath');
			keyPath && objectStore.delete(keyPath);
			return this;
		};
		
		function GET(keyPath){
			console.log('hit GET function, keyPath', (keyPath && keyPath) || 'NO keyPath');
			keyPath && objectStore.get(keyPath);
			return this;
		};
		
		function openCursor(){
			console.log('hit openCursor function');
			return this;
		};
		
		function index(){
			console.log('hit index function');
			return this;
		};
		
		/**
		 * @return methods to 'this'
		 */
		return {
			trans: transaction,
			store: objectStore,
			add: ADD,
			put: PUT,
			del: DELETE,
			get: GET,
			cursor: openCursor,
			index: index
		};
	}());
	
	return {
		req: function(schema, callback){
			return new SDB(schema, callback);
		}
	};
	
}()));

var schema = {
	db:'PeopleDB',
	v: 1,
	upgrade: {
		stores: [
			{
				name: 'people',
				opts: {keyPath: "id", autoIncrement: true},
				indices: [
					{index: 'name', opts: {unique: false}},
					{index: 'email', opts: {unique: true}}
				]
			},
			{
				name: 'aliens',
				opts: {keyPath: "id", autoIncrement: true},
				indices: [
					{index: 'name', opts: {unique: false}},
					{index: 'email', opts: {unique: true}}
				]
			}/*,
			{  // add for version 2 (take out stores from v1)
				name: 'animals',
				opts: {keyPath: "id", autoIncrement: true},
				indices: [
					{index: 'animalName', opts: {unique: false}},
					{index: 'animalEmail', opts: {unique: true}}
				]
			}*/
		]
	} 
};

var idb = sdb.req(schema, function(db){
	console.log('success!', db, '\n\n');
	idb.tr(db, ['people'], 'READ_WRITE').store('people').add().put().del().cursor().index();
});

console.log('idb', idb, '\n\n');











