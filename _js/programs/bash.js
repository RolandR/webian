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
		
		
		
		// Output on the terminal.
		function stdout(outputString){
			output.append(
				'<span class="outputLine">'+outputString+'</span>'
			);
			terminal.scrollTop(100000); //	Scroll to bottom
		}
		
		//	Key event handler, calls stdin
		input.keypress(function(event) {
			if ( event.which == 13 ) {
				stdin(input.val());
			}
			if ( event.which == 9 ) {
				return false;
			}
		});
		
		// Recieves input from the Enter keypress event for textInput
		function stdin(inputString){
			stdout(userElement.html() + hostElement.html() + workingDirElement.html() + '$ ' + inputString);
			input.val('');
			terminal.scrollTop(100000);
			
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
			terminal.scrollTop(100000); //	Scroll to bottom
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
