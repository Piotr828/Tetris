import webview
import importlib

# Dynamiczne załadowanie funkcji z api.py
api_module = importlib.import_module('main')

# Klasa API do obsługi wywołań z JavaScript
class API:
    def call_function(self, function_name, args):
        # Pobierz funkcję z zaimportowanego modułu
        func = getattr(api_module, function_name, None)
        if func:
            return func(*args)  # Wywołanie funkcji z argumentami
    
api_instance = API()

webview.create_window('WebView Example', 'index.html', js_api=api_instance)
webview.start()
