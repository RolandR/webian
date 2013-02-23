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
	
	console.log(dirToDisplay);
	
	var contents = fs.getFolderContents(dirToDisplay);
	console.log(contents);
	for(i in contents){
		bash.stdout(contents[i].name);
	}
}