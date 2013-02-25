function cat(args){
	var fileToRead = args[1];
	
	if(fileToRead == undefined || fileToRead == null){
		return false;
	} else {
		fileToRead = fs.makeProperPath(fileToRead);
	}
	
	var file = fs.getFile(fileToRead);
	if(file== undefined || file == null || file == false){
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
