function exec_py(functionName, ...args) {return window.pywebview.api.call_function(functionName, args).then(response => {return response;});}
function reloadCSS() {
    if (document.getElementById('toreload')) { // Sprawdzamy, czy minęło 8 sekund
        document.getElementById('toreload').href = document.getElementById('toreload').href + "?v="+currentTime
    }
}
window.addEventListener('resize', () => {
  const html = document.documentElement;

  // Pobranie aktualnej szerokości i wysokości okna
  const width = window.innerWidth;
  const height = window.innerHeight;
  // Sprawdzenie warunku: wysokość > 2 * szerokość
  if (height > 2 * width) {
    html.style.filter = 'blur(50px)';
    document.getElementById('main_js').style.filter = 'blor(50px)';
    document.getElementById('main_js').style.display = 'none';

  } else {
    html.style.filter = 'none'; // Usunięcie efektu blur
          document.getElementById('main_js').style.display = 'block';

  }
});

// Wywołanie event listenera na start (aby sprawdzić aktualny stan okna)
window.dispatchEvent(new Event('resize'));


window.addEventListener('resize', function() {
    if(navigator.userAgent[0] == 'M'){
    reloadCSS()
        }
});
window.addEventListener('keydown', function(event) {
  // Sprawdź, czy zdarzenie nie pochodzi z pola tekstowego
  const activeElement = document.activeElement;
  const isEditable = activeElement.tagName === 'INPUT' ||
                     activeElement.tagName === 'TEXTAREA' ||
                     activeElement.isContentEditable;

  if (!isEditable && event.key === 'Backspace') {
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
