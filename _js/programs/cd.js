function cd(args){
	var targetPath = args[3];
	
	if(targetPath == undefined || targetPath == null){
		targetPath = bash.getWorkingDir(); //	TODO: Change to user's home dir once users are implemented.
	} else {
		targetPath = fs.makeProperPath(targetPath);
	}
	
	var targetDir = fs.getFile(targetPath);
	console.log(targetDir);
	
	if(targetDir== undefined || targetDir == null || targetDir == false){
		bash.stderr(args[3]+': No such file or directory');
	} else if(targetDir.type != 'folder'){
		bash.stderr(args[3]+': Not a directory');
	} else {
		bash.setWorkingDir(targetPath);
	}
}
