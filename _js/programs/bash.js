var bash;

$(document).ready(function(){
	
	$('#textInput').focus();
	
	bash = new Bash();
	
	/*
	*	Bash handles all in/output from and to the terminal.
	*/
	function Bash(){
		
		var workingDir = '/';		
		var activeUser = users.getUser('user');
		setWorkingDir(activeUser.homeDir);
		
		var histPosition = -1; 	//	Position in ~/.bash_history we're
							//	currently using, counting from the bottom.
		var enteredCommand = '';	//	Stores the last entered input when we navigate the bash history
		
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
				return false;
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
				case 'ls':
					ls(args);
				break;
				case 'pwd':
					pwd(args);
				break;
				case 'cd':
					cd(args);
				break;
				case 'cat':
					cat(args);
				break;
				case 'clear':
					clear(args);
				break;
				default:
					if(args[0] != ''){
						stdout('bash: '+args[0]+': command not found'+'\n');
					}
				break;
			}
		}
		
		//	Standard error channel. Currently does almost the
		//	same as stdout.
		function stderr(errorString){
			output.append(
				'<span class="outputLine error">'+arguments.callee.caller.name.toString()+ ': ' +errorString+'</span>'
			);
			terminal.scrollTop(1000000); //	Scroll to bottom
		}
		
		function getWorkingDir(){
			return workingDir;
		}
		
		function setWorkingDir(newDir){
			workingDir = newDir;
			if(workingDir.length > 1 && workingDir.charAt(workingDir.length - 1) == '/'){
				workingDirElement.html(workingDir.substring(0, workingDir.length - 1));
			} else {
				workingDirElement.html(workingDir);
			}
		}
		
		function clearScreen(){
			output.html('');
		}
		
		return{
			stdout: stdout,
			stderr: stderr,
			getWorkingDir: getWorkingDir,
			setWorkingDir: setWorkingDir,
			clearScreen: clearScreen
		}
	}
});
