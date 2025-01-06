function exec_py(functionName, ...args) {return window.pywebview.api.call_function(functionName, args).then(response => {return response;});}
function reloadCSS() {
    if (document.getElementById('toreload')) { // Sprawdzamy, czy minęło 8 sekund
        document.getElementById('toreload').href = document.getElementById('toreload').href + "?v="+currentTime
    }
}
window.addEventListener('resize', () => {

  window.addEventListener('resize', () => {
    // HTML dla alertu i tła
    const alertHTML = `
    <div id="alert-overlay">
        <style>
            #alert-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9); /* Półprzezroczyste tło */
                backdrop-filter: blur(80px); /* Efekt rozmycia */
                z-index: 999; /* Pod alertem, ale nad stroną */
            }

            .alert {
                border-radius: 10px;
                padding: 15px;
                margin: 0;
                max-width: 400px;
                text-align: center;
                font-size: 1.1em;
                font-weight: bold;
                box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
                transition: transform 0.2s ease-in-out;
                position: fixed;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                width: 50vw;
                background-color: #ffebee;
                color: #c62828;
                border: 2px solid #ef9a9a;
                z-index: 1000; /* Nad overlayem */
                font-family: Arial;
            }
        </style>
        <div id="alert">
            <div class="alert error-alert">Błąd: Wysokość okna nie może być większa niż dwukrotność jego szerokości!</div>
        </div>
    </div>
    `;

    // Pobranie aktualnej szerokości i wysokości okna
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Sprawdzenie warunku: wysokość > 2 * szerokość
    if (height > 2 * width) {
        // Dodanie alertu i tła, jeśli jeszcze nie istnieją
        if (!document.getElementById('alert-overlay')) {
            document.body.insertAdjacentHTML('beforeend', alertHTML);
        }
    } else {
        // Usunięcie alertu i tła
        const overlayElement = document.getElementById('alert-overlay');
        if (overlayElement) {
            overlayElement.remove();
        }
    }
});








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
