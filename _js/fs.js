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
							content: [
								{
									name: '.bash_history',
									type: 'ASCII text',
									id: 9,
									parentId: 7,
									fileContent: ''
								}
							]
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
	*	the fsTree file of that location.
	*
	*	Note: Path must start at root directory!
	*/
	function getFile(path){
		var path = path.split('/');
		var pathArray = [];
		for(var i in path){	//	Remove all empty elements
			if(path[i] != ''){
				pathArray.push(path[i]);
			}
		}
		
		path = pathArray;
		
		path.splice(0, 0, '/');	//	Add root directory (was removed as we split by '/')
		
		
		var navigatingIn = fsTree;
		
		for(var i in path){
			if(i != path.length - 1){
				navigatingIn = getFileByName(path[i], navigatingIn).content;
			} else {
				navigatingIn = getFileByName(path[i], navigatingIn);
			}
		}
		return navigatingIn;
	}
	
	function setFileContent(path, contentString){
		var file = getFile(path);
		file.fileContent = contentString;
	}
	
	function addToFile(path, contentString){
		var file = getFile(path);
		file.fileContent += contentString;
	}
	
	return{
		getFile: getFile,
		setFileContent: setFileContent,
		addToFile: addToFile
	}
}