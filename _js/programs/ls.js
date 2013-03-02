
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
			
			var content = file.content;
			var filename;
			for(i in content){
				filename = content[i].name;
				
				if(filename == '.' || filename == '..'){
					if(	   aux.hasFlag(flags, 'a')
						|| aux.hasStrFlag(strFlags, 'all'))
					{
						bash.stdout(filename+'\n');
					}
				} else if(filename.charAt(0) == '.'){
					if(	   aux.hasFlag(flags, 'a')
						|| aux.hasFlag(flags, 'A')
						|| aux.hasStrFlag(strFlags, 'all')
						|| aux.hasStrFlag(strFlags, 'almost-all'))
					{
						bash.stdout(filename+'\n');
					}
				} else {
					bash.stdout(filename+'\n');
				}
			}
		}
	}
