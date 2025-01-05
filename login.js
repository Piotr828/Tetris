function zaloguj(login,password){

        exec_py('log', login, password).then(result => {
        if(result){document.getElementById('err').innerText = (result)}
        else{
            saveSessionData('login', login)
            document.location = 'index.html'
            }
        });



}