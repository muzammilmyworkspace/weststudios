# Local preview server that never lets the browser reuse stale files.
# Run from this folder:  python serve.py   then open http://127.0.0.1:8877
import http.server, functools, os

class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Expires', '0')
        super().end_headers()

os.chdir(os.path.dirname(os.path.abspath(__file__)))
print('Open http://127.0.0.1:8877  (Ctrl+C to stop)')
http.server.ThreadingHTTPServer(('127.0.0.1', 8877), NoCache).serve_forever()
