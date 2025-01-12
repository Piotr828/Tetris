function changelogin(){}
function changepass(){}
function changemail(){}
let off = !!getSessionData('offsave')
function zapisz_ustawienia(effVol, mscVol,offsave,newlogin, newpass, newmail){
    saveSessionData('eff_vol', effVol-0);
    saveSessionData('music_vol',mscVol-0);
    saveSessionData('offsave',offsave);
    if(newlogin){
        changelogin();
    }
        if(newpass){
        changepass();}
        if(newmail){
        changemail();
    }
        location.reload()
}
setMusicVolume()
document.getElementById('msc').value =     getSessionData('music_vol');
document.getElementById('msc').nextElementSibling.value =     getSessionData('music_vol') ?? 50;

document.getElementById('eff').value =     getSessionData('eff_vol');
document.getElementById('eff').nextElementSibling.value =     getSessionData('eff_vol') ?? 50;

document.getElementById('ofl').checked =     !!getSessionData('offsave');
