"""
Railway hosting uchun statik fayl serveri.
PORT muhit o'zgaruvchisini o'qib, Railway'ga moslashadi.
"""
import http.server
import socketserver
import os
import sys

PORT = int(os.environ.get("PORT", 8000))

class StaticHandler(http.server.SimpleHTTPRequestHandler):
    """Statik fayllarni xizmat qiluvchi handler."""

    def end_headers(self):
        # Kesh va CORS sozlamalari
        self.send_header("Cache-Control", "public, max-age=86400")
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

    def log_message(self, format, *args):
        # Railway loglarida faqat muhim xabarlar
        print(f"[{self.address_string()}] {format % args}", flush=True)

    def do_GET(self):
        # Ildiz so'rovi index.html'ga yo'naltirish
        if self.path == "/":
            self.path = "/index.html"
        return super().do_GET()


def run():
    # Railway PORT bo'lmasa 0.0.0.0 eshitadi
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("0.0.0.0", PORT), StaticHandler) as httpd:
        print(f"=== Qo'lyozma Studio Server ===", flush=True)
        print(f"  Listening on port: {PORT}", flush=True)
        print(f"  Serving from: {os.getcwd()}", flush=True)
        httpd.serve_forever()


if __name__ == "__main__":
    try:
        run()
    except KeyboardInterrupt:
        print("\nServer stopped.", flush=True)
        sys.exit(0)
