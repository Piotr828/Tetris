setMusicVolume()
function pokaz() {
  exec_py('leaderboard').then(result => {
    const tbody = document.getElementById('ranking');
    tbody.innerHTML = ''; // Wyczyść istniejącą zawartość tabeli

    // Posortowanie tablicy malejąco po wyniku
    result.sort((a, b) => b[1] - a[1]);

    // Dodanie danych do tabeli
    result.forEach((entry, index) => {
      const row = document.createElement('tr'); // Tworzymy nowy wiersz

      // Dodanie komórek do wiersza
      const rankCell = document.createElement('td');
      rankCell.textContent = index + 1; // Numer rankingu (indeks + 1)
      row.appendChild(rankCell);

      const usernameCell = document.createElement('td');
      usernameCell.textContent = entry[0].toUpperCase(); // Nazwa gracza
      row.appendChild(usernameCell);

      const scoreCell = document.createElement('td');
      scoreCell.textContent = entry[1]; // Wynik
      row.appendChild(scoreCell);

      tbody.appendChild(row); // Dodanie wiersza do tabeli
    });
  }).catch(error => {
    console.error('Błąd podczas pobierania wyników:', error);
  });
}

window.addEventListener('load', function() {
  setTimeout(function() {
    document.getElementById('refresh').click();
  }, 5); // 50ms = 0.05s
});