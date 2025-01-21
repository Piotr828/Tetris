from pydub.generators import Sine
from pydub import AudioSegment

def generate_tada():
    # Generowanie tonów dla "ta-da!" w szybkim tempie
    tone1 = Sine(349).to_audio_segment(duration=125)  # A4
    tone2 = Sine(466).to_audio_segment(duration=125)  # C#5
    tone3 = Sine(587).to_audio_segment(duration=125)  # E5
    tone4 = Sine(587).to_audio_segment(duration=500)  # E5

    # Łączenie tonów w jeden dźwięk (szybkie "ta-da!")
    tada = tone1 + tone2 + tone3 + tone1 + tone2 + tone4

    # Dodanie krótkiej przerwy na koniec, aby nie brzmiało to zbyt ciągle
    silence = AudioSegment.silent(duration=200)  # 200 ms przerwy na koniec

    # Łączymy wszystko razem
    tada = tada + silence

    return tada

# Zapisanie dźwięku do pliku
def save_tada():
    tada = generate_tada()
    tada.export("fanfare.wav", format="wav")
    print("Tada sound has been saved as tada.wav")

# Uruchomienie generowania "ta-da!"
save_tada()