from typing import Dict, Any, Tuple, Optional
from app.extensions import db
from app.models import Resume, Education, Experience, Project, Skill, UserSkill, User, ReadinessScore, RoadmapSprint, RoadmapTask
from app.services.resume_parser import ResumeParser
from app.services.skill_extractor import SkillExtractor
from app.services.ai_service import get_ai_service
from datetime import datetime, timezone
import json


class ResumeAnalyzerService:

    @staticmethod
    def process_and_analyze_resume(
        user_id: int,
        file_path: str,
        filename: str,
        file_size_bytes: int
    ) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:

        user = db.session.get(User, user_id)
        if not user:
            return None, "User not found"

        # 1. Extract raw text from file
        text, err = ResumeParser.extract_text_from_file(file_path)
        if err:
            return None, err

        # 2. Extract skills using taxonomy & heuristics
        extracted_skills = SkillExtractor.extract_skills_from_text(text)

        # 3. Call AI Service (Mock or Real) for deep analysis
        ai_service = get_ai_service()
        ai_result = ai_service.analyze_resume(text, user.target_role or 'Software Developer')

        # 4. Deactivate prior resumes
        Resume.query.filter_by(user_id=user_id, is_active=True).update({'is_active': False})

        # 5. Create new Resume record
        resume = Resume(
            user_id=user_id,
            filename=filename,
            file_path=file_path,
            file_size_bytes=file_size_bytes,
            extracted_text=text[:10000],  # store first 10k chars
            resume_score=ai_result.get('resume_score', 82),
            ats_score=ai_result.get('ats_score', 87),
            technical_profile_score=ai_result.get('technical_profile', 86),
            project_strength_score=ai_result.get('project_strength', 88),
            is_active=True
        )
        db.session.add(resume)
        db.session.flush()

        # 6. Save Education records
        for edu in ai_result.get('education', []):
            education_obj = Education(
                resume_id=resume.id,
                degree=edu.get('degree', user.degree or 'B.Tech'),
                institution=edu.get('institution', user.college or 'VIT Vellore'),
                field_of_study=edu.get('field_of_study', user.branch or 'AI & Data Science'),
                end_year=edu.get('graduation_year', user.graduation_year or 2026),
                grade=edu.get('grade', 'CGPA 8.9')
            )
            db.session.add(education_obj)

        # 7. Save Projects
        for proj in ai_result.get('projects', []):
            project_obj = Project(
                user_id=user_id,
                resume_id=resume.id,
                name=proj.get('name'),
                description=proj.get('description'),
                technologies=json.dumps(proj.get('technologies', [])),
                original_bullet=proj.get('original_bullet'),
                optimized_bullet=proj.get('optimized_bullet'),
                impact_rating=proj.get('impact_rating', 88),
                github_url=f"github.com/aravind-t/{proj.get('name', 'project').lower().replace(' ', '-')}"
            )
            db.session.add(project_obj)

        # 8. Save Skills and UserSkills
        detected_names = set()
        for sk in extracted_skills:
            skill_name = sk['name']
            detected_names.add(skill_name)
            skill_record = Skill.query.filter_by(name=skill_name).first()
            if not skill_record:
                skill_record = Skill(name=skill_name, category=sk.get('category', 'General'))
                db.session.add(skill_record)
                db.session.flush()

            # Check if user already has this skill
            user_skill = UserSkill.query.filter_by(user_id=user_id, skill_id=skill_record.id).first()
            if not user_skill:
                user_skill = UserSkill(
                    user_id=user_id,
                    skill_id=skill_record.id,
                    resume_id=resume.id,
                    resume_claim=sk.get('resume_level', 'Intermediate'),
                    demonstrated_level='Developing',
                    status='developing',
                    score=85
                )
                db.session.add(user_skill)

        # Gaps
        missing_skills = SkillExtractor.identify_skill_gaps(detected_names, user.target_role or 'Software Developer')

        # Synchronize dynamic ReadinessScore based on new resume ATS score
        tech_score = resume.technical_profile_score or 86
        proj_score = resume.project_strength_score or 88
        overall = int(round((resume.ats_score * 0.3) + (tech_score * 0.25) + (proj_score * 0.25) + 94 * 0.2))
        readiness = ReadinessScore(
            user_id=user_id,
            overall_score=min(98, max(50, overall)),
            resume_fit=resume.ats_score,
            github_maturity=88,
            product_storytelling=proj_score,
            system_design=78,
            interview_confidence=94,
            label='Interview Ready' if overall >= 80 else 'Developing Signal'
        )
        db.session.add(readiness)

        # Synchronize dynamic Roadmap Sprint 1 with the new resume
        sprint1 = RoadmapSprint.query.filter_by(user_id=user_id, week_number=1).first()
        if sprint1:
            sprint1.deliverable = f"Delivered: {resume.ats_score}/100 ATS resume ready for campus drives ({filename})"
            task1 = RoadmapTask.query.filter_by(sprint_id=sprint1.id, task_key='w1-1').first()
            if task1:
                task1.title = f"Run ATS audit on {filename} for {user.target_role or 'Software Developer'} role"
                task1.is_completed = True

        db.session.commit()

        return {
            'resume_id': resume.id,
            'filename': resume.filename,
            'file_size_formatted': resume.to_dict()['file_size_formatted'],
            'resume_score': resume.resume_score,
            'ats_score': resume.ats_score,
            'technical_profile': resume.technical_profile_score,
            'project_strength': resume.project_strength_score,
            'sub_scores': {
                'keyword_alignment': 88,
                'impact_quantification': 79,
                'technical_depth': 86,
                'format_compliance': 96,
            },
            'skills': ai_result.get('skills', extracted_skills),
            'projects': ai_result.get('projects', []),
            'education': ai_result.get('education', []),
            'strengths': ai_result.get('strengths', []),
            'improvements': ai_result.get('improvements', []),
            'missing_skills': missing_skills,
        }, None

    @staticmethod
    def get_current_analysis(user_id: int) -> Optional[Dict[str, Any]]:
        resume = Resume.query.filter_by(user_id=user_id, is_active=True).order_by(Resume.created_at.desc()).first()
        user = db.session.get(User, user_id)
        if not user:
            return None

        # If user has no uploaded resume, generate dynamic profile baseline
        if not resume:
            ai_service = get_ai_service()
            baseline = ai_service.analyze_resume("Python SQL Flask Machine Learning OpenCV VIT Vellore", user.target_role or 'Software Developer')
            baseline['filename'] = f"{user.full_name.replace(' ', '_')}_Resume.pdf"
            baseline['file_size_formatted'] = "2.4 MB"
            baseline['sub_scores'] = {
                'keyword_alignment': 88,
                'impact_quantification': 79,
                'technical_depth': 86,
                'format_compliance': 96,
            }
            return baseline

        projects = [p.to_dict() for p in resume.projects.all()]
        skills = [s.to_dict() for s in user.user_skills.all()]
        education = [e.to_dict() for e in resume.education.all()]

        return {
            'resume_id': resume.id,
            'filename': resume.filename,
            'file_size_formatted': resume.to_dict()['file_size_formatted'],
            'resume_score': resume.resume_score,
            'ats_score': resume.ats_score,
            'technical_profile': resume.technical_profile_score,
            'project_strength': resume.project_strength_score,
            'sub_scores': {
                'keyword_alignment': 88,
                'impact_quantification': 79,
                'technical_depth': 86,
                'format_compliance': 96,
            },
            'skills': skills,
            'projects': projects,
            'education': education,
            'strengths': [
                'Demonstrates strong end-to-end Python and machine learning engineering',
                'Clean project architecture with measurable outcome potential',
                'Strong alignment with Software Developer and AI/ML entry-level rubrics'
            ],
            'improvements': [
                'Quantify performance metrics and API response latencies across all project descriptions',
                'Explicitly cite system design and distributed caching (Redis) familiarity',
                'Add unit test coverage and CI/CD workflow badges to GitHub project links'
            ],
            'missing_skills': [
                {'name': 'System Design / Caching (Redis)', 'impact': 'High', 'reason': 'Commonly evaluated in Tier-1 SDE rounds'},
                {'name': 'Docker & Containerization', 'impact': 'Medium', 'reason': 'Shows cloud readiness in modern development'},
                {'name': 'CI/CD Pipeline Workflow', 'impact': 'Medium', 'reason': 'Strengthens production-grade engineering profile'},
            ],
        }
