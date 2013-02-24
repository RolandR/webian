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
	
	var contents = fs.getFolderContents(dirToDisplay);
	if(contents === undefined){
		bash.stderr('cannot access '+args[1]+': No such file or directory');
	} else {
		for(i in contents){
			bash.stdout(contents[i].name);
		}
	}
	
	console.log(contents);
}