import os
import sys
from app import create_app

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

env_name = os.environ.get('FLASK_ENV', 'development')
app = create_app(env_name)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', '1') == '1'
    print("=====================================================")
    print("  [*] HireSense AI Flask REST API Backend Starting    ")
    print(f"  Environment: {env_name}                            ")
    print(f"  Running on:  http://localhost:{port}               ")
    print(f"  API Prefix:  http://localhost:{port}/api           ")
    print(f"  Healthcheck: http://localhost:{port}/api/health    ")
    print("=====================================================")
    app.run(host='0.0.0.0', port=port, debug=debug, use_reloader=False)
