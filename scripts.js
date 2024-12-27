function startgame(){
document.addEventListener('keydown', function(event) {
    // Sprawdzanie naciśnięcia strzałki w prawo lub 'd'
    if (event.key === 'ArrowRight' || event.key === 'd') {
        console.log('Strzałka w prawo lub d');
                document.getElementById("main").innerText += ">"

    }

    // Sprawdzanie naciśnięcia strzałki w lewo lub 'a'
    else if (event.key === 'ArrowLeft' || event.key === 'a') {
        console.log('Strzałka w lewo lub a');
       document.getElementById("main").innerText += "<"
    }

    // Sprawdzanie naciśnięcia strzałki w dół, 's' lub spacji
    else if (event.key === 'ArrowDown' || event.key === 's' || event.key === ' ') {
        console.log('Strzałka w dół, s lub spacja');
        document.getElementById("main").innerText += "v"
        // Dodaj odpowiednią akcję tutaj
    }
});}