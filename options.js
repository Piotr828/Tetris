if (getSessionData('login') == null){document.getElementById('acc').style.display='none'}
function del(old){
    let dane = false
    exec_py('log',getSessionData('login'),old).then(result => {
        if(result){document.getElementById('err').innerText = result}
            else{dane =true}
            if(dane){
            exec_py('delete_user_by_login',getSessionData('login')).then(result => {

                if(result){document.getElementById('err').innerText = result}
                else{
                    saveSessionData('login', null)
                    document.location = 'log.html'
                    document.getElementById('err').innerText = ''
                }
            })
            }

    })
}

let off = !!getSessionData('offsave')
function zapisz_ustawienia(effVol, mscVol,offsave,newlogin, newpass, newmail,oldpass){
    saveSessionData('eff_vol', effVol-0);
    saveSessionData('music_vol',mscVol-0);
    saveSessionData('offsave',offsave);
    if(newlogin){
       exec_py('change_login',getSessionData('login'),newlogin,oldpass).then(result => {
                            if(result){document.getElementById('err').innerText = result;}else{saveSessionData('login',newlogin);document.getElementById('err').innerText = ""}

            })
    }
        if(newpass) {
            exec_py('change_password', getSessionData('login'), newpass, oldpass).then(result => {
                if (result){document.getElementById('err').innerText = result;
}else{document.getElementById('err').innerText = ""}
            })

        }
        if(newmail){
        exec_py('change_email', getSessionData('login'), newpass, oldpass).then(result => {
                if (result){document.getElementById('err').innerText = result;
}
            });
    }else{document.getElementById('err').innerText = ""}
        if(newmail){
            exec_py('change_email', getSessionData('login'), newmail, oldpass).then(result => {
                if (result){document.getElementById('err').innerText = result;
}
            })
        }else{document.getElementById('err').innerText = ""}
setMusicVolume()
document.getElementById('msc').value =     getSessionData('music_vol');
document.getElementById('msc').nextElementSibling.value =     getSessionData('music_vol') ?? 50;

document.getElementById('eff').value =     getSessionData('eff_vol');
document.getElementById('eff').nextElementSibling.value =     getSessionData('eff_vol') ?? 50;

document.getElementById('ofl').checked =     !!getSessionData('offsave');



}



setMusicVolume()
document.getElementById('msc').value =     getSessionData('music_vol');
document.getElementById('msc').nextElementSibling.value =     getSessionData('music_vol') ?? 50;

document.getElementById('eff').value =     getSessionData('eff_vol');
document.getElementById('eff').nextElementSibling.value =     getSessionData('eff_vol') ?? 50;

document.getElementById('ofl').checked =     !!getSessionData('offsave');
