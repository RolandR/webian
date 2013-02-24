function ls(
	args
){
	var dirToDisplay = '';
	
	if(args[1] == undefined || args[1] == null){
		dirToDisplay = bash.getWorkingDir();
	} else if(args[1].charAt(0) == '/'){
		dirToDisplay = args[1];
	} else {
		dirToDisplay = bash.getWorkingDir() + args[1];
	}
	
	var file = fs.getFile(dirToDisplay);
	if(file === undefined){
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