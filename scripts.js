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
const matrix = document.getElementById("main_js");
const kolory = ['blue','green','orange','purple','yellow','red','blue2'];

const rows = 20;
const columns = 10;
let plansza = Array.from({ length: rows }, () => Array(columns).fill(0));
let orientation = 0;
let klocek, row, column, kolor;
const wszystkieKlocki = [klocki1, klocki2, klocki3, klocki4]


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

function usunPelneWiersze(plansza) { // usuwa wiersze gdzie sa same 1 i dodaje z 0 na górze
    const noweWiersze = plansza.filter(row => row.includes(0));
    while (noweWiersze.length < plansza.length) {
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
    const height = 5* row + 15;
    let deg = (90*orientation)%360 + 'deg'
    document.getElementById("p_cont").innerHTML =
        `<img style="transform-origin: center; ;bottom: ${height}vh; position: relative; left:${margin}vh; transform: rotate(${deg})" 
        class="klocek_menu" src="images/Tetr${nr}_${kolor}.png">`;
}


function przesunKlocek(kierunek) {
    if (kierunek === 'left' && column > 0  && row > -11) column--;
    if (kierunek === 'right' && column < 10 - szerokosc(klocek) && row > -11) column++;
    if (kierunek === 'down' && row > -10) {row--;}
    else if (kierunek === 'down' && row > -11) {row = -11;}
    if (kierunek === 'drop' && row > -11) row-= (1+usuniete*0.18)*1/60;
    rysujKlocek(klocek, kolor, column, row);
}
klocek_clone = klocek
async function obrocKlocek(kierunek) {
    if (row <= -11)
        return 0;
    orientation += kierunek;  // Zmieniamy orientation po zakończeniu obrotu
    // Używamy await, żeby poczekać na wynik funkcji exec_py
    let nowe = await exec_py('rotate', klocek_clone, kierunek);
// klocek = nowe;  // Przypisujemy wynik zwrócony przez exec_py do zmiennej klocek
console.log(nowe)
}

function wybierzKlocek(pozycja, numerKlocka){
    const wybranySlownik = wszystkieKlocki[pozycja - 1];
    const wybranyKlocek = wybranySlownik[`klocek${numerKlocka}`];
    return wybranyKlocek;
}

let klocekDoPlanszy;

function startgame(){
    let pozycja = 1;
    klocek = klocki['klocek'+Math.ceil(Math.random()*7)];
    numerKlocka = Math.ceil(Math.random()*7);
    //klocekDoPlanszy = wybierzKlocek(pozycja, numerKlocka);
    row = 9;
    column = Math.floor(Math.floor(Math.random()*(10-szerokosc(klocek))) );
    kolor = kolory[Math.floor(Math.random()*kolory.length)];
    rysujKlocek(klocek, kolor, column, row);

    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowRight' || event.key === 'd') przesunKlocek('right');
        else if (event.key === 'ArrowLeft' || event.key === 'a') przesunKlocek('left');
        else if (event.key === 'ArrowDown' || event.key === 's' || event.key === ' ') przesunKlocek('down');
        else if (event.key === 'e' || event.key === '.' ) obrocKlocek(1);
        else if (event.key === 'q' || event.key === ',') obrocKlocek(-1);

    });

    intervalId = setInterval(() => {
        przesunKlocek('drop');
        if (row < -11){clearInterval(intervalId)}
    }, 17);


}
// funkcja uzupełnia jedno pole planszy. Teraz łatwo można stworzyć funkcję rebuild(), która zbuduje wygląd planszy na podstawie zawartości tablicy plansza
function putpixel(color,x,y){
    document.getElementById("main_js").innerHTML += `<img src="images/square_${color}.png" style="width: 5vh; left: calc(${(x-6)*5}vh + 50vw); z-index: 2; position: fixed; bottom: ${y*5-5}vh" />`
}

