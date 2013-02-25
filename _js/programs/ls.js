function ls(
	args
){
	var dirToDisplay = args[1];
	
	if(dirToDisplay == undefined || dirToDisplay == null){
		dirToDisplay = bash.getWorkingDir();
	} else {
		dirToDisplay = fs.makeProperPath(dirToDisplay);
	}
	
	var file = fs.getFile(dirToDisplay);
	if(file== undefined || file == null || file == false){
		bash.stderr('cannot access '+args[1]+': No such file or directory');
	} else {
		if(file.type != 'folder'){
			bash.stdout(args[1]);
		} else {
			var content = file.content;
			for(i in content){
				bash.stdout(content[i].name);
			}
		}
	}
	
	return file;
}
