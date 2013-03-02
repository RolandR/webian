
	var fileToRead = args[3];
	
	if(fileToRead == undefined || fileToRead == null){
		return false;
	} else {
		fileToRead = fs.makeProperPath(fileToRead);
	}
	
	var file = fs.getFile(fileToRead);
	if(file== undefined || file == null || file == false){
		bash.stderr(args[3]+': No such file or directory'+'\n');
	} else {
		if(file.type == 'folder'){
			bash.stderr(args[3]+': Is a directory'+'\n');
		} else {
			var content = file.fileContent;
			bash.stdout(content+'\n');
		}
	}
	
	return file;

