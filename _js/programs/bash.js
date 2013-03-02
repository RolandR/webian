var bash;

$(document).ready(function(){
	
	input.focus();
	
	bash = new Bash();
	
	/*
	*	Bash handles all in/output from and to the terminal.
	*	It supports using previously entered commands, which
	*	are stored in ~./bash_history.
	*/
	function Bash(){
		
		var workingDir = '/';
		var activeUser = users.getUser('user');
		setWorkingDir(activeUser.homeDir);
		
		var histPosition = -1; 	//	Position in ~/.bash_history we're
							//	currently using, counting from the bottom.
							//	Is -1 if we aren't using the history currently.
							
		var enteredCommand = '';	//	Stores the last entered input when we navigate 
							//	the bash history
		
		// Output on the terminal.
		function stdout(outputString){
			output.append(
				'<pre><span class="outputLine">'+outputString+'</span></pre>'
			);
			terminal.scrollTop(1000000); //	Scroll to bottom
		}
		
		//	Key event handler, calls stdin
		input.keydown(function(event) {
			if(event.which == 13){	//	Enter
				stdin(input.val());
			}
			if(event.which == 9){	//	Tab
				event.preventDefault();
			}
			if(event.which == 38){	//	Up
				event.preventDefault();
				if(histPosition == -1){
					enteredCommand = input.val();
				}
				histPosition++;
				goToHistory(histPosition);
			}
			if(event.which == 40){	//	Down
				event.preventDefault();
				histPosition--;
				if(histPosition < 0){
					histPosition = -1;
				}
				goToHistory(histPosition);
			}
		});
		
		function goToHistory(position){
			if(histPosition == -1){
				input.val(enteredCommand);
			} else {
				var history = fs.getFile(activeUser.homeDir + '.bash_history').fileContent;
				history = history.split('\n');
				
				var cleanedHistory = [];
				var prevHistElement = '';
				for(var i in history){	//	Remove all empty elements
					if(history[i] != '' && history[i] != prevHistElement){
						prevHistElement = history[i];
						cleanedHistory.push(history[i]);
					}
				}
				history = cleanedHistory;
				
				if(histPosition >= history.length){
					histPosition = history.length - 1;
				}
				input.val(history[history.length - histPosition - 1]);
			}
		}
		
		// Recieves input from the Enter keypress event for textInput
		function stdin(inputString){
			histPosition = -1;
			stdout(userElement.html() + hostElement.html() + workingDirElement.html() + '$ ' + inputString+'\n');
			input.val('');
			terminal.scrollTop(1000000); //	Scroll to bottom
			
			fs.addToFile(activeUser.homeDir + '.bash_history', inputString + '\n'); //	Add entered command to ~/.bash_history
			
			inputString = inputString.split(' ');
			
			var args = ['', '', []];
			var flags = '';
			var fullTextFlags = [];
			for(i in inputString){
				if(i == 0){
					args[0] = inputString[0];
				} else if(inputString[i].substring(0, 2) == '--'){
					fullTextFlags.push(inputString[i].substring(2, inputString[i].length));
				} else if(inputString[i].charAt(0) == '-'){
					flags += inputString[i].substring(1, inputString[i].length);
				} else {
					args.push(inputString[i]);
				}
			}
			
			args[1] = flags;
			args[2] = fullTextFlags;
			
			/*
			
			Format for args:
			[0] function name
			[1] single character flags (single string)
			[2] full text flags (array)
			[3 and up] other arguments
			
			*/
			
			switch(args[0]){
				default:
					var file = fs.getFile(fs.makeProperPath(args[0]));
					if(file == undefined || file == false){
						stderr(args[0]+': No such file or directory\n');
					} else if(file.type != 'executable, javascript'){
						stderr(args[0]+': command not found\n');
					} else {
						file.execute(args);
					}
				break;
			}
		}
		
		//	Standard error channel. Currently does almost the
		//	same as stdout.
		function stderr(errorString){
			output.append(
				'<pre><span class="outputLine error">'+arguments.callee.caller.name.toString()+ ': ' +errorString+'</span></pre>'
			);
			terminal.scrollTop(1000000); //	Scroll to bottom
		}
		
		function getWorkingDir(){
			return workingDir;
		}
		
		/*
		*	Changes the current working directory to newDir.
		*/
		function setWorkingDir(newDir){
			workingDir = newDir;
			
			if(newDir.substring(0, activeUser.homeDir.length) == activeUser.homeDir){
				var newDir = newDir.replace(activeUser.homeDir, '~/');
			}
			
			if(newDir.length > 1 && newDir.charAt(newDir.length - 1) == '/'){
				//Do not display a path's last '/'
				newDir = newDir.substring(0, newDir.length - 1);
			}
			
			workingDirElement.html(newDir);
			windowTitle.html(userElement.html() + hostElement.html() + workingDirElement.html());
		}
		
		/*
		*	Empties the output element.
		*/		
		function clearScreen(){
			output.html('');
		}
		
		/*
		*	Returns the active user object.
		*/
		function getActiveUser(){
			return activeUser;
		}
		
		return{
			stdout: stdout,
			stderr: stderr,
			getWorkingDir: getWorkingDir,
			setWorkingDir: setWorkingDir,
			clearScreen: clearScreen,
			getActiveUser: getActiveUser
		}
	}
});
