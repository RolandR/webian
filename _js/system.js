var system;

$(document).ready(function(){
	system = new System();
});

function System(){
	
	bootSystem();
	
	
	function sysout(outputString){
		output.append(
			'<pre><span class="sysout">'+outputString+'</span></pre>'
		);
	}
	
	function syserr(outputString){
		output.append(
			'<pre><span class="syserr">'+outputString+'</span></pre>'
		);
	}
	
	function listAllExecutableFiles(folder, path){
		var foundPaths = [];
		if(folder == undefined){
			var folder = fs.getFile('/').content;
		} else {
			folder = folder.content;
		}
		
		if(path == undefined){
			var path = '/';
		}
		
		
		for(i in folder){
			if(folder[i].type == 'executable, javascript'){
				foundPaths.push(path + folder[i].name);
			} else if(folder[i].type == 'folder'){
				var folderResults = listAllExecutableFiles(folder[i], path + folder[i].name + '/');
				for(r in folderResults){
					foundPaths.push(folderResults[r]);
				}
			}
		}
		return foundPaths;
	}
	
	function initProgram(path){
		path = fs.makeProperPath(path);
		file = fs.getFile(path);
		if(file.type == 'executable, javascript'){
			fs.setExecute(path, new Function('args', file.fileContent));
		}
	}
	
	function bootSystem(){
		var executables = listAllExecutableFiles();
		for(i in executables){
			var programPath = executables[i];
			sysout('Setting up '+programPath+'\n');
			
			var programFile = fs.getFile(programPath);
			sysout('\tfetching '+programFile.jsLocation+'\t');
			$.ajax({
				type: "GET",
				url: programFile.jsLocation,
				dataType: 'text',
				timeout: 5000,
				async: false,
				success: function(result){
					sysout('OK\n');
					sysout('\tProcessing '+programFile.name);
					fs.setFileContent(programPath, result);
					initProgram(programPath);
					sysout('\t\t\tDone\n');
				},
				error: function(jqXHR, textStatus, errorThrown){
					syserr('FAILED\n');
					syserr('Error: '+errorThrown + '\n');
				}
			}).done(function(jsFileContent) {
				
			});
			//sysout('OK\n');
			sysout('\n');
		}
		
		sysout('System ready.\n');
		
		output.html('');
	}	
	
}
