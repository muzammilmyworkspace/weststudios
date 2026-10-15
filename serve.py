# Local preview server that never lets the browser reuse stale files.
import sys
# Run from this folder:  python serve.py   then open http://127.0.0.1:8877
import http.server, functools, os

class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Expires', '0')
        super().end_headers()

os.chdir(os.path.dirname(os.path.abspath(__file__)))
print('Open http://127.0.0.1:%s  (Ctrl+C to stop)' % (sys.argv[1] if len(sys.argv) > 1 else 8877))
import sys
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8877
http.server.ThreadingHTTPServer(('127.0.0.1', PORT), NoCache).serve_forever()
