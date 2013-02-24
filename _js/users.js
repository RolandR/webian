var users = new Users();
function Users(){
	var userList = [
		{
			name: 'user',
			homeDir: '/home/user/'
		}
	];
	
	function getHomedir(username){
		for(i in userList){
			if(userList[i].name == username){
				return userList[i].homeDir;
			}
		}
		return false;
	}
	
	function getUser(username){
		for(i in userList){
			if(userList[i].name == username){
				return userList[i];
			}
		}
		return false;
	}
	
	return{
		getHomedir: getHomedir,
		getUser: getUser
	}
}