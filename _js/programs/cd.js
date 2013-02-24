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
	
	if(fs.getFile(targetDir) != undefined){
		bash.setWorkingDir(targetDir);
	} else {
		bash.stderr(args[1]+': No such file or directory');
	}
}