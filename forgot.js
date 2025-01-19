 let mail
    let code
    function send() {
        document.getElementById('login').style.display = 'none'
        code = Array.from({length: 8}, () => Math.random().toString(36)[2]).join('')
        mail = document.getElementById('email').value
        document.getElementById('login').disable = true
        exec_py("verify_mail", code, mail).then(result => {
            if (result) {
              location.reload()
            }
           if(result != 0){document.getElementById('err').innerHTML = result
                   document.getElementById('login').style.display = 'inline-block'
           }

            document.getElementById('cont').innerHTML = `

    <input type="text" id="code" placeholder="KOD">
    <input type="password" id="newpass" placeholder="Nowe hasło">
    <button id="login" onclick="change()">Zmień hasło!</button>
    `


        })
    }
 function change() {
                if(document.getElementById('code').value == code){
                    exec_py("change_password_force", mail, document.getElementById('newpass').value).then(result => {
                   if(result != 0){document.getElementById('err').innerHTML = result}else{document.location = 'log.html'}
                        })
                }else{document.getElementById('err').innerHTML = "Błędny kod!"}
            }