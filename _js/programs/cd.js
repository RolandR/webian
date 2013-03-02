
	var targetPath = args[3];
	
	if(targetPath == undefined || targetPath == null){
		targetPath = '~';
	}
	
	targetPath = fs.makeProperPath(targetPath);
	
	var targetDir = fs.getFile(targetPath);
	
	if(targetDir== undefined || targetDir == null || targetDir == false){
		bash.stderr(args[3]+': No such file or directory'+'\n');
	} else if(targetDir.type != 'folder'){
		bash.stderr(args[3]+': Not a directory'+'\n');
	} else {
		bash.setWorkingDir(targetPath);
	}

