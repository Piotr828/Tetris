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

// zmienna przechowująca liczbę usuniętych wierszy; potrzebna do liczenia XP oraz prędkości upadku
let usuniete = 0;
const kolory = ['blue','green','orange','purple','yellow','red','blue2'];

const rows = 20;
const columns = 10;
let plansza = Array.from({ length: rows }, () => Array(columns).fill(0));
let klocek, row, column, kolor;
let aktualnyKlocek = null;
let intervalId = null;

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
    } else if (kierunek === 'down') { // jesli jest kolizja przy ruchu w dol
        dodajKlocekNaPlansze(); // dodaje go na plansze
        usunPelneWiersze(); // usuwa pelne wiersze
        nowyKlocek(); // generuje nowy klocekl
        if (czyKolizja(aktualnyKlocek.dane, aktualnyKlocek.pozycja)) { // jezeli ma kolizje na poczatku planszy, czyli jak przgrywamy
            clearInterval(intervalId); // to konczy gre
            alert("Game Over!");
        }
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
    const typKlocka = Math.ceil(Math.random() * 7);
    aktualnyKlocek = {
        dane: klocki[`klocek${typKlocka}`],
        pozycja: [-4, Math.floor(columns / 2) - 2], // startowa pozycja
        kolor: kolory[typKlocka - 1] // (tutaj można zmienić żeby kolor był random)
    };
}

function startgame(){
    nowyKlocek();// losuje klocek

    intervalId = setInterval(() => { // uruchamia cyklicznie funkcje
        przesunKlocek('down');
        rysujPlansze();
    }, 500/(1+usuniete*0.2)); // zmiana czasu spadania wraz z poziomem gry (mozna zwiekszyc)

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

function dodajXP(XP){
    if (getSessionData('login')){
    exec_py('dodajXP', getSessionData('login'), XP).then(result => { console.log(result); });

    }
}
//Sztuczne logowanie
saveSessionData('login','Piotr')