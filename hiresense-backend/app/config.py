import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'hiresense-dev-secret-key-change-in-production')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'hiresense-jwt-secret-key-change-in-prod')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(
        hours=int(os.environ.get('JWT_ACCESS_TOKEN_EXPIRES_HOURS', 24))
    )

    # Serverless runtime detection (Vercel, AWS Lambda, etc.)
    IS_SERVERLESS = bool(os.environ.get('VERCEL') or os.environ.get('AWS_LAMBDA_FUNCTION_NAME'))

    # Database URL with postgres:// -> postgresql:// fix
    default_db = 'sqlite:////tmp/hiresense.db' if IS_SERVERLESS else 'sqlite:///hiresense.db'
    raw_db_url = os.environ.get('DATABASE_URL', default_db)
    if raw_db_url.startswith('postgres://'):
        raw_db_url = raw_db_url.replace('postgres://', 'postgresql://', 1)
    SQLALCHEMY_DATABASE_URI = raw_db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # CORS configuration
    FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
    CORS_ORIGINS = [
        FRONTEND_URL,
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        r'https://.*\.vercel\.app',
    ]

    # File uploads
    default_upload = '/tmp/uploads/resumes' if IS_SERVERLESS else os.path.join(BASE_DIR, 'uploads/resumes')
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', default_upload)
    MAX_CONTENT_LENGTH = int(os.environ.get('MAX_CONTENT_LENGTH', 10 * 1024 * 1024))  # 10 MB
    ALLOWED_EXTENSIONS = {'pdf', 'docx', 'doc'}

    # AI Service settings
    AI_API_KEY = os.environ.get('AI_API_KEY', '')
    AI_MODEL = os.environ.get('AI_MODEL', 'gemini-1.5-pro')

    # GitHub Integration
    GITHUB_TOKEN = os.environ.get('GITHUB_TOKEN', '')


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)


config_by_name = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig,
}
