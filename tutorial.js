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
let stopped = 0
// zmienna przechowująca liczbę usuniętych wierszy; potrzebna do liczenia XP oraz prędkości upadku
let usuniete = 0;
const kolory = ['blue','green','orange','purple','yellow','red','blue2'];

const rows = 20;
const columns = 10;
let plansza = Array.from({ length: rows }, () => Array(columns).fill(0));
let row, column;
let aktualnyKlocek = null;
let intervalId = null;
let paused = false
// dodaje klocek na plansze, iterujr przez jego macież i dla każdej 1 dodaje do planszy kolor klocka
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

// funkcja usuwajaca pelne wiersze
function usunPelneWiersze() {
    const nowePlansza = plansza.filter(row => row.includes(0)); // zmiennna przechowujaca niepelne wiersze
    const liczbaUsunietych = plansza.length - nowePlansza.length;

    for (let i = 0; i < liczbaUsunietych; i++) { // dodanie wierszy z samymi 0, aby dopełnić róznicę po usunięciu pełnych
        nowePlansza.unshift(Array(columns).fill(0));
    }

    usuniete += liczbaUsunietych; // dodajemy wartość usuniętych do naszej głównej zmiennnej usuniete
    plansza = nowePlansza; // zmiana planszy na nowa bez pełnyh wierszy
}

// renderuje plansze i aktualny klocek
function rysujPlansze() {
    document.getElementById("klocki").innerHTML = '';

    // rysuje plansze
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            if (plansza[i][j]) {
                putpixel(plansza[i][j], j, rows - i); // przekształca współrzędne na piksele
            }
        }
    }

    // rysuje proces spadania aktualnie spadającego klocka
    const { dane, pozycja, kolor } = aktualnyKlocek;
    const [startRow, startCol] = pozycja;

    for (let i = 0; i < dane.length; i++) {
        for (let j = 0; j < dane[i].length; j++) {
            if (dane[i][j]) {
                const row = startRow + i;
                const col = startCol + j;

                // rysuj klocek tylko jeśli mieści się w planszy
                if (row >= 0 && row < rows && col >= 0 && col < columns) {
                    putpixel(kolor, col, rows - row); // przekształca współrzędne na piksele
                }
            }
        }
    }
}

// sprawdza czy klocek zderza sie z czyms
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

// funkjca przesuwajaca klocek
function przesunKlocek(kierunek) {
    const { dane, pozycja } = aktualnyKlocek;
    let [startRow, startCol] = pozycja;

    if (kierunek === 'down') startRow++;
    else if (kierunek === 'left') startCol--;
    else if (kierunek === 'right') startCol++;

    if (!czyKolizja(dane, [startRow, startCol])) {
        aktualnyKlocek.pozycja = [startRow, startCol]; // jesli nie ma kolizji zmienia jego pozycje
    } else if (kierunek === 'down') { // jesli jest kolizja przy ruchu w dół
        dodajKlocekNaPlansze(); // dodaje go na plansze
        usunPelneWiersze(); // usuwa pelne wiersze
        nowyKlocek(); // generuje nowy klocekl

    }
}

// robi rotacje klocka
function obrocKlocek() {
    const { dane, pozycja } = aktualnyKlocek;
    const nowaDane = dane[0].map((_, colIndex) => dane.map(row => row[colIndex]).reverse()); // tworzy nowa macierz

    if (!czyKolizja(nowaDane, pozycja)) { // jesli nie ma kolizji obraca klocek
        aktualnyKlocek.dane = nowaDane;
    }
}

