

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
		/*.cursor(function(data){
			console.log('aliens data', data);
		});*/
	
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
		.cursor(function(data){
			console.log('@OpenCursor _');
			console.log('@OpenCursor:', data);
		})
		.cursor(function(data){
			console.log('@OpenCursor 2');
			console.log('@OpenCursor:', data);
		}, 2)
		.cursor(function(data){
			console.log("@OpenCursor {bound: [1, 8], direction: 'prev'}");
			console.log('@OpenCursor:', data);
		}, {bound: [1, 8], direction: 'prev'})
		.cursor(function(data){
			console.log("@OpenCursor {bound: [1, 3, true, true]}");
			console.log('@OpenCursor:', data);
		}, {bound: [1, 3, true, true]});  // {bound: [1, 8], direction: 'next'} 2
});

console.log('PeopleDBHook', PeopleDBHook, '\n\n');

