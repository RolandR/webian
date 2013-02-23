var fs = new Fs();

function Fs(){
	var workingDir = '/';
	
	var fsTree = [
		{
			name: '/',
			type: 'folder',
			id: 0,
			content: [
				{
					name: 'var',
					type: 'folder',
					id: 1,
					parentId: 0,
					content: [],
				},
				{
					name: 'opt',
					type: 'folder',
					id: 2,
					parentId: 0,
					content: [],
				},
				{
					name: 'etc',
					type: 'folder',
					id: 3,
					parentId: 0,
					content: [],
				},
				{
					name: 'bin',
					type: 'folder',
					id: 4,
					parentId: 0,
					content: [
						{
							name: 'ls',
							type: 'javascript',
							id: 5,
							parentId: 4,
							jsLocation: './programs/ls.js'
						}
					]
				},
				{
					name: 'home',
					type: 'folder',
					id: 6,
					parentId: 0,
					content: [
						{
							name: 'user',
							type: 'folder',
							id: 7,
							parentId: 6,
							content: []
						},
						{
							name: 'otheruser',
							type: 'folder',
							id: 8,
							parentId: 6,
							content: []
						}
					]
				}
			]
		}
	];
	
	/*
	*	Searches the entire given tree structure for an item with
	*	the specified id.
	*/
	function getFileById(id, searchTree){
		var currentlyProcessing;
		for(var i in searchTree){
			currentlyProcessing = searchTree[i];
			
			if(currentlyProcessing.id == id){
				return currentlyProcessing;
			}
			
			if(currentlyProcessing.content != null && currentlyProcessing.content.length > 0){
				var foundItem = getFileById(id, currentlyProcessing.content);
				if(foundItem != false){
					return foundItem;
				}
			}
		}
		return false;
	}
	
	/*
	*	Searches the first level of the given tree structure
	*	for an item with the specified name.
	*/
	function getFileByName(name, searchTree){
		var currentlyProcessing;
		for(var i in searchTree){
			currentlyProcessing = searchTree[i];
			
			if(currentlyProcessing.name == name){
				return currentlyProcessing;
			}
		}
		return false;
	}
	
	/*
	*	Takes a path like /home/user/Documents/ and returns
	*	the fsTree directory of that location.
	*
	*	Note: Path must start at root directory!
	*/
	function getFolderContents(path){
		var path = path.split('/');
		for(var i in path){	//	Remove all empty elements
			if(path[i] == ''){
				path.splice(i, 1);
			}
		}
		
		path.splice(0, 0, '/');	//	Add root directory (was removed as we split by '/')
		
		console.log(path);
		
		var navigatingIn = fsTree;
		
		for(var i in path){
			console.log(navigatingIn);
			var navigatingIn = getFileByName(path[i], navigatingIn).content;
		}
		
		return navigatingIn;
	}
	
	return{
			getFolderContents : getFolderContents
		}
}