function register(mail,login,haslo1, haslo2) {
    if(haslo1 == haslo2) {
        exec_py('register', login, haslo1, mail).then(result => {
            alert(result)
        if(result){document.getElementById('err').innerText = (result)}
        else{
            document.location = 'log.html'
            }
        });
    }else{
        document.getElementById('err').innerText = "Hasła nie są takie same"
    }
}
setMusicVolume()