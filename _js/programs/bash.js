var bash;

$(document).ready(function(){
	
	$('#textInput').focus();
	
	bash = new Bash();
	
	/*
	*	Bash handles all in/output from and to the terminal.
	*/
	function Bash(){
		
		var workingDir = '/';
		
		
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
		});
		
		// Recieves input from the Enter keypress event for textInput
		function stdin(inputString){
			stdout(userElement.html() + workingDirElement.html() + '$ ' + inputString);
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
					if(inputString != ''){
						stdout('bash: '+inputString.split(' ')[0]+': command not found');
					}
				break;
			}
		}
		
		function stderr(errorString){
			
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
