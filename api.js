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