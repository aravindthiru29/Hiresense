def test_dashboard_endpoint(client, auth_headers):
    resp = client.get('/api/dashboard', headers=auth_headers)
    assert resp.status_code == 200
    data = resp.get_json()['data']
    assert 'user' in data
    assert 'readiness' in data
    assert 'capability' in data
    assert 'skill_gaps' in data
    assert 'next_best_action' in data
    assert data['readiness']['score'] >= 70


def test_assessment_flow(client, auth_headers):
    # 1. Generate assessment
    gen_resp = client.post('/api/assessment/generate', headers=auth_headers)
    assert gen_resp.status_code == 201
    gen_data = gen_resp.get_json()['data']
    assessment_id = gen_data['assessment_id']
    questions = gen_data['questions']
    assert len(questions) > 0

    # 2. Answer first question
    first_q = questions[0]
    ans_resp = client.post(
        f'/api/assessment/{assessment_id}/answer',
        json={
            'question_id': first_q['id'],
            'answer_text': 'Tuples in Python are immutable and stored in contiguous memory with lower overhead, while lists are dynamic arrays allowing mutation.',
        },
        headers=auth_headers
    )
    assert ans_resp.status_code == 200
    ans_data = ans_resp.get_json()['data']
    assert ans_data['score'] >= 70
    assert 'technical_accuracy' in ans_data


def test_readiness_and_roadmap(client, auth_headers):
    # Readiness
    r_resp = client.get('/api/readiness', headers=auth_headers)
    assert r_resp.status_code == 200
    r_data = r_resp.get_json()['data']
    assert 'pillars' in r_data
    assert 'benchmarks' in r_data

    # Skill verification
    sv_resp = client.get('/api/readiness/skill-verification', headers=auth_headers)
    assert sv_resp.status_code == 200
    sv_data = sv_resp.get_json()['data']
    assert len(sv_data) > 0

    # Roadmap
    rm_resp = client.get('/api/roadmap', headers=auth_headers)
    assert rm_resp.status_code == 200
    rm_data = rm_resp.get_json()['data']
    assert 'sprints' in rm_data
    assert len(rm_data['sprints']) >= 4


def test_interview_and_github(client, auth_headers):
    # Start interview
    int_resp = client.post(
        '/api/interview/start',
        json={'round_type': 'behavioral', 'company': 'Google'},
        headers=auth_headers
    )
    assert int_resp.status_code == 201
    int_data = int_resp.get_json()['data']
    assert 'session_id' in int_data
    assert 'question' in int_data

    # Answer interview
    ans_resp = client.post(
        f"/api/interview/{int_data['session_id']}/answer",
        json={
            'question': int_data['question'],
            'answer': 'In my previous project, we faced a high-latency database bottleneck. I used EXPLAIN to identify missing composite indexes and reduced query latency by 65%.',
            'round_type': 'behavioral'
        },
        headers=auth_headers
    )
    assert ans_resp.status_code == 200
    assert ans_resp.get_json()['data']['score'] >= 80

    # GitHub analyze
    gh_resp = client.post(
        '/api/github/analyze',
        json={'username': 'aravind-t'},
        headers=auth_headers
    )
    assert gh_resp.status_code == 200
    gh_data = gh_resp.get_json()['data']
    assert 'audited_repositories' in gh_data
