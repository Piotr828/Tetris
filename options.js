if (getSessionData('login') == null){document.getElementById('acc').style.display='none'}
function changelogin(nowy,pass){
   if (exec_py('checklogin',nowy))
    exec_py('changelogin',getSessionData('login'),nowy)
}
let off = !!getSessionData('offsave')
function zapisz_ustawienia(effVol, mscVol,offsave,newlogin, newpass, newmail,oldpass){
    saveSessionData('eff_vol', effVol-0);
    saveSessionData('music_vol',mscVol-0);
    saveSessionData('offsave',offsave);
    document.getElementById('err').innerText = getSessionData('option_err')
    saveSessionData('option_err',null)
    if(newlogin){
       exec_py('change_login',getSessionData('login'),newlogin,oldpass).then(result => {
                if (result){saveSessionData('option_err',result)}
            })
    }
        if(newpass) {
            exec_py('change_password', getSessionData('login'), newpass, oldpass).then(result => {
                alert(result); if (result){saveSessionData('option_err',result)}
            })

        }
        if(newmail){
        exec_py('change_email', getSessionData('login'), newpass, oldpass).then(result => {
                if (result){saveSessionData('option_err',result)}
            });
    }
        if(newmail){
            exec_py('change_email', getSessionData('login'), newmail, oldpass).then(result => {
                if (result){saveSessionData('option_err',result)}
            })
        }
        location.reload()
}



setMusicVolume()
document.getElementById('msc').value =     getSessionData('music_vol');
document.getElementById('msc').nextElementSibling.value =     getSessionData('music_vol') ?? 50;

document.getElementById('eff').value =     getSessionData('eff_vol');
document.getElementById('eff').nextElementSibling.value =     getSessionData('eff_vol') ?? 50;

document.getElementById('ofl').checked =     !!getSessionData('offsave');
