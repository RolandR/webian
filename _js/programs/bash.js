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
			stdout(userElement.html() + hostElement.html() + workingDirElement.html() + '$ ' + inputString);
			input.val('');
			terminal.scrollTop(1000000);
			
			fs.addToFile(activeUser.homeDir + '.bash_history', inputString + '\n');
			
			inputString = inputString.split(' ');
			
			switch(inputString[0]){
				case 'ls':
					ls(inputString);
				break;
				case 'pwd':
					pwd(inputString);
				break;
				case 'cd':
					cd(inputString);
				break;
				case 'cat':
					cat(inputString);
				break;
				default:
					if(inputString[0] != ''){
						stdout('bash: '+inputString[0]+': command not found');
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
			workingDirElement.html(workingDir.substring(0, workingDir.length - 1));
		}
		
		return{
			stdout : stdout,
			stderr : stderr,
			getWorkingDir : getWorkingDir,
			setWorkingDir: setWorkingDir
		}
	}
});
