let mail = ''
let code = ''
function register(kod,login,haslo1, haslo2) {
    if (document.getElementById('code').value != code) {
        return;
        document.getElementById('err').innerHTML = "Błędny kod weryfikacyjny"
    }
    if(haslo1 == haslo2) {
        exec_py('register', login, haslo1, mail).then(result => {
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

function checkMail(email) {
    document.getElementById('reg').style.display = 'none'
  code = Array.from({length: 8}, () => Math.random().toString(36)[2]).join('')
mail = email

        exec_py('verify_mail', code, mail).then(result => {
                document.getElementById('reg').style.display = 'inline-block'
                document.getElementById('reg').value = 'Weryfikuj'
            if (result){document.getElementById('err').innerText = (result)}
            else{
                mail = document.getElementById('mail').value
                document.getElementById('mail_box').innerHTML = `<input placeholder="kod" id="code" required> <i class='bx bxs-user'></i>`
                document.getElementById('btns').innerHTML = `
                 <input value="Zweryfikuj" id="reg" type="button" class="btn" onclick="register(mail,document.getElementById('login').value,document.getElementById('haslo1').value,document.getElementById('haslo2').value)">`
                document.getElementById('reg').value = 'Zarejestruj!'
            }



        })

}