import webview


with open('api.js', 'w') as file:
    file.write("var pyvars = {}\n")
webview.create_window('Projekt', "index.html")
import main
webview.start()
import preend
import end
with open('api.js', 'w') as file:
    file.write("")