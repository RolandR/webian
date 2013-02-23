$(document).ready(function(){
	var io = new Io(
		$('#terminal'),
		$('#output'),
		$('#textInput'),
		$('#prompt')
	);
	function Io(
		terminal, //	jQuery object of terminal element
		output,	//	jQuery object of output div
		input,	//	jQuery object of prompt input element
		prompt	//	jQuery object of the command prompt itself
	){
		
		//	Key event handler
		input.keypress(function(event) {
			if ( event.which == 13 ) {
				stdin(input.val());
			}
		});
		
		function stdout(outputString){
			output.append(
				'<span class="outputLine">'+outputString+'</span>'
			);
		}
		
		function stdin(inputString){
			stdout(prompt.html() + ' ' + inputString);
			input.val('');
			stdout(inputString);
		}
		
		function stderr(errorString){
			
		}
	}
});
