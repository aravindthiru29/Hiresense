def test_health_check(client):
    resp = client.get('/api/health')
    assert resp.status_code == 200
    data = resp.get_json()
    assert data['status'] == 'healthy'


def test_register_and_login(client):
    # Register
    reg_resp = client.post('/api/auth/register', json={
        'full_name': 'Test User',
        'email': 'newuser@example.com',
        'password': 'secretpassword',
        'college': 'VIT',
        'degree': 'B.Tech',
        'branch': 'AI & DS',
        'graduation_year': 2026,
    })
    assert reg_resp.status_code == 201
    reg_data = reg_resp.get_json()
    assert reg_data['success'] is True
    assert 'access_token' in reg_data['data']
    assert reg_data['data']['user']['email'] == 'newuser@example.com'

    # Duplicate registration should fail
    dup_resp = client.post('/api/auth/register', json={
        'full_name': 'Test User',
        'email': 'newuser@example.com',
        'password': 'secretpassword',
    })
    assert dup_resp.status_code == 409
    assert dup_resp.get_json()['success'] is False

    # Login
    login_resp = client.post('/api/auth/login', json={
        'email': 'newuser@example.com',
        'password': 'secretpassword',
    })
    assert login_resp.status_code == 200
    login_data = login_resp.get_json()
    assert login_data['success'] is True
    assert 'access_token' in login_data['data']


def test_protected_me_endpoint(client, auth_headers):
    resp = client.get('/api/auth/me', headers=auth_headers)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data['success'] is True
    assert data['data']['email'] == 'aravind@example.com'
    assert data['data']['full_name'] == 'Aravind T'
