const klocki = {
    klocek1: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 1, 1, 1],
    ],
    klocek2: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 0, 0],
        [0, 1, 1, 0],
    ],
    klocek3: [
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
    ],
    klocek4: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 0],
        [0, 1, 0, 0],
    ],
    klocek5: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 0, 0],
        [1, 1, 0, 0],
    ],
    klocek6: [
        [0, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 1, 0, 0],
        [0, 1, 0, 0],
    ],
    klocek7: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 0],
        [1, 0, 0, 0],
    ],
};

let row = 0; // wiersz klocka
let column = 0; // kolumna klocka


const rows = 20;
const columns = 10;
const plansza = Array.from({ length: rows }, () => Array(columns).fill(0));

function dodajKlocekNaPlansze(plansza, klocek, startRow, startCol) { // dodanie klocka na plansze, gdzie zaczyna sie jego pozycja na startRow i startCol
    for (let i = 0; i < klocek.length; i++) {
        for (let j = 0; j < klocek[i].length; j++) {
            if (klocek[i][j] === 1) {
                const row = startRow + i;
                const col = startCol + j;
                if (row >= 0 && row < plansza.length && col >= 0 && col < plansza[0].length) {
                    plansza[row][col] = 1;
                }
            }
        }
    }
}

function usunPelneWiersze(plansza) { // usuwa wiersze gdzie sa same 1
    return plansza.filter(row => row.includes(0));
}

function pobierzKlocek(nazwaKlocka){ // zwraca macież klocka przy podaniu jego nazwy
    return klocki[nazwaKlocka]
}

function obliczWymiaryKlocka(klocek) { // oblicza wymiary podanego klocka
    let wysokosc = 0;
    let szerokosc = 0;

    for (let i = 0; i < a.length; i++) {
        if (klocek[i].some(val => val === 1)) {
            wysokosc++;
        }
    }

    for (let j = 0; j < klocek[0].length; j++) {
        for (let i = 0; i < klocek.length; i++) {
            if (klocek[i][j] === 1) {
                szerokosc++;
                break;
            }
        }
    }

    return { szerokosc, wysokosc };
}

function startgame(width){
    document.addEventListener('keydown', function(event) {
        // Sprawdzanie naciśnięcia strzałki w prawo lub 'd'
        if (event.key === 'ArrowRight' || event.key === 'd') {
            console.log('Strzałka w prawo lub d');
            if(column < 11-width){
                column += 1;
            }
            document.getElementById("main").innerText += ">"
        }

        // Sprawdzanie naciśnięcia strzałki w lewo lub 'a'
        else if (event.key === 'ArrowLeft' || event.key === 'a') {
            console.log('Strzałka w lewo lub a');
            if(column > 0){
                column -= 1;
            }
            document.getElementById("main").innerText += "<"
        }

        // Sprawdzanie naciśnięcia strzałki w dół, 's' lub spacji
        else if (event.key === 'ArrowDown' || event.key === 's' || event.key === ' ') {
            console.log('Strzałka w dół, s lub spacja');
            if(row > 0){
                row -= 1;
            }
            console.log(row);
            document.getElementById("main").innerText += "v"
            // Dodaj odpowiednią akcję tutaj
        }
    });
}

startgame();