// wybiera losowy klocek i ustawia go na górze
function nowyKlocek() {
          if (plansza[0].some(function(x){return !!x})) { // jezeli ma kolizje na poczatku planszy, czyli jak przgrywamy
            clearInterval(intervalId); // to konczy gre
            game_over();
            //window.location = 'index.html'
        }
           if(paused){stopped = 1;
           document.getElementById('klocki').style.display = 'none'
                          document.getElementById('pauza').style.display = 'block'

           }
           else{
               stopped = 0;
               document.getElementById('klocki').style.display = 'inline-block'
                          document.getElementById('pauza').style.display = 'none'

    const typKlocka = Math.ceil(Math.random() * 7);
    aktualnyKlocek = {
        dane: klocki[`klocek${typKlocka}`],
        pozycja: [-4, Math.floor(columns / 2) - 2], // startowa pozycja
        kolor: kolory[typKlocka - 1] // (tutaj można zmienić żeby kolor był random)
    };
}}

let gameStarted = false; // flaga do kontroli stanu gry


// funkcja startująca grę
function startGame() {
    if (gameStarted) return; // Jeśli gra już działa, ignoruj
    gameStarted = true;

    // ukryj przycisk "ROZPOCZNIJ" i pokaż planszę
    document.getElementById('start-btn').style.display = 'none';
    document.getElementById('restart-btn').style.display = 'none';
    document.getElementById('klocki').style.display = 'block';

    // zainicjuj pierwszy klocek i rozpocznij grę
    nowyKlocek();
    intervalId = setInterval(() => {
        przesunKlocek('down');
        rysujPlansze();
    }, 1000); // czas spadania klocków
}

// funkcja restartująca grę
function restartGame() {
    clearInterval(intervalId); // zatrzymaj bieżący interwał
    plansza = Array.from({ length: rows }, () => Array(columns).fill(0)); // wyczyść planszę
    usuniete = 0; // zresetuj licznik usuniętych wierszy
    gameStarted = false; // zresetuj flagę gry
    rysujPlansze(); // wyczyść ekran

    // pokaż przycisk startu
    document.getElementById('restart-btn').style.display = 'none';
    document.getElementById('start-btn').style.display = 'inline-block';
}

// funkcja kończąca grę
function game_over() {
    clearInterval(intervalId); // zatrzymaj interwał
    gameStarted = false; // zresetuj flagę gry
    let punkty = Math.ceil(5 * usuniete + 6 * Math.sqrt(usuniete));

    // wyświetl komunikat końca gry i pokaż przycisk restartu
    alert(`Koniec gry! Usunięte wiersze: ${usuniete}, Punkty: ${punkty}`);
    document.getElementById('restart-btn').style.display = 'inline-block';
    document.getElementById('start-btn').style.display = 'none';
}

// podłącz zdarzenia do przycisków
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('restart-btn').addEventListener('click', restartGame);
});


// funkcja uzupełnia jedno pole planszy. Teraz łatwo można stworzyć funkcję rebuild(), która zbuduje wygląd planszy na podstawie zawartości tablicy plansza
function putpixel(color,x,y){
    document.getElementById("klocki").innerHTML += `<img alt = 'Error' src="images/square_${color}.png" style="width: 5vh; left: calc(${(x)*5}vh + 50vw - 25vh); z-index: 2; position: fixed; bottom: ${y*5-5}vh" />`
}

function dodajXP(XP){
    if (getSessionData('login')){
    exec_py('dodajXP', getSessionData('login'), XP).then(result => { console.log(result); });

    }
}
//Sztuczne logowanie
function game_over(){
    let punkty = Math.ceil(5*usuniete + 6*Math.sqrt(usuniete));
    exec_py('dodajXP', getSessionData('login'),punkty)
document.body.innerHTML = `
</head>
<body>
    <div class="alert summary-alert">
        <center><div class="summary-title">Koniec gry!</div></center>
        <span><strong>Usunięte wiersze:</strong> ${usuniete}</span>
        <span><strong>Punkty:</strong> ${punkty} </span>
        <div class="buttons">
            <button class="menu-button" onclick="window.location='index.html'">Powrót do menu</button>
            <button class="play-button" onclick="window.location.reload();">Zagraj ponownie</button>
        </div>
    </div>
`
}
// system pauzy
document.addEventListener('keydown', (event) => {
    if (event.key === 'p' || event.key === 'P'){
paused = !paused
    if (stopped && paused){
        stopped = !stopped
    }}
});
setMusicVolume()