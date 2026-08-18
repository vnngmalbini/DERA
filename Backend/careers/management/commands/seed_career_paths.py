"""
Seeds the 5 CareerPath "trait" buckets that Frontend/src/pages/CareerQuiz.jsx
scores its quiz into (TECH/PEOPLE/CREATIVE/BUSINESS/PRACTICAL), then for each
one seeds:
- real institutions (accounts.seed_ghana_data) linked to the field,
- the scholarships in our data that genuinely target that field,
- specific Career roles within the field (what the quiz results screen
  counts and lists as "careers to consider"),
- real Course programmes at real institutions that lead into those careers
  (what the quiz results screen lists as "courses you can study"), so a
  young person can go from "you're a TECH person" all the way to "here's
  the actual degree, at this actual university, for this actual job" and
  read more about each one — without this app inventing anything.

Institution links use the exact names already seeded by
accounts.seed_ghana_data (run that first) and are limited to associations
verified via each institution's own site/Wikipedia (August 2026). Course
entry requirements are described generally (WASSCE credit passes in the
relevant subjects) rather than as a specific cut-off aggregate, since
official cut-offs change every admissions cycle — youths are pointed to the
institution's own admissions page to confirm current figures.

Run with: python manage.py seed_career_paths (after seed_ghana_data and
refresh_scholarships).
"""

from django.core.management.base import BaseCommand

from accounts.models import Institution
from careers.models import Career, CareerPath, Course, Scholarship

