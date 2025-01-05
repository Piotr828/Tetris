function exec_py(functionName, ...args) {return window.pywebview.api.call_function(functionName, args).then(response => {return response;});}
let lastReloadTime = 0; // Zmienna przechowująca czas ostatniego wywołania funkcji
function reloadCSS() {
    const currentTime = new Date().getTime(); // Pobieramy bieżący czas
    if (currentTime - lastReloadTime >= 8000) { // Sprawdzamy, czy minęło 8 sekund
        document.getElementById('toreload').href = document.getElementById('toreload').href + "?v="+currentTime
    }
}


window.addEventListener('resize', function() {
    if(navigator.userAgent[0] == 'M'){
    reloadCSS()
        }
    if(window.innerWidth < window.innerHeight) console.error("Granie w trybie pionowym jest niezalecane")
});
window.addEventListener('keydown', function(event) {
  if (event.key === 'Backspace') {
    event.preventDefault(); // Zapobiega domyślnemu działaniu wstecz
    window.location.href = 'index.html'; // Przenosi do index.html
  }
});
// Funkcja do zapisywania danych do localStorage
function saveSessionData(key, value) {
    // Przechowuje dane jako JSON w localStorage
    let sessionData = localStorage.getItem('sessionData'); // Pobiera obecne dane (jeśli istnieją)
    sessionData = sessionData ? JSON.parse(sessionData) : {}; // Jeśli są, to parsujemy do obiektu, jeśli nie, to tworzymy pusty obiekt
    sessionData[key] = value; // Zapisujemy nową wartość
    localStorage.setItem('sessionData', JSON.stringify(sessionData)); // Zapisujemy zmodyfikowany obiekt
}

function getSessionData(key) {
    let sessionData = localStorage.getItem('sessionData'); // Pobiera dane z localStorage
    if (sessionData) {
        sessionData = JSON.parse(sessionData); // Parsujemy dane do obiektu
        return sessionData[key]; // Zwracamy wartość dla podanego klucza
    }
    return null; // Zwracamy null, jeśli dane nie istnieją
}
