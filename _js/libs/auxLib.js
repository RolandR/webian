var aux = new Aux();

/*
*	Aux contains a selection of auxiliary functions
*	which are not part of the simulated unix system.
*/
function Aux(){
	
	/*
	*	Checks if a string contains a single-letter flag.
	*/
	function hasFlag(flagString, flag){
		if(flagString.indexOf(flag) !== -1){
			return true;
		} else {
			return false;
		}
	}
	
	/*
	*	Checks if an array contains a fulltext flag.
	*/
	function hasStrFlag(flagArray, flag){
		for(i in flagArray){
			if(flagArray[i] == flag){
				return true;
			}
		}
		return false;
	}
	
	return{
		hasFlag: hasFlag,
		hasStrFlag: hasStrFlag
	}
}