CAREER_PATHS = [
    {
        'trait': CareerPath.Trait.TECH,
        'title': 'Technology & Computing Careers',
        'description': (
            'Software engineering, data science, cybersecurity, and AI-related roles for people who enjoy '
            'logical thinking and solving complex technical problems.'
        ),
        'qualification_required': "Bachelor's degree in Computer Science, Computer Engineering, IT, or related field",
        'institutions': [
            'Kwame Nkrumah University of Science and Technology',
            'Ashesi University',
        ],
        'scholarships': [
            'MTN Bright Scholarship',
            "Konson Aid Girls' STEM Scholarship",
        ],
        'careers': [
            {
                'title': 'Software Engineer',
                'summary': 'Designs, builds, and maintains the applications and systems software people and businesses rely on.',
                'day_to_day': 'Writes and tests code, fixes bugs, reviews teammates’ work, and works with designers and product teams to ship features.',
            },
            {
                'title': 'Data Analyst',
                'summary': 'Turns raw data into insights and reports that guide an organisation’s decisions.',
                'day_to_day': 'Cleans datasets, builds dashboards and reports, and explains what the numbers mean to non-technical colleagues.',
            },
            {
                'title': 'Cybersecurity Analyst',
                'summary': 'Protects an organisation’s systems, networks, and data from digital threats and breaches.',
                'day_to_day': 'Monitors systems for suspicious activity, tests defences, and responds to security incidents.',
            },
            {
                'title': 'IT Support Specialist',
                'summary': 'Keeps computers, networks, and software running smoothly for an organisation’s staff.',
                'day_to_day': 'Troubleshoots hardware and software problems, sets up equipment, and answers staff tech questions.',
            },
            {
                'title': 'UI/UX Designer',
                'summary': 'Designs how digital products look, feel, and work for the people who use them.',
                'day_to_day': 'Sketches and tests app/website layouts, talks to users about what confuses them, and works closely with developers.',
            },
            {
                'title': 'Mobile App Developer',
                'summary': 'Builds the apps that run on phones and tablets, from idea through to app-store release.',
                'day_to_day': 'Writes and tests app code, fixes crashes reported by users, and ships updates.',
            },
            {
                'title': 'Network Engineer',
                'summary': 'Designs, installs, and maintains the networks that connect computers, servers, and devices.',
                'day_to_day': 'Configures routers and switches, monitors network performance, and resolves connectivity issues.',
            },
        ],
        'courses': [
            {
                'title': 'BSc Computer Science',
                'institution': 'Kwame Nkrumah University of Science and Technology',
                'level': Course.Level.BACHELORS,
                'duration': '4 years',
                'description': 'Covers programming, data structures and algorithms, databases, and software systems design.',
                'entry_requirements': 'WASSCE credit passes (A1–C6) in English, Core Mathematics, Elective Mathematics, and Science; confirm the current cut-off aggregate on KNUST’s admissions page.',
                'related_careers': ['Software Engineer', 'Data Analyst', 'Mobile App Developer'],
            },
            {
                'title': 'BSc Computer Science',
                'institution': 'Ashesi University',
                'level': Course.Level.BACHELORS,
                'duration': '4 years',
                'description': 'A liberal-arts-grounded computer science degree with a strong software engineering and ethics focus.',
                'entry_requirements': 'WASSCE credit passes in English, Core Mathematics, and Science/Elective Mathematics; apply directly through Ashesi’s admissions office for current requirements.',
                'related_careers': ['Software Engineer', 'Mobile App Developer', 'UI/UX Designer'],
            },
            {
                'title': 'BSc Computer Engineering',
                'institution': 'Ashesi University',
                'level': Course.Level.BACHELORS,
                'duration': '4 years',
                'description': 'Combines computer science with electronics and hardware systems design.',
                'entry_requirements': 'WASSCE credit passes in English, Core Mathematics, Elective Mathematics, and Physics; confirm current requirements with Ashesi admissions.',
                'related_careers': ['Software Engineer', 'Network Engineer'],
            },
            {
                'title': 'BSc Information Technology',
                'institution': 'Ghana Communication Technology University',
                'level': Course.Level.BACHELORS,
                'duration': '4 years',
                'description': 'Focuses on applying computing and networked systems to real organisational and communication needs.',
                'entry_requirements': 'WASSCE credit passes in English, Core Mathematics, and Science; confirm the current cut-off with GCTU admissions.',
                'related_careers': ['IT Support Specialist', 'Network Engineer', 'Data Analyst'],
            },
            {
                'title': 'BSc Telecommunications Engineering',
                'institution': 'Ghana Communication Technology University',
                'level': Course.Level.BACHELORS,
                'duration': '4 years',
                'description': 'Covers the design and maintenance of the networks and infrastructure that carry voice, data, and internet traffic.',
                'entry_requirements': 'WASSCE credit passes in English, Core Mathematics, Elective Mathematics, and Physics; confirm current requirements with GCTU admissions.',
                'related_careers': ['Network Engineer', 'Cybersecurity Analyst'],
            },
            {
                'title': 'HND Computer Science',
                'institution': 'Kumasi Technical University',
                'level': Course.Level.HND,
                'duration': '3 years',
                'description': 'A hands-on, practice-focused route into programming and IT support roles.',
                'entry_requirements': 'WASSCE credit passes in English, Mathematics, and Science, or a relevant HND-entry qualification; confirm current requirements with the university.',
                'related_careers': ['IT Support Specialist', 'Software Engineer'],
            },
            {
                'title': 'HND Computer Science',
                'institution': 'Accra Technical University',
                'level': Course.Level.HND,
                'duration': '3 years',
                'description': 'A hands-on, practice-focused route into programming and IT support roles.',
                'entry_requirements': 'WASSCE credit passes in English, Mathematics, and Science, or a relevant HND-entry qualification; confirm current requirements with the university.',
                'related_careers': ['IT Support Specialist', 'Software Engineer'],
            },
        ],
    },
    {
        'trait': CareerPath.Trait.PEOPLE,
        'title': 'Healthcare, Education & Social Services',
        'description': (
            'Healthcare, teaching, counselling, and community/social work roles for people driven to '
            'support and uplift others.'
        ),
        'qualification_required': "Bachelor's degree in Medicine, Nursing, Education, Social Work, or related field",
        'institutions': [
            'University of Ghana',
            'University of Health and Allied Sciences',
            'University of Education, Winneba',
        ],
        'scholarships': [],
        'careers': [
            {
                'title': 'Medical Doctor',
                'summary': 'Diagnoses and treats illness and injury in hospitals, clinics, and communities.',
                'day_to_day': 'Examines patients, orders and reads test results, prescribes treatment, and works alongside nurses and specialists.',
            },
            {
                'title': 'Registered Nurse',
                'summary': 'Provides direct patient care, monitoring, and support in hospitals, clinics, and communities.',
                'day_to_day': 'Checks vital signs, administers medication, supports patients and families, and coordinates with doctors.',
            },
            {
                'title': 'Midwife',
                'summary': 'Cares for women and babies through pregnancy, childbirth, and the period after delivery.',
                'day_to_day': 'Monitors pregnancies, supports mothers during labour and delivery, and advises on newborn and postnatal care.',
            },
            {
                'title': 'Basic School Teacher',
                'summary': 'Teaches and mentors children through their early years of education.',
                'day_to_day': 'Plans lessons, teaches classes, marks work, and tracks each pupil’s progress.',
            },
            {
                'title': 'Guidance Counsellor',
                'summary': 'Helps students navigate academic, career, and personal challenges.',
                'day_to_day': 'Meets one-on-one with students, runs career-guidance sessions, and refers students to further support when needed.',
            },
            {
                'title': 'Community / Social Worker',
                'summary': 'Supports vulnerable individuals and families to access services and resources.',
                'day_to_day': 'Visits households, assesses needs, connects people to health/education/welfare services, and follows up over time.',
            },
            {
                'title': 'Pharmacist',
                'summary': 'Dispenses medicines and advises patients and health workers on their safe use.',
                'day_to_day': 'Reviews prescriptions, counsels patients on medication use, and manages pharmacy stock.',
            },
        ],
        'courses': [
            {
                'title': 'MBChB (Doctor of Medicine and Surgery)',
                'institution': 'University of Ghana',
                'level': Course.Level.BACHELORS,
                'duration': '6 years',
                'description': 'The professional degree that qualifies graduates to practise as medical doctors, taught at the University of Ghana Medical School.',
                'entry_requirements': 'Strong WASSCE credit passes in English, Core Mathematics, Chemistry, Biology, and Physics; confirm the current cut-off aggregate and any entrance exam with UG admissions.',
                'related_careers': ['Medical Doctor'],
            },
            {
                'title': 'MBChB (Doctor of Medicine and Surgery)',
                'institution': 'University of Health and Allied Sciences',
                'level': Course.Level.BACHELORS,
                'duration': '6 years',
                'description': 'A medical degree with a strong community and public-health orientation, reflecting UHAS’s focus on underserved areas.',
                'entry_requirements': 'Strong WASSCE credit passes in English, Core Mathematics, Chemistry, Biology, and Physics; confirm current requirements with UHAS admissions.',
                'related_careers': ['Medical Doctor'],
            },
            {
                'title': 'BSc Nursing',
                'institution': 'University of Health and Allied Sciences',
                'level': Course.Level.BACHELORS,
                'duration': '4 years',
                'description': 'Prepares graduates for professional nursing practice across hospital and community settings.',
                'entry_requirements': 'WASSCE credit passes in English, Core Mathematics, Chemistry, and Biology; confirm current requirements with UHAS admissions.',
                'related_careers': ['Registered Nurse'],
            },
            {
                'title': 'BSc Nursing',
                'institution': 'University of Ghana',
                'level': Course.Level.BACHELORS,
                'duration': '4 years',
                'description': 'A university-level nursing degree combining clinical training with research and leadership skills.',
                'entry_requirements': 'WASSCE credit passes in English, Core Mathematics, Chemistry, and Biology; confirm current requirements with UG admissions.',
                'related_careers': ['Registered Nurse'],
            },
            {
                'title': 'Certificate in General Nursing',
                'institution': 'Korle Bu Nursing and Midwifery Training College',
                'level': Course.Level.CERTIFICATE,
                'duration': '3 years',
                'description': 'A direct, practice-based route into registered general nursing, regulated by the Nursing and Midwifery Council of Ghana.',
                'entry_requirements': 'WASSCE credit passes in English, Core Mathematics, Integrated Science, and one other science subject; confirm current requirements with the college.',
                'related_careers': ['Registered Nurse'],
            },
            {
                'title': 'Diploma in Midwifery',
                'institution': 'Nurses and Midwifery Training College, Tamale',
                'level': Course.Level.DIPLOMA,
                'duration': '3 years',
                'description': 'Trains students to safely support women through pregnancy, birth, and postnatal care.',
                'entry_requirements': 'WASSCE credit passes in English, Core Mathematics, Integrated Science, and Biology; confirm current requirements with the college.',
                'related_careers': ['Midwife'],
            },
            {
                'title': 'Bachelor of Education (Basic Education)',
                'institution': 'University of Education, Winneba',
                'level': Course.Level.BACHELORS,
                'duration': '4 years',
                'description': 'Trains graduates to teach at the basic (primary/JHS) level, covering child development, teaching methods, and classroom practice.',
                'entry_requirements': 'WASSCE credit passes in English, Core Mathematics, and Science/Social Studies; confirm current requirements with UEW admissions.',
                'related_careers': ['Basic School Teacher', 'Guidance Counsellor'],
            },
            {
                'title': 'Bachelor of Education (Basic Education)',
                'institution': 'Akropong Presbyterian College of Education',
                'level': Course.Level.BACHELORS,
                'duration': '4 years',
                'description': 'A college of education programme (affiliated with a mentoring university) training basic-school teachers, including a supervised teaching practicum.',
                'entry_requirements': 'WASSCE credit passes in English, Core Mathematics, and Science/Social Studies; confirm current requirements with the college.',
                'related_careers': ['Basic School Teacher'],
            },
            {
                'title': 'BA Social Work',
                'institution': 'University of Ghana',
                'level': Course.Level.BACHELORS,
                'duration': '4 years',
                'description': 'Trains graduates to support individuals, families, and communities facing hardship, through casework and community programmes.',
                'entry_requirements': 'WASSCE credit passes in English, Core Mathematics, and Social Studies/a related elective; confirm current requirements with UG admissions.',
                'related_careers': ['Community / Social Worker', 'Guidance Counsellor'],
            },
        ],
    },
    {
        'trait': CareerPath.Trait.CREATIVE,
        'title': 'Arts, Media & Design Careers',
        'description': (
            'Design, media production, writing, and fine/industrial arts roles for people who think '
            'imaginatively and enjoy creating.'
        ),
        'qualification_required': "Bachelor's degree or diploma in Fine Art, Communication Design, or a related field",
        'institutions': [
            'Kwame Nkrumah University of Science and Technology',
        ],
        'scholarships': [],
        'careers': [
            {
                'title': 'Graphic Designer',
                'summary': 'Creates visual concepts and designs for print, digital, and brand media.',
                'day_to_day': 'Designs logos, posters, and layouts for clients, and revises work based on feedback.',
            },
            {
                'title': 'Fashion Designer',
                'summary': 'Designs and creates clothing and accessories, from sketch to finished garment.',
                'day_to_day': 'Sketches designs, selects fabrics, works with tailors/pattern-makers, and oversees production.',
            },
            {
                'title': 'Film & TV Producer / Videographer',
                'summary': 'Plans, shoots, and produces video content for film, TV, and online audiences.',
                'day_to_day': 'Plans shoots, operates cameras, directs talent, and edits footage into a finished piece.',
            },
            {
                'title': 'Journalist / Broadcaster',
                'summary': 'Researches, writes, and presents news and stories across print, radio, TV, and online media.',
                'day_to_day': 'Researches stories, interviews sources, writes or records reports, and meets publishing deadlines.',
            },
            {
                'title': 'Fine Artist',
                'summary': 'Creates original paintings, sculpture, and other visual artwork.',
                'day_to_day': 'Develops a personal body of work, exhibits or sells pieces, and may take on commissions.',
            },
            {
                'title': 'Photographer',
                'summary': 'Captures and edits images for commercial, editorial, or artistic use.',
                'day_to_day': 'Plans and shoots sessions, edits images, and manages client bookings and delivery.',
            },
        ],
        'courses': [
            {
                'title': 'BFA Painting and Sculpture',
                'institution': 'Kwame Nkrumah University of Science and Technology',
                'level': Course.Level.BACHELORS,
                'duration': '4 years',
                'description': 'A fine art degree developing technical skill and a personal artistic practice, taught in KNUST’s College of Art and Built Environment.',
                'entry_requirements': 'WASSCE credit passes in English and Mathematics, plus a portfolio/studio-based assessment; confirm current requirements with KNUST admissions.',
                'related_careers': ['Fine Artist'],
            },
            {
                'title': 'BA Communication Design',
                'institution': 'Kwame Nkrumah University of Science and Technology',
                'level': Course.Level.BACHELORS,
                'duration': '4 years',
                'description': 'Covers graphic design, branding, illustration, and digital media design.',
                'entry_requirements': 'WASSCE credit passes in English and Mathematics, plus a portfolio/studio-based assessment; confirm current requirements with KNUST admissions.',
                'related_careers': ['Graphic Designer', 'Photographer'],
            },
            {
                'title': 'BA Integrated Rural Art and Industry',
                'institution': 'Kwame Nkrumah University of Science and Technology',
                'level': Course.Level.BACHELORS,
                'duration': '4 years',
                'description': 'Combines craft, textiles, and small-scale industrial design skills with an enterprise focus.',
                'entry_requirements': 'WASSCE credit passes in English and Mathematics, plus a portfolio/studio-based assessment; confirm current requirements with KNUST admissions.',
                'related_careers': ['Fashion Designer'],
            },
            {
                'title': 'HND Fashion Design and Textiles',
                'institution': 'Accra Technical University',
                'level': Course.Level.HND,
                'duration': '3 years',
                'description': 'A practice-based route into garment construction, pattern-making, and textile design.',
                'entry_requirements': 'WASSCE credit passes in English, Mathematics, and a relevant elective, or a relevant HND-entry qualification; confirm current requirements with the university.',
                'related_careers': ['Fashion Designer'],
            },
            {
                'title': 'HND Graphic Design',
                'institution': 'Takoradi Technical University',
                'level': Course.Level.HND,
                'duration': '3 years',
                'description': 'A practice-based route into visual design for print and digital media.',
                'entry_requirements': 'WASSCE credit passes in English, Mathematics, and a relevant elective, or a relevant HND-entry qualification; confirm current requirements with the university.',
                'related_careers': ['Graphic Designer'],
            },
        ],
    },
    {
        'trait': CareerPath.Trait.BUSINESS,
        'title': 'Business, Finance & Entrepreneurship',
        'description': (
            'Entrepreneurship, business management, finance, and marketing roles for people motivated by '
            'leading, organizing, and building.'
        ),
        'qualification_required': "Bachelor's degree in Business Administration, Finance, Economics, or related field",
        'institutions': [
            'University of Ghana',
            'Ghana Institute of Management and Public Administration',
        ],
        'scholarships': [],
        'careers': [
            {
                'title': 'Accountant',
                'summary': 'Prepares, checks, and audits financial records for businesses and organisations.',
                'day_to_day': 'Records transactions, prepares financial statements, and ensures accounts comply with regulations.',
            },
            {
                'title': 'Entrepreneur / Business Owner',
                'summary': 'Starts and runs a business, managing risk, cash flow, and growth.',
                'day_to_day': 'Makes day-to-day operating decisions, manages staff and suppliers, and plans for growth or funding.',
            },
            {
                'title': 'Marketing Officer',
                'summary': 'Plans and runs campaigns that promote products, services, or brands.',
                'day_to_day': 'Plans campaigns, creates content, tracks results, and coordinates with sales teams.',
            },
            {
                'title': 'Bank / Finance Officer',
                'summary': 'Manages accounts, loans, and financial services for banking or finance customers.',
                'day_to_day': 'Processes transactions, assesses loan applications, and advises customers on financial products.',
            },
            {
                'title': 'Human Resource Officer',
                'summary': 'Manages recruitment, staff welfare, and workplace policy for an organisation.',
                'day_to_day': 'Recruits and onboards staff, handles workplace issues, and manages HR records and policy.',
            },
            {
                'title': 'Project / Operations Manager',
                'summary': 'Plans and coordinates the people, budget, and timeline behind a project or business unit.',
                'day_to_day': 'Sets timelines and budgets, coordinates teams, and tracks progress against goals.',
            },
        ],
        'courses': [
            {
                'title': 'BSc Business Administration',
                'institution': 'University of Ghana',
                'level': Course.Level.BACHELORS,
                'duration': '4 years',
                'description': 'A broad business degree covering management, marketing, finance, and operations, taught at the UG Business School.',
                'entry_requirements': 'WASSCE credit passes in English, Core Mathematics, and Social Studies/a related elective; confirm current requirements with UG admissions.',
                'related_careers': ['Entrepreneur / Business Owner', 'Project / Operations Manager', 'Marketing Officer'],
            },
            {
                'title': 'BSc Accounting',
                'institution': 'Ghana Institute of Management and Public Administration',
                'level': Course.Level.BACHELORS,
                'duration': '4 years',
                'description': 'Prepares graduates for professional accounting practice and further certification (e.g. ICAG, ACCA).',
                'entry_requirements': 'WASSCE credit passes in English, Core Mathematics, and a business-related elective; confirm current requirements with GIMPA admissions.',
                'related_careers': ['Accountant'],
            },
            {
                'title': 'BSc Banking and Finance',
                'institution': 'University of Professional Studies, Accra',
                'level': Course.Level.BACHELORS,
                'duration': '4 years',
                'description': 'Focuses on banking operations, financial markets, and investment analysis.',
                'entry_requirements': 'WASSCE credit passes in English, Core Mathematics, and a business/economics-related elective; confirm current requirements with UPSA admissions.',
                'related_careers': ['Bank / Finance Officer'],
            },
            {
                'title': 'BSc Human Resource Management',
                'institution': 'Ghana Institute of Management and Public Administration',
                'level': Course.Level.BACHELORS,
                'duration': '4 years',
                'description': 'Covers recruitment, organisational behaviour, labour law, and workplace policy.',
                'entry_requirements': 'WASSCE credit passes in English, Core Mathematics, and a related elective; confirm current requirements with GIMPA admissions.',
                'related_careers': ['Human Resource Officer'],
            },
            {
                'title': 'HND Marketing',
                'institution': 'Accra Technical University',
                'level': Course.Level.HND,
                'duration': '3 years',
                'description': 'A practice-based route into marketing, sales, and brand management.',
                'entry_requirements': 'WASSCE credit passes in English, Mathematics, and a related elective, or a relevant HND-entry qualification; confirm current requirements with the university.',
                'related_careers': ['Marketing Officer'],
            },
        ],
    },
    {
        'trait': CareerPath.Trait.PRACTICAL,
        'title': 'Engineering, Construction & Agriculture',
        'description': (
            'Engineering, construction trades, and agricultural careers for people who like hands-on, '
            'practical work building and fixing real things.'
        ),
        'qualification_required': "Bachelor's degree/HND in Engineering, Agriculture, or a technical trade",
        'institutions': [
            'University of Mines and Technology',
            'Kumasi Technical University',
            'Kwame Nkrumah University of Science and Technology',
        ],
        'scholarships': [
            'GNPC Foundation Scholarship',
            'Ghana Gas 2026 Local Scholarship Programme',
        ],
        'careers': [
            {
                'title': 'Civil Engineer',
                'summary': 'Designs and oversees the construction of roads, buildings, and infrastructure.',
                'day_to_day': 'Prepares designs and drawings, checks site work for safety and quality, and coordinates with contractors.',
            },
            {
                'title': 'Mining Engineer',
                'summary': 'Plans and manages the safe, efficient extraction of minerals from the earth.',
                'day_to_day': 'Plans mine layouts, monitors safety and equipment, and works with geologists on-site.',
            },
            {
                'title': 'Electrical Engineer',
                'summary': 'Designs, installs, and maintains electrical systems and equipment.',
                'day_to_day': 'Designs circuits and power systems, tests equipment, and troubleshoots faults.',
            },
            {
                'title': 'Agricultural Extension Officer',
                'summary': 'Advises farmers on techniques to improve crop yields, livestock health, and sustainability.',
                'day_to_day': 'Visits farms, demonstrates techniques, and connects farmers with resources and markets.',
            },
            {
                'title': 'Building / Construction Technician',
                'summary': 'Supervises and carries out on-site construction and building work.',
                'day_to_day': 'Reads building plans, supervises workers on-site, and checks work meets safety and quality standards.',
            },
            {
                'title': 'Mechanical Engineer / Fitter',
                'summary': 'Designs, builds, and maintains machines and mechanical systems.',
                'day_to_day': 'Diagnoses mechanical faults, maintains and repairs equipment, and may design new mechanical parts.',
            },
        ],
        'courses': [
            {
                'title': 'BSc Civil Engineering',
                'institution': 'Kwame Nkrumah University of Science and Technology',
                'level': Course.Level.BACHELORS,
                'duration': '4 years',
                'description': 'Covers structural design, construction materials, and infrastructure engineering.',
                'entry_requirements': 'WASSCE credit passes in English, Core Mathematics, Elective Mathematics, and Physics; confirm the current cut-off aggregate with KNUST admissions.',
                'related_careers': ['Civil Engineer', 'Building / Construction Technician'],
            },
            {
                'title': 'BSc Agriculture',
                'institution': 'Kwame Nkrumah University of Science and Technology',
                'level': Course.Level.BACHELORS,
                'duration': '4 years',
                'description': 'Covers crop and livestock science, agricultural economics, and extension methods, taught in KNUST’s College of Agriculture and Natural Resources.',
                'entry_requirements': 'WASSCE credit passes in English, Core Mathematics, Chemistry, and Biology; confirm current requirements with KNUST admissions.',
                'related_careers': ['Agricultural Extension Officer'],
            },
            {
                'title': 'BSc Mining Engineering',
                'institution': 'University of Mines and Technology',
                'level': Course.Level.BACHELORS,
                'duration': '4 years',
                'description': 'Trains engineers to plan and manage mineral extraction safely and efficiently.',
                'entry_requirements': 'WASSCE credit passes in English, Core Mathematics, Elective Mathematics, Physics, and Chemistry; confirm the current cut-off aggregate with UMaT admissions.',
                'related_careers': ['Mining Engineer'],
            },
            {
                'title': 'BSc Electrical and Electronic Engineering',
                'institution': 'University of Mines and Technology',
                'level': Course.Level.BACHELORS,
                'duration': '4 years',
                'description': 'Covers power systems, electronics, and control systems engineering.',
                'entry_requirements': 'WASSCE credit passes in English, Core Mathematics, Elective Mathematics, and Physics; confirm current requirements with UMaT admissions.',
                'related_careers': ['Electrical Engineer'],
            },
            {
                'title': 'HND Civil Engineering',
                'institution': 'Kumasi Technical University',
                'level': Course.Level.HND,
                'duration': '3 years',
                'description': 'A practice-based route into site supervision, surveying, and construction management.',
                'entry_requirements': 'WASSCE credit passes in English, Mathematics, and Physical/Integrated Science, or a relevant HND-entry qualification; confirm current requirements with the university.',
                'related_careers': ['Building / Construction Technician', 'Civil Engineer'],
            },
            {
                'title': 'HND Mechanical Engineering',
                'institution': 'Takoradi Technical University',
                'level': Course.Level.HND,
                'duration': '3 years',
                'description': 'A practice-based route into machine maintenance, fabrication, and mechanical systems.',
                'entry_requirements': 'WASSCE credit passes in English, Mathematics, and Physical/Integrated Science, or a relevant HND-entry qualification; confirm current requirements with the university.',
                'related_careers': ['Mechanical Engineer / Fitter'],
            },
        ],
    },
]


