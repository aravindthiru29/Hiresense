import pytest
import os
import sys

# Ensure backend root is on sys.path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app import create_app
from app.extensions import db
from app.models import User


@pytest.fixture
def app():
    app = create_app('testing')
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def auth_headers(client):
    # Register test user
    reg_resp = client.post('/api/auth/register', json={
        'full_name': 'Aravind T',
        'email': 'aravind@example.com',
        'password': 'password123',
        'college': 'VIT Vellore',
        'degree': 'B.Tech',
        'branch': 'Artificial Intelligence & Data Science',
        'graduation_year': 2026,
        'target_role': 'Software Developer',
    })
    data = reg_resp.get_json()
    token = data['data']['access_token']
    return {'Authorization': f'Bearer {token}'}
