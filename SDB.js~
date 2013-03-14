





window.sdb = (window.sdb || (function(){
	
	function SDB(schema, successCallback){
		this.req, this.db;
		
		this.req = indexedDB.open(schema.db, schema.v);
		this.req.onsuccess = function(e){
			this.db = e.target.result;
			successCallback(this.db);
		};
		
		this.req.onerror = function(e){
			console.log("IndexedDB error: " + e.target.errorCode);
		};
		
		this.req.onupgradeneeded = function(e){
			
			var stores = schema.upgrade.stores
				, objectStore;
			for(var store in stores){
				objectStore = e.currentTarget.result.createObjectStore(
					stores[store].name, stores[store].opts
				);
				createIndices(stores[store].indices);
			}
			
			function createIndices(inds){
				for(var ind in inds){
					objectStore.createIndex(
						inds[ind].index, inds[ind].index, inds[ind].opts
					);
				}
			};
			
			/* TEST objectStore given that name
			 * ...and email are part of the schema. */
			var peopleData = [
				{ name: "John Dow", email: "john@company.com" },
				{ name: "Don Dow", email: "don@company.com" }
			];
			for(i in peopleData){objectStore.add(peopleData[i]);}/* END TEST */
			
		};
		
		/**
		 * @return this[methodName] to api with alias
		 */
		return {
			req: this.req,
			tr: this.trans,
			store: this.store
		};
	};
	
	SDB.prototype = (function(){
		function transaction(db, store, transactionType){
			console.log('hit trans', db, store, IDBTransaction[transactionType]);
			return this;
		};
		
		function objectStore(){
			console.log('fn!');
		};
		
		/**
		 * @return methods to 'this'
		 */
		return {
			trans: transaction,
			store: objectStore
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
					{index: 'alienName', opts: {unique: false}},
					{index: 'alienEmail', opts: {unique: true}}
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
	idb.tr(db, 'people', 'READ_WRITE').store();
});

console.log('idb', idb, '\n\n');











