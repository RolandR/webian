function cd(args){
	var targetDir = '';
	
	if(args[1] == undefined || args[1] == null){
		targetDir = bash.getWorkingDir(); //	TODO: Change to user's home dir once users are implemented.
	} else if(args[1].charAt(0) == '/'){
		targetDir = args[1];
	} else {
		targetDir = bash.getWorkingDir() + args[1];
	}
	
	if(targetDir.charAt(targetDir.length) != '/'){
		targetDir += '/';
	}
	
	targetDir = fs.getFile(targetDir);
	
	if(targetDir== undefined ||
			targetDir == null ||
			targetDir == false){
		bash.stderr(args[1]+': No such file or directory');
	} else if(targetDir.type != 'file'){
		bash.stderr(args[1]+': Not a directory');
	} else {
		bash.setWorkingDir(targetDir);
	}
}
