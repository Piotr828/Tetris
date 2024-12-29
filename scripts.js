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
        [0, 1, 0, 0],
    ],
    klocek7: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 0],
        [1, 0, 0, 0],
    ],
};
const kolory = ['blue','green','orange','purple','yellow','red','blue2']
kolor = kolory[Math.floor(Math.random()*kolory.length)]
let row = 0; // wiersz klocka
 // kolumna klocka
let klocek = klocki['klocek'+Math.ceil(Math.random()*7)]
const rows = 20;
const columns = 10;
let plansza = Array.from({ length: rows }, () => Array(columns).fill(0));

let column = Math.floor(Math.floor(Math.random()*(10-szerokosc(klocek))) )

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


function startgame(){
    document.addEventListener('keydown', function(event) {
        // Sprawdzanie naciśnięcia strzałki w prawo lub 'd'
        if (event.key === 'ArrowRight' || event.key === 'd') {
            console.log('Strzałka w prawo lub d');
            if(column < 10 - szerokosc(klocek)){
                column += 1;
            }
 let nr = parseInt(Object.values(klocki).indexOf(klocek))
                nr++
                let margin = 5*parseInt(column)-15
            document.getElementById("main").innerHTML = '<img style="bottom: 0vh; position: relative; left:'+margin+'vh" class="klocek_menu" src="images/Tetr'+nr+ '_' +kolor+ '.png">';        }

        // Sprawdzanie naciśnięcia strzałki w lewo lub 'a'
        else if (event.key === 'ArrowLeft' || event.key === 'a') {
            console.log('Strzałka w lewo lub a');
            if(column > 0){
                column -= 1;
            }
 let nr = parseInt(Object.values(klocki).indexOf(klocek))
                nr++
                let margin = 5*parseInt(column)-15
            document.getElementById("main").innerHTML = '<img style="bottom: 0vh; position: relative; left:'+margin+'vh" class="klocek_menu" src="images/Tetr'+nr+ '_' +kolor+ '.png">';        }

        // Sprawdzanie naciśnięcia strzałki w dół, 's' lub spacji
        else if (event.key === 'ArrowDown' || event.key === 's' || event.key === ' ') {
            console.log('Strzałka w dół, s lub spacja');
            if(row < 20){
                let nr = parseInt(Object.values(klocki).indexOf(klocek))
                nr++
                let margin = 5*parseInt(column)-15
            document.getElementById("main").innerHTML = '<img style="bottom: 0vh; position: relative; left:'+margin+'vh" class="klocek_menu" src="images/Tetr'+nr+ '_' +kolor+ '.png">';
            }
        }
    });
}
