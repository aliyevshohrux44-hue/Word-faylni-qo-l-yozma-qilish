import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Cache-control va CORS sozlamalari
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def run():
    # Joriy fayl joylashgan papkaga o'tish
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    port = PORT
    while port < 8050:
        try:
            with socketserver.TCPServer(("", port), Handler) as httpd:
                url = f"http://localhost:{port}/index.html"
                print("=" * 60)
                print("  Qo'lyozma Studio (Handwriting Generator)")
                print(f"  Server ishga tushdi: {url}")
                print("  Brauzer orqali ilova avtomatik ochilmoqda...")
                print("  To'xtatish uchun: Ctrl + C bosing")
                print("=" * 60)
                webbrowser.open(url)
                httpd.serve_forever()
                break
        except OSError:
            port += 1

if __name__ == "__main__":
    try:
        run()
    except KeyboardInterrupt:
        print("\nServer to'xtatildi.")
        sys.exit(0)
