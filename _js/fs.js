var fs = new Fs();

function Fs(){
	var workingDir = '/';
	
	var fsTree = [
		{
			name: '/',
			type: 'folder',
			content: [
				{
					name: 'var',
					type: 'folder',
					content: [],
				},
				{
					name: 'opt',
					type: 'folder',
					content: [],
				},
				{
					name: 'etc',
					type: 'folder',
					content: [],
				},
				{
					name: 'bin',
					type: 'folder',
					content: [
						{
							name: 'ls',
							type: 'javascript',
							jsLocation: './programs/ls.js'
						}
					]
				},
				{
					name: 'home',
					type: 'folder',
					content: [
						{
							name: 'user',
							type: 'folder',
							content: [
								{
									name: '.bash_history',
									type: 'ASCII text',
									fileContent: ''
								},
								{
									name: 'welcome.txt',
									type: 'ASCII text',
									fileContent: '  Hello world!\n  This is a test file.'
								},
								{
									name: 'license.txt',
									type: 'ASCII text',
									fileContent: '\nCopyright 2012 Roland Rytz\n\
___________________________\n\
\n\
This program is free software: you can redistribute it and/or modify\n\
it under the terms of the GNU General Public License as published by\n\
the Free Software Foundation, either version 3 of the License, or\n\
(at your option) any later version.\n\
\n\
This program is distributed in the hope that it will be useful,\n\
but WITHOUT ANY WARRANTY; without even the implied warranty of\n\
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n\
GNU General Public License for more details.\n\
\n\
See http://www.gnu.org/licenses/gpl-3.0.html for further information.\n\n'
								}
							]
						},
						{
							name: 'otheruser',
							type: 'folder',
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
	*
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
	*/
	
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
		
		
		var navigatingIn = fsTree[0];
		
		for(var i = 1; i < path.length; i++){			
			navigatingIn = getFileByName(path[i], navigatingIn.content);
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
	
	function makeProperPath(target){
		if(target.charAt(0) == '/'){
			target = target;
		} else {
			target = bash.getWorkingDir() + target;
		}
		
		/*
		for(i in target){
			var currentChar = target.charAt(i);
			var prevChar = target.charAt(i-1);
			if(!(currentChar == prevChar && currentChar == '/')){
				properPath += currentChar;
			} else {
				//omit
			}
		}
		*/
		
		var properPath = [];
		var target = target.split('/');
		for(var i in target){	//	Remove all empty elements
			if(target[i] != '' && target[i] != '.'){
				if(target[i] == '..'){
					properPath.pop();
				} else {
					properPath.push(target[i]);
				}
			}
		}
		
		properPath = properPath.join("/");
		properPath = '/' + properPath;
		if(properPath.length > 1){
			properPath += '/';
		}
		/*
		if(target.charAt(target.length) != '/'){
			target += '/';
		}
		*/
		
		return properPath;
	}
	
	return{
		getFile: getFile,
		setFileContent: setFileContent,
		addToFile: addToFile,
		makeProperPath: makeProperPath
	}
}