class Command(BaseCommand):
    help = (
        'Seeds the 5 career-quiz trait buckets, links real institutions/scholarships to each, and seeds '
        'real specific careers and real course programmes (at real institutions) under each field.'
    )

    def handle(self, *args, **options):
        created_count = 0
        career_count = 0
        course_count = 0

        for cp in CAREER_PATHS:
            career_path, created = CareerPath.objects.update_or_create(
                trait=cp['trait'],
                defaults={
                    'title': cp['title'],
                    'description': cp['description'],
                    'qualification_required': cp['qualification_required'],
                },
            )
            if created:
                created_count += 1

            institutions = Institution.objects.filter(name__in=cp['institutions'])
            missing = set(cp['institutions']) - set(institutions.values_list('name', flat=True))
            if missing:
                self.stdout.write(self.style.WARNING(
                    f'  {career_path.title}: institution(s) not found (run seed_ghana_data first?): {missing}'
                ))
            career_path.institutions.set(institutions)

            if cp['scholarships']:
                Scholarship.objects.filter(title__in=cp['scholarships']).update(career_path=career_path)

            careers_by_title = {}
            for role in cp.get('careers', []):
                career, role_created = Career.objects.update_or_create(
                    career_path=career_path,
                    title=role['title'],
                    defaults={
                        'summary': role.get('summary', ''),
                        'day_to_day': role.get('day_to_day', ''),
                        'typical_earnings': role.get('typical_earnings'),
                    },
                )
                careers_by_title[career.title] = career
                if role_created:
                    career_count += 1

            for c in cp.get('courses', []):
                institution = Institution.objects.filter(name=c['institution']).first()
                if institution is None:
                    self.stdout.write(self.style.WARNING(
                        f'  {career_path.title}: course "{c["title"]}" skipped — institution not found: {c["institution"]}'
                    ))
                    continue

                course, course_created = Course.objects.update_or_create(
                    career_path=career_path,
                    institution=institution,
                    title=c['title'],
                    defaults={
                        'level': c['level'],
                        'duration': c.get('duration'),
                        'description': c.get('description', ''),
                        'entry_requirements': c.get('entry_requirements', ''),
                    },
                )
                if course_created:
                    course_count += 1

                related = [careers_by_title[t] for t in c.get('related_careers', []) if t in careers_by_title]
                course.careers.set(related)

        self.stdout.write(
            f'Career paths created: {created_count} (total: {CareerPath.objects.count()}); '
            f'careers created: {career_count} (total: {Career.objects.count()}); '
            f'courses created: {course_count} (total: {Course.objects.count()})'
        )
