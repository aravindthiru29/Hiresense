import os
import sys

# Ensure hiresense-backend directory is on Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
backend_dir = os.path.join(parent_dir, 'hiresense-backend')

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Set serverless environment flags
os.environ.setdefault('VERCEL', '1')
os.environ.setdefault('FLASK_ENV', 'production')

from app import create_app

# Create Flask application instance for Vercel Serverless Function
flask_app = create_app(os.environ.get('FLASK_ENV', 'production'))


class VercelPathFixMiddleware:
    """WSGI middleware ensuring correct /api prefix routing regardless of Vercel adapter behavior."""
    def __init__(self, wsgi_app):
        self.wsgi_app = wsgi_app

    def __call__(self, environ, start_response):
        path_info = environ.get('PATH_INFO', '')
        # Strip script prefix if Vercel includes it in PATH_INFO
        if path_info.startswith('/api/index.py'):
            path_info = path_info[len('/api/index.py'):] or '/'
        elif path_info.startswith('/index.py'):
            path_info = path_info[len('/index.py'):] or '/'

        # Ensure non-root routes start with /api so Flask route matching succeeds
        if path_info not in ('/', '') and not path_info.startswith('/api'):
            path_info = '/api' + (path_info if path_info.startswith('/') else '/' + path_info)

        environ['PATH_INFO'] = path_info
        return self.wsgi_app(environ, start_response)


flask_app.wsgi_app = VercelPathFixMiddleware(flask_app.wsgi_app)
app = flask_app

# Expose as app for Vercel WSGI
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
