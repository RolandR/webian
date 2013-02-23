function cd(args){
	var targetDir = '';
	
	if(args[1] == undefined || args[1] == null){
		
	} else if(args[1].charAt(0) == '/'){
		targetDir = args[1];
	} else {
		targetDir = bash.getWorkingDir() + args[1];
	}
	
	if(targetDir.charAt(targetDir.length) != '/'){
		targetDir += '/';
	}
	
	bash.setWorkingDir(targetDir);
}