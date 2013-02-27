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
		bash.stderr('cannot access '+args[3]+': No such file or directory'+'\n');
	} else {
		if(file.type != 'folder'){
			bash.stdout(args[3]+'\n');
		} else {
			if(aux.hasFlag(flags, 'a') || aux.hasStrFlag(strFlags, 'all')){
				bash.stdout('.'+'\n');
				bash.stdout('..'+'\n');
			}
			
			var content = file.content;
			for(i in content){
				if(content[i].name.charAt(0) == '.'){
					if(aux.hasFlag(flags, 'a') || aux.hasFlag(flags, 'A') || aux.hasStrFlag(strFlags, 'all') || aux.hasStrFlag(strFlags, 'almost-all')){
						bash.stdout(content[i].name+'\n');
					}
				} else {
					bash.stdout(content[i].name+'\n');
				}
			}
		}
	}
	
	return file;
}
