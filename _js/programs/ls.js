function ls(
	args
){
	var flags = args[1];
	var strFlags = args[2];
	
	var dirToDisplay = args[3];
	
	if(dirToDisplay == undefined || dirToDisplay == null){
		dirToDisplay = bash.getWorkingDir();
	} else {
		dirToDisplay = fs.makeProperPath(dirToDisplay);
	}
	
	var file = fs.getFile(dirToDisplay);
	if(file== undefined || file == null || file == false){
		bash.stderr('cannot access '+args[3]+': No such file or directory');
	} else {
		if(file.type != 'folder'){
			bash.stdout(args[3]);
		} else {
			if(aux.hasFlag(flags, 'a') || aux.hasStrFlag(strFlags, 'all')){
				bash.stdout('.');
				bash.stdout('..');
			}
			
			var content = file.content;
			for(i in content){
				if(content[i].name.charAt(0) == '.'){
					if(aux.hasFlag(flags, 'a') || aux.hasFlag(flags, 'A') || aux.hasStrFlag(strFlags, 'all') || aux.hasStrFlag(strFlags, 'almost-all')){
						bash.stdout(content[i].name);
					}
				} else {
					bash.stdout(content[i].name);
				}
			}
		}
	}
	
	return file;
}
