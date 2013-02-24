function cat(args){
	var fileToRead = '';
	
	if(args[1] == undefined || args[1] == null){
		fileToRead = bash.getWorkingDir();
	} else if(args[1].charAt(0) == '/'){
		fileToRead = args[1];
	} else {
		fileToRead = bash.getWorkingDir() + args[1];
	}
	
	var file = fs.getFile(fileToRead);
	if(file === undefined){
		bash.stderr(args[1]+': No such file or directory');
	} else {
		if(file.type == 'folder'){
			bash.stderr(args[1]+': Is a directory');
		} else {
			var content = file.fileContent;
			bash.stdout(content);
		}
	}
	
	return file;
}