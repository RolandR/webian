var fs = new Fs();

/*
*	Fs handles all direct interaction with the filesystem, which
*	is represented by fsTree, a JSON data structure.
*	Data in fsTree can be accessed with normal unix paths.
*/
function Fs(){
	var workingDir = '/';
	
	var fsTree = [
		{
			name: '/',
			type: 'folder',
			content: [
				{
					name: '.',
					type: 'folder'
				},
				{
					name: '..',
					type: 'folder'
				},
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
					name: 'usr',
					type: 'folder',
					content: [
						{
							name: '.',
							type: 'folder'
						},
						{
							name: '..',
							type: 'folder'
						},
						{
							name: 'bin',
							type: 'folder',
							content: [
								{
									name: '.',
									type: 'folder'
								},
								{
									name: '..',
									type: 'folder'
								},
								{
									name: 'clear',
									type: 'javascript',
									jsLocation: './programs/clear.js'
								}
							]
						}
					]
				},
				{
					name: 'bin',
					type: 'folder',
					content: [
						{
							name: '.',
							type: 'folder'
						},
						{
							name: '..',
							type: 'folder'
						},
						{
							name: 'ls',
							type: 'javascript',
							jsLocation: './programs/ls.js'
						},
						{
							name: 'bash',
							type: 'javascript',
							jsLocation: './programs/bash.js'
						},
						{
							name: 'cat',
							type: 'javascript',
							jsLocation: './programs/cat.js'
						},
						{
							name: 'cd',
							type: 'javascript',
							jsLocation: './programs/cd.js'
						}
					]
				},
				{
					name: 'home',
					type: 'folder',
					content: [
						{
							name: '.',
							type: 'folder'
						},
						{
							name: '..',
							type: 'folder'
						},
						{
							name: 'user',
							type: 'folder',
							content: [
								{
									name: '.',
									type: 'folder'
								},
								{
									name: '..',
									type: 'folder'
								},
								{
									name: 'stuff',
									type: 'folder',
									content: [
										{
											name: '.',
											type: 'folder'
										},
										{
											name: '..',
											type: 'folder'
										}
									]
								},
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
See <a href="http://www.gnu.org/licenses/gpl-3.0.html">http://www.gnu.org/licenses/gpl-3.0.html</a> for further information.\n\n'
								},
								{
									name: '-x',
									type: 'ASCII text',
									fileContent: 'This file has a stupid name.'
								}
							]
						},
						{
							name: 'otheruser',
							type: 'folder',
							content: [
								{
									name: '.',
									type: 'folder'
								},
								{
									name: '..',
									type: 'folder'
								}
							]
						}
					]
				}
			]
		}
	];
	
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
	*	Note: Path must start at root directory, format it
	*	with makeProperPath() first!
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
	
	/*
	*	Replaces the content of the file at the submitted
	*	path with the submitted content string.
	*	The file must not be a directory.
	*/
	function setFileContent(path, contentString){
		var file = getFile(path);
		if(file.type != 'folder'){
			file.fileContent = contentString;
		} else {
			return false;
		}
	}
	
	/*
	*	Adds to the end of the file at the submitted
	*	path with the submitted content string.
	*	The file must not be a directory.
	*/
	function addToFile(path, contentString){
		var file = getFile(path);
		if(file.type != 'folder'){
			file.fileContent += contentString;
		} else {
			return false;
		}
	}
	
	/*
	*	Takes any path and makes it a path starting at
	*	the root directory which can be used to navigate
	*	fsTree.
	*	. and .. are interpreted here, so something like
	*	/home/user/../otheruser will become /home/otheruser
	*/
	function makeProperPath(target){
		if(target.charAt(0) == '/'){
			target = target;
		} else if(target.charAt(0) != '~'){
			target = bash.getWorkingDir() + target;
		}
		
		target = properlySplitPath(target);
		
		target = target.join("/");
		target = '/' + target;
		if(target.length > 1){	//	So / wouldn't become //
			target += '/';
		}
		
		console.log(target);
		
		return target;
	}
	
	function properlySplitPath(target){
		var properPath = [];
		var target = target.split('/');
		for(var i in target){
			if(i == 0 && target[i] == '~'){
				var homeDir = bash.getActiveUser().homeDir;
				homeDir = properlySplitPath(homeDir);
				for(var h in homeDir){
					properPath.push(homeDir[h]);
				}
			} else if(target[i] != '' && target[i] != '.'){
				if(target[i] == '..'){
					properPath.pop();
				} else {
					properPath.push(target[i]);
				}
			}
		}
		
		return properPath;
	}
	
	return{
		getFile: getFile,
		setFileContent: setFileContent,
		addToFile: addToFile,
		makeProperPath: makeProperPath
	}
}
