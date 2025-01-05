const klocki = {
    klocek1: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 1, 1, 0],
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
        [0, 1, 0, 0]
    ],
    klocek7: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 0],
        [1, 0, 0, 0]
    ]
};
origins = ['35% 75%', '35% 75%', '12% 50%', '37% 75%', '25% 75%', '25% 62%', '37% 75%'];
// zmienna przechowująca liczbę usuniętych wierszy; potrzebna do liczenia XP oraz prędkości upadku
let usuniete = 0;
const matrix = document.getElementById("main_js");
const kolory = ['blue','green','orange','purple','yellow','red','blue2'];

const rows = 20;
const columns = 10;
let plansza = Array.from({ length: rows }, () => Array(columns).fill(0));
// let orientation = 0;
let klocek, row, column, kolor;
// wszystkieKlocki = [klocki1, klocki2, klocki3, klocki4];
let aktualnyKlocek = null;
let intervalId = null;

function dodajKlocekNaPlansze() {
    const { dane, pozycja, kolor } = aktualnyKlocek;
    const [startRow, startCol] = pozycja;

    for (let i = 0; i < dane.length; i++) {
        for (let j = 0; j < dane[i].length; j++) {
            if (dane[i][j]) {
                const row = startRow + i;
                const col = startCol + j;
                if (row >= 0 && row < rows && col >= 0 && col < columns) {
                    plansza[row][col] = kolor; // Ustaw kolor na planszy
                }
            }
        }
    }
}

function usunPelneWiersze() {
    const nowePlansza = plansza.filter(row => row.includes(0));
    const liczbaUsunietych = plansza.length - nowePlansza.length;

    for (let i = 0; i < liczbaUsunietych; i++) {
        nowePlansza.unshift(Array(columns).fill(0));
    }

    usuniete += liczbaUsunietych;
    plansza = nowePlansza;
}

function rysujPlansze() {
    document.getElementById("klocki").innerHTML = '';

    // Rysowanie planszy
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            if (plansza[i][j]) {
                putpixel(plansza[i][j], j, rows - i); // Przekształć współrzędne na piksele
            }
        }
    }

    // Rysowanie aktualnie spadającego klocka
    const { dane, pozycja, kolor } = aktualnyKlocek;
    const [startRow, startCol] = pozycja;

    for (let i = 0; i < dane.length; i++) {
        for (let j = 0; j < dane[i].length; j++) {
            if (dane[i][j]) {
                const row = startRow + i;
                const col = startCol + j;

                // Rysuj klocek tylko, jeśli mieści się w planszy
                if (row >= 0 && row < rows && col >= 0 && col < columns) {
                    putpixel(kolor, col, rows - row); // Przekształć współrzędne na piksele
                }
            }
        }
    }
}


function czyKolizja(dane, [startRow, startCol]) {
    for (let i = 0; i < dane.length; i++) {
        for (let j = 0; j < dane[i].length; j++) {
            if (dane[i][j]) {
                const row = startRow + i;
                const col = startCol + j;

                if (row >= rows || col < 0 || col >= columns || (row >= 0 && plansza[row][col])) {
                    return true;
                }
            }
        }
    }
    return false;
}


function przesunKlocek(kierunek) {
    const { dane, pozycja } = aktualnyKlocek;
    let [startRow, startCol] = pozycja;

    if (kierunek === 'down') startRow++;
    else if (kierunek === 'left') startCol--;
    else if (kierunek === 'right') startCol++;

    if (!czyKolizja(dane, [startRow, startCol])) {
        aktualnyKlocek.pozycja = [startRow, startCol];
    } else if (kierunek === 'down') {
        dodajKlocekNaPlansze();
        usunPelneWiersze();
        nowyKlocek();
        if (czyKolizja(aktualnyKlocek.dane, aktualnyKlocek.pozycja)) {
            clearInterval(intervalId);
            alert("Game Over!");
        }
    }
}

function obrocKlocek() {
    const { dane, pozycja } = aktualnyKlocek;
    const nowaDane = dane[0].map((_, colIndex) => dane.map(row => row[colIndex]).reverse());

    if (!czyKolizja(nowaDane, pozycja)) {
        aktualnyKlocek.dane = nowaDane;
    }
}

// function wybierzKlocek(pozycja, numerKlocka){
//     const wybranySlownik = wszystkieKlocki[pozycja - 1];
//     const wybranyKlocek = wybranySlownik[`klocek${numerKlocka}`];
//     return wybranyKlocek;
// }


function nowyKlocek() {
    const typKlocka = Math.ceil(Math.random() * 7);
    aktualnyKlocek = {
        dane: klocki[`klocek${typKlocka}`],
        pozycja: [-4, Math.floor(columns / 2) - 2], // Startowa pozycja w górnym środku planszy
        kolor: kolory[typKlocka - 1]
    };
}

function startgame(){

    nowyKlocek();
    intervalId = setInterval(() => {
        przesunKlocek('down');
        rysujPlansze();
    }, 500/(1+usuniete*0.2));

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') przesunKlocek('left');
        else if (event.key === 'ArrowRight') przesunKlocek('right');
        else if (event.key === 'ArrowDown') przesunKlocek('down');
        else if (event.key === ' ') obrocKlocek();
        rysujPlansze();
    });

}
// funkcja uzupełnia jedno pole planszy. Teraz łatwo można stworzyć funkcję rebuild(), która zbuduje wygląd planszy na podstawie zawartości tablicy plansza
function putpixel(color,x,y){
    document.getElementById("klocki").innerHTML += `<img src="images/square_${color}.png" style="width: 5vh; left: calc(${(x)*5}vh + 50vw - 25vh); z-index: 2; position: fixed; bottom: ${y*5-5}vh" />`
}


<<<<<<< HEAD
// function refresh_board(board) {
//     document.getElementById("klocki").innerHTML = ''
//     for (let y = 0; y < board.length; y++) {
//         for (let x = 0; x < board[y].length; x++) {
//             if (board[y][x]) { // Sprawdzenie, czy pole nie jest puste
//                 putpixel(board[y][x], x, 20 - y); // Przeliczenie współrzędnych
//             }
//         }
//     }
// }
=======
function dodajXP(XP){
    if (getSessionData('login')){
    exec_py('dodajXP', getSessionData('login'), XP).then(result => { console.log(result); });

    }
}
//Sztuczne logowanie
saveSessionData('login','Piotr')
>>>>>>> 90dff702b9e746269905136eb37a54f6f053bdbc
