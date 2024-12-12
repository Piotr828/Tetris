import webview


def main():
    with open('api.js', 'w') as file:
        file.write("var pyvars = {}\n")
    webview.create_window('Tetris', "index.html")
    import main
    webview.start()
    import preend
    import end
    with open('api.js', 'w') as file:
        file.write("")
# Punkt startowy
if __name__ == "__main__":
    main()