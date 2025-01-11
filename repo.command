#!/bin/bash

# Upewnij się, że skrypt działa w katalogu z repozytorium Git
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo "To nie jest katalog repozytorium Git. Przerwano."
    exit 1
fi

# Pobierz hash commita od użytkownika
read -p "Podaj hash commita, który chcesz zsquashować: " commit_hash

# Sprawdź, czy commit_hash jest prawidłowy
if ! git cat-file -e "$commit_hash" 2>/dev/null; then
    echo "Podany hash $commit_hash nie istnieje w repozytorium."
    exit 1
fi

# Znajdź ostatni commit przed podanym
base_commit=$(git rev-list --topo-order HEAD | grep -B1 "$commit_hash" | head -n1)

# Jeśli base_commit nie został znaleziony, wyjdź
if [ -z "$base_commit" ]; then
    echo "Nie można znaleźć commita bazowego. Przerwano."
    exit 1
fi

# Przeprowadź rebase interaktywny z squashowaniem
GIT_SEQUENCE_EDITOR="sed -i '' '/^pick $commit_hash/ s/^pick/squash/'" git rebase -i "$base_commit"

# Sprawdź, czy rebase się powiódł
if [ $? -eq 0 ]; then
    echo "Commit $commit_hash został zsquashowany pomyślnie!"
else
    echo "Wystąpił błąd podczas rebase. Proszę sprawdzić logi."
fi
