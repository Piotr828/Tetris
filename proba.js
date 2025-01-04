// const klocki = {
//     klocek1: [
//         [0, 0, 0, 0],
//         [0, 0, 0, 0],
//         [1, 0, 0, 0],
//         [1, 1, 1, 0],
//     ],
//     klocek2: [
//         [0, 0, 0, 0],
//         [0, 0, 0, 0],
//         [1, 1, 0, 0],
//         [0, 1, 1, 0],
//     ],
//     klocek3: [
//         [1, 0, 0, 0],
//         [1, 0, 0, 0],
//         [1, 0, 0, 0],
//         [1, 0, 0, 0],
//     ],
//     klocek4: [
//         [0, 0, 0, 0],
//         [0, 0, 0, 0],
//         [1, 1, 1, 0],
//         [0, 1, 0, 0],
//     ],
//     klocek5: [
//         [0, 0, 0, 0],
//         [0, 0, 0, 0],
//         [1, 1, 0, 0],
//         [1, 1, 0, 0],
//     ],
//     klocek6: [
//         [0, 0, 0, 0],
//         [1, 0, 0, 0],
//         [1, 1, 0, 0],
//         [0, 1, 0, 0]
//     ],
//     klocek7: [
//         [0, 0, 0, 0],
//         [0, 0, 0, 0],
//         [1, 1, 1, 0],
//         [1, 0, 0, 0]
//     ]
// };

const plansze = Array(20).fill(null).map(() => Array(10).fill(0)); // 20x10 pusta plansze
let aktualnyKlocek = null;

// Funkcja generująca nowy klocek
function nowyKloce() {
    const typKlocka = Math.floor(Math.random() * 2) + 1; // Losowy klocek (1-2)
    aktualnyKlocek = {
        typ: `klocek${typKlocka}`,
        dane: klocki[`klocek${typKlocka}`],
        pozycja: [0, Math.floor(plansze[0].length / 2) - 2], // Startowa pozycja
    };
}

// Funkcja sprawdzająca kolizję
function sprawdzKolizj(klocek, plansze, pozycjaX, pozycjaY) {
    for (let i = 0; i < klocek.length; i++) {
        for (let j = 0; j < klocek[i].length; j++) {
            if (klocek[i][j] === 1) {
                const x = pozycjaX + j;
                const y = pozycjaY + i;
                if (y >= plansze.length || x < 0 || x >= plansze[0].length || plansze[y][x] === 1) {
                    return true; // Kolizja z planszą lub innym klockiem
                }
            }
        }
    }
    return false;
}

// Funkcja dodająca klocek do planszy
function dodajKlocekDoPlansz(klocek, plansze, pozycjaX, pozycjaY) {
    for (let i = 0; i < klocek.length; i++) {
        for (let j = 0; j < klocek[i].length; j++) {
            if (klocek[i][j] === 1) {
                const x = pozycjaX + j;
                const y = pozycjaY + i;
                plansze[y][x] = 1; // Zapisanie klocka na planszy
            }
        }
    }
}

// Funkcja sprawdzająca i usuwająca pełne wiersze
function sprawdzWiersz(plansze) {
    for (let y = plansze.length - 1; y >= 0; y--) {
        if (plansze[y].every(cell => cell === 1)) {
            plansze.splice(y, 1); // Usunięcie pełnego wiersza
            plansze.unshift(new Array(plansze[0].length).fill(0)); // Dodanie pustego wiersza na górze
        }
    }
}

function rysujNaPlanszy(klocek, x, y) {
    // Tworzy kopię planszy, aby nie modyfikować oryginału w trakcie
    const nowaplansze = plansze.map(rzad => [...rzad]);

    klocek.forEach((wiersz, i) => {
        wiersz.forEach((komorka, j) => {
            if (komorka !== 0) { // Tylko jeśli komórka klocka jest zajęta
                nowaplansze[y + i][x + j] = komorka;
            }
        });
    });

    return nowaplansze; // Zwraca zmodyfikowaną planszę
}

function przesunKlocek(x, y) {
    const nowaPozycjaX = aktualnyKlocek.pozycja[0] + x;
    const nowaPozycjaY = aktualnyKlocek.pozycja[1] + y;

    if (!sprawdzKolizje(aktualnyKlocek.dane, nowaPozycjaY, nowaPozycjaX)) {
        aktualnyKlocek.pozycja = [nowaPozycjaX, nowaPozycjaY];
        plansze = rysujNaPlanszy(aktualnyKlocek.dane, nowaPozycjaX, nowaPozycjaY);
    }
}

function pokazPlansze() {
    console.clear();
    console.log(plansze.map(rzad => rzad.join(' ')).join('\n'));
}

function pętlaGry() {
    setInterval(() => {
        przesunKlocek(0, 1); // Przesuń klocek w dół
        pokazPlansze();      // Pokaż aktualny stan planszy
    }, 500); // Co 500 ms
}


// Funkcja aktualizująca grę
function aktualizujGr() {
    if (!sprawdzKolizj(aktualnyKlocek.dane, plansze, aktualnyKlocek.pozycja[1], aktualnyKlocek.pozycja[0] + 1)) {
        // Klocek może spadać
        aktualnyKlocek.pozycja[0]++;
    } else {
        // Klocek osiągnął dno lub przeszkodę
        dodajKlocekDoPlansz(aktualnyKlocek.dane, plansze, aktualnyKlocek.pozycja[1], aktualnyKlocek.pozycja[0]);
        sprawdzWiersz(plansze); // Usuwanie pełnych wierszy
        nowyKloce(); // Generowanie nowego klocka
    }
    rysujPlansz(); // Odświeżenie widoku planszy
}

// Funkcja rysująca planszę (konsolowe wyświetlenie przykładowe)
function rysujPlansz() {
    console.clear();
    const kopiaPlanszy = plansze.map(wiersz => [...wiersz]);
    // Rysowanie aktualnego klocka na kopii planszy
    for (let i = 0; i < aktualnyKlocek.dane.length; i++) {
        for (let j = 0; j < aktualnyKlocek.dane[i].length; j++) {
            if (aktualnyKlocek.dane[i][j] === 1) {
                const x = aktualnyKlocek.pozycja[1] + j;
                const y = aktualnyKlocek.pozycja[0] + i;
                if (y >= 0 && y < kopiaPlanszy.length && x >= 0 && x < kopiaPlanszy[0].length) {
                    kopiaPlanszy[y][x] = 1;
                }
            }
        }
    }
    console.log(kopiaPlanszy.map(wiersz => wiersz.join(' ')).join('\n'));
}

// Rozpoczęcie gry
nowyKloce();
setInterval(aktualizujGr, 500); // Aktualizowanie gry co 500ms