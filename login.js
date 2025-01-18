function zaloguj(login,password, rem){

        exec_py('log', login, password).then(result => {
        if(result){document.getElementById('err').innerText = (result)}
        else{
            if (login.includes('@')) {

                exec_py('get_login_by_email',  login).then(result => {
                    login = result
                    saveSessionData('login', login)
                    document.location = 'index.html'
                })


            }else{
            saveSessionData('login', login)
            document.location = 'index.html'
            }}
        });

if (rem){
    exec_py('remember',login,password)
}

}
setMusicVolume()