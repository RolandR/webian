var terminal; //	jQuery object of terminal element
var output;	//	jQuery object of output div
var input;	//	jQuery object of prompt input element
var prompt;	//	jQuery object of the command prompt itself
var userElement;		// jQuery object of the prompt's user string
var workingDirElement;	//	jQuery object of the prompt's working directory	

$(document).ready(function(){
	terminal = $('#terminal');
	output = $('#output');
	input = $('#textInput');
	prompt = $('#prompt');
	userElement = $('#user');
	workingDirElement = $('#wd');
});