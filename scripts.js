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
let orientation = 0;
let klocek, row, column, kolor;
// const wszystkieKlocki = [klocki1, klocki2, klocki3, klocki4];


function dodajKlocekNaPlansze(plansza, klocek, startRow, startCol) { // dodanie klocka na plansze, gdzie zaczyna sie jego pozycja na startRow i startCol
    for (let i = 0; i < klocek.length; i++) {
        for (let j = 0; j < klocek[i].length; j++) {
            if (klocek[i][j]) {
                const row = startRow + i;
                const col = startCol + j;
                if (row >= 0 && row < plansza.length && col >= 0 && col < plansza[0].length) {
                    plansza[row+6][col] = kolor;
                }
            }
        }
    }
}

function usunPelneWiersze(plansza) { // usuwa wiersze gdzie sa same 1 i dodaje z 0 na górze
    const noweWiersze = plansza.filter(row => row.includes(0));
    while (noweWiersze.length < plansza.length) {
        usuniete++;
        noweWiersze.unshift(Array(plansza[0].length).fill(0));
    }
    return noweWiersze;
}

function szerokosc(T) {
    let left = T[0].length;  // Inicjalizujemy lewe ograniczenie jako liczbę kolumn
    let right = -1;  // Inicjalizujemy prawe ograniczenie jako -1

    // Przechodzimy przez całą tablicę i szukamy pierwszej i ostatniej kolumny z danymi
    for (let i = 0; i < T.length; i++) {
        for (let j = 0; j < T[i].length; j++) {
        if (T[i][j] !== null && T[i][j] !== undefined && T[i][j] !== ''&& T[i][j] !== 0) {
            left = Math.min(left, j); // Pierwsza kolumna z danymi
            right = Math.max(right, j); // Ostatnia kolumna z danymi
        }
        }
    }

    // Jeśli nie znaleziono żadnych danych, zwracamy 0
    if (right === -1) return 0;

    // Liczymy liczbę kolumn między pierwszą a ostatnią kolumną z danymi
    return right - left + 1;
}

function rysujKlocek(klocek, kolor, column, row) {
    const nr = parseInt(Object.values(klocki).indexOf(klocek)) + 1;
    const margin = 5 * column - 15;
    const height = 5* row;
    let deg = (90*orientation)%360 + 'deg'
    document.getElementById("p_cont").innerHTML =
        `<img style="transform-origin: ${origins[nr]};bottom: ${height}vh; position: relative; left:${margin}vh; transform: rotate(${deg})" 
        class="klocek_menu" src="images/Tetr${nr}_${kolor}.png">`;
}


function przesunKlocek(kierunek) {
    if (kierunek === 'left' && column > 0  && row > -12) column--;
    if (kierunek === 'right' && column < 10 - szerokosc(klocek) && row > -12) column++;
    if (kierunek === 'down' && row > -10) {row--;}
    else if (kierunek === 'down' && row > -12) {row = -12;}
    if (kierunek === 'drop' && row > -12) row-= (1+usuniete*0.18)*1/60;
    rysujKlocek(klocek, kolor, column, row);
}

function obrocKlocek(kierunek) {
    if (row <= -12) return;
    orientation = (orientation + kierunek + 4) % 4;
    klocek = wszystkieKlocki[orientation][`klocek${Object.keys(klocki).indexOf(klocek) + 1}`];
    rysujKlocek(klocek, kolor, column, row);
}


function wybierzKlocek(pozycja, numerKlocka){
    const wybranySlownik = wszystkieKlocki[pozycja - 1];
    const wybranyKlocek = wybranySlownik[`klocek${numerKlocka}`];
    return wybranyKlocek;
}

function nowyKlocek() {
    klocek = klocki['klocek'+Math.ceil(Math.random()*7)];
    row = 9;
    column = Math.floor(Math.floor(Math.random()*(11-szerokosc(klocek))) );
    kolor = kolory[Math.floor(Math.random()*kolory.length)];
    rysujKlocek(klocek, kolor, column, row);
}



function czyKlocekMozeOpadac(plansza, klocek, startRow, startCol) { return row > -12
    startRow += 12
    for (let i = 0; i < klocek.length; i++) {
        for (let j = 0; j < klocek[i].length; j++) {
            if (klocek[i][j]) {
                const newRow = startRow + i + 1;
                const newCol = startCol + j;
                if (newRow >= plansza.length || plansza[newRow][newCol]) {
                    return false; // Nie może opadać
                }
            }
        }
    }
}



function startgame(){
    nowyKlocek();

    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowRight' || event.key === 'd') przesunKlocek('right');
        else if (event.key === 'ArrowLeft' || event.key === 'a') przesunKlocek('left');
        else if (event.key === 'ArrowDown' || event.key === 's' || event.key === ' ') przesunKlocek('down');
        else if (event.key === 'e' || event.key === '.' ) obrocKlocek(1);
        else if (event.key === 'q' || event.key === ',') obrocKlocek(-1);

    });

    intervalId = setInterval(() => {
        if (czyKlocekMozeOpadac(plansza, klocek, Math.floor(row+22), column)) {
            przesunKlocek('drop');
        } else {
            dodajKlocekNaPlansze(plansza, klocek, Math.floor(row+22), column);
            plansza = usunPelneWiersze(plansza);
            refresh_board(plansza)
            nowyKlocek();
        }
    }, 17);
}
// funkcja uzupełnia jedno pole planszy. Teraz łatwo można stworzyć funkcję rebuild(), która zbuduje wygląd planszy na podstawie zawartości tablicy plansza
function putpixel(color,x,y){
    document.getElementById("klocki").innerHTML += `<img src="images/square_${color}.png" style="width: 5vh; left: calc(${(x)*5}vh + 50vw - 25vh); z-index: 2; position: fixed; bottom: ${y*5-5}vh" />`
}


function refresh_board(board) {
    document.getElementById("klocki").innerHTML = ''
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            if (board[y][x]) { // Sprawdzenie, czy pole nie jest puste
                putpixel(board[y][x], x, 20 - y); // Przeliczenie współrzędnych
            }
        }
    }
}
