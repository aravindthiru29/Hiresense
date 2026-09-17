import io


def test_resume_analysis_baseline(client, auth_headers):
    resp = client.get('/api/resume/analysis', headers=auth_headers)
    assert resp.status_code == 200
    data = resp.get_json()['data']
    assert 'resume_score' in data
    assert 'ats_score' in data
    assert 'skills' in data
    assert 'projects' in data


def test_resume_upload_and_parse(client, auth_headers):
    # Simulated PDF file content
    dummy_pdf_data = b"%PDF-1.4\n1 0 obj\n<< /Title (Aravind Resume) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF"
    data = {
        'file': (io.BytesIO(dummy_pdf_data), 'Aravind_Resume.pdf')
    }
    resp = client.post(
        '/api/resume/upload',
        data=data,
        content_type='multipart/form-data',
        headers=auth_headers
    )
    assert resp.status_code in (201, 200)
    res_data = resp.get_json()['data']
    assert res_data['ats_score'] >= 80
    assert len(res_data['skills']) > 0
