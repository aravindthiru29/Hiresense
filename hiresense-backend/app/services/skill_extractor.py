import re
from typing import List, Dict, Any, Set


SKILL_TAXONOMY: Dict[str, Dict[str, Any]] = {
    'python': {'name': 'Python', 'category': 'Languages', 'tier': 1},
    'java': {'name': 'Java & OOP Principles', 'category': 'Languages', 'tier': 1},
    'javascript': {'name': 'JavaScript', 'category': 'Languages', 'tier': 2},
    'typescript': {'name': 'TypeScript', 'category': 'Languages', 'tier': 2},
    'sql': {'name': 'SQL & Query Design', 'category': 'Databases', 'tier': 1},
    'flask': {'name': 'Flask / REST APIs', 'category': 'Frameworks', 'tier': 1},
    'fastapi': {'name': 'FastAPI', 'category': 'Frameworks', 'tier': 2},
    'django': {'name': 'Django', 'category': 'Frameworks', 'tier': 2},
    'react': {'name': 'React', 'category': 'Frameworks', 'tier': 2},
    'machine learning': {'name': 'Machine Learning', 'category': 'AI & ML', 'tier': 1},
    'deep learning': {'name': 'Deep Learning', 'category': 'AI & ML', 'tier': 2},
    'opencv': {'name': 'OpenCV / Computer Vision', 'category': 'AI & ML', 'tier': 1},
    'pytorch': {'name': 'PyTorch', 'category': 'AI & ML', 'tier': 2},
    'tensorflow': {'name': 'TensorFlow', 'category': 'AI & ML', 'tier': 2},
    'scikit-learn': {'name': 'Scikit-Learn', 'category': 'AI & ML', 'tier': 2},
    'pandas': {'name': 'Pandas', 'category': 'AI & ML', 'tier': 2},
    'numpy': {'name': 'NumPy', 'category': 'AI & ML', 'tier': 2},
    'git': {'name': 'Git & Version Control', 'category': 'Tools', 'tier': 1},
    'docker': {'name': 'Docker & Containerization', 'category': 'DevOps', 'tier': 2},
    'redis': {'name': 'System Design / Caching (Redis)', 'category': 'Databases', 'tier': 2},
    'postgresql': {'name': 'PostgreSQL', 'category': 'Databases', 'tier': 2},
    'mysql': {'name': 'MySQL', 'category': 'Databases', 'tier': 2},
    'dsa': {'name': 'Data Structures & Algorithms', 'category': 'Core CS', 'tier': 1},
    'oop': {'name': 'Object-Oriented Programming', 'category': 'Core CS', 'tier': 1},
    'system design': {'name': 'System Design', 'category': 'Core CS', 'tier': 2},
}


class SkillExtractor:
    """Matches text against normalized skill taxonomy."""

    @staticmethod
    def extract_skills_from_text(text: str) -> List[Dict[str, Any]]:
        found_skills: Dict[str, Dict[str, Any]] = {}
        lower_text = text.lower()

        for key, meta in SKILL_TAXONOMY.items():
            pattern = r'\b' + re.escape(key) + r'\b'
            if re.search(pattern, lower_text):
                found_skills[meta['name']] = {
                    'name': meta['name'],
                    'category': meta['category'],
                    'tier': meta['tier'],
                    'resume_level': 'Advanced' if meta['tier'] == 1 else 'Intermediate',
                }

        # Ensure core base skills for Software Developer if empty
        if not found_skills:
            defaults = ['Python', 'SQL & Query Design', 'Flask / REST APIs', 'Git & Version Control']
            for d in defaults:
                found_skills[d] = {'name': d, 'category': 'Core', 'tier': 1, 'resume_level': 'Intermediate'}

        return list(found_skills.values())

    @staticmethod
    def identify_skill_gaps(detected_skill_names: Set[str], target_role: str) -> List[Dict[str, str]]:
        core_requirements = [
            {'name': 'System Design / Caching (Redis)', 'impact': 'High', 'reason': 'Commonly evaluated in Tier-1 SDE rounds'},
            {'name': 'Docker & Containerization', 'impact': 'Medium', 'reason': 'Shows cloud readiness in modern development'},
            {'name': 'CI/CD Pipeline Workflow', 'impact': 'Medium', 'reason': 'Strengthens production-grade engineering profile'},
        ]
        gaps = []
        for req in core_requirements:
            if req['name'] not in detected_skill_names:
                gaps.append(req)
        return gaps
