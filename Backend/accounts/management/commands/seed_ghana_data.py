"""
Seeds Ghana's 16 regions/261 districts (MMDAs), a set of real top tertiary
institutions and senior high schools, and verified real scholarship programs
for Ghanaian students.

Run with: python manage.py seed_ghana_data

Sources (verified via web search, July 2026):
- Districts: ghanadistricts.com official MMDA repository (261 total, matches
  the widely-cited national count).
- Institutions/scholarships: verified against each institution's/program's
  own site or reputable Ghanaian coverage (MTN Ghana, scholarships.gov.gh,
  Ashesi University, Wikipedia school articles, ghanadistricts.com school
  listings). Idempotent — safe to re-run; uses get_or_create throughout.
"""

from django.core.management.base import BaseCommand

from accounts.models import District, Institution
from careers.models import Scholarship

DISTRICTS_BY_REGION = {
    'Ashanti': [
        'Adansi North', 'Adansi South', 'Afigya Kwabre South', 'Ahafo Ano North', 'Ahafo Ano South West',
        'Amansie Central', 'Amansie West', 'Asante Akim Central', 'Asante Akim North', 'Asante Akim South',
        'Asokore Mampong', 'Atwima Kwanwoma', 'Atwima Mponua', 'Atwima Nwabiagya South', 'Bekwai',
        'Bosome Freho', 'Bosomtwe', 'Ejisu', 'Ejura Sekyedumase', 'Kumasi Metropolitan', 'Kwabre East',
        'Mampong', 'Obuasi', 'Offinso', 'Offinso North', 'Sekyere Afram Plains', 'Sekyere Central',
        'Sekyere East', 'Sekyere Kumawu', 'Sekyere South', 'Oforikrom', 'Kwadaso', 'Old Tafo', 'Asokwa',
        'Suame', 'Juaben', 'Ahafo Ano South East', 'Amansie South', 'Atwima Nwabiagya North', 'Akrofuom',
        'Adansi Asokwa', 'Obuasi East', 'Afigya Kwabre North',
    ],
    'Bono': [
        'Banda', 'Berekum East', 'Dormaa Central', 'Dormaa East', 'Dormaa West', 'Jaman North',
        'Jaman South', 'Sunyani Metropolitan', 'Sunyani West', 'Tain', 'Wenchi', 'Berekum West',
    ],
    'Bono East': [
        'Atebubu Amantin', 'Kintampo North', 'Kintampo South', 'Nkoranza South', 'Nkoranza North',
        'Pru East', 'Sene East', 'Sene West', 'Techiman Metropolitan', 'Techiman North', 'Pru West',
    ],
    'Ahafo': [
        'Asunafo North', 'Asunafo South', 'Asutifi North', 'Asutifi South', 'Tano North', 'Tano South',
    ],
    'Central': [
        'Abura Asebu Kwamankese', 'Agona East', 'Agona West', 'Ajumako Enyan Essiam',
        'Asikuma Odoben Brankwa', 'Assin Foso', 'Assin South', 'Awutu Senya East', 'Awutu Senya West',
        'Cape Coast Metropolitan', 'Effutu', 'Ekumfi', 'Gomoa Central', 'Gomoa West',
        'Komenda Edina Eguafo Abirem', 'Mfantseman', 'Twifo Atti Morkwa', 'Twifo Heman Lower Denkyira',
        'Upper Denkyira East', 'Upper Denkyira West', 'Assin North', 'Gomoa East Metropolitan',
    ],
    'Eastern': [
        'Akuapem North', 'Akuapim South', 'Akyemansa', 'Asuogyaman', 'Atiwa West', 'Ayensuano',
        'Birim Central', 'Birim North', 'Birim South', 'Denkyembour', 'Abuakwa South', 'Fanteakwa North',
        'Kwaebibirem', 'Kwahu Afram Plains North', 'Kwahu Afram Plains South', 'Kwahu East', 'Kwahu South',
        'Kwahu West', 'Lower Manya Krobo', 'New Juaben South Metropolitan', 'Nsawam Adoagyiri', 'Suhum',
        'Upper Manya Krobo', 'Upper West Akim', 'West Akim', 'Yilo Krobo', 'Okere', 'Atiwa East',
        'Fanteakwa South', 'Asene Manso Akroso', 'Abuakwa North', 'New Juaben North', 'Achiase',
    ],
    'Greater Accra': [
        'Accra Metropolitan', 'Ada West', 'Ada East', 'Adentan', 'Ashaiman', 'Ga Central', 'Ga South',
        'Ga East', 'Ga West', 'La Dade Kotopon', 'Ledzokuku', 'La Nkwantanang Madina', 'Ningo Prampram',
        'Shai Osudoku', 'Tema Metropolitan', 'Kpone Katamanso Metropolitan', 'Okaikwei North',
        'Ablekuma North', 'Ablekuma West', 'Ayawaso East', 'Ayawaso North', 'Ayawaso West', 'Ga North',
        'Weija Gbawe', 'Tema West', 'Krowor', 'Korle Klottey', 'Ablekuma Central', 'Ayawaso Central',
    ],
    'Northern': [
        'Gushegu', 'Karaga', 'Kpandai', 'Kumbungu', 'Mion', 'Nanumba North', 'Nanumba South', 'Saboba',
        'Sagnarigu', 'Savelugu', 'Tamale Metropolitan', 'Tatale/Sanguli', 'Tolon', 'Yendi', 'Zabzugu',
        'Nanton',
    ],
    'North East': [
        'Bunkpurugu Nakpanduri', 'Chereponi', 'East Mamprusi', 'Mamprugu Moagduri', 'West Mamprusi',
        'Yunyoo-Nasuan',
    ],
    'Savannah': [
        'Bole', 'Central Gonja', 'East Gonja', 'North Gonja', 'Sawla-Tuna-Kalba', 'West Gonja',
        'North East Gonja',
    ],
    'Upper East': [
        'Bawku', 'Bawku West', 'Binduri', 'Bolgatanga', 'Bongo', 'Builsa North', 'Builsa South', 'Garu',
        'Kassena Nankana', 'Kassena Nankana West', 'Nabdam', 'Pusiga', 'Talensi', 'Bolgatanga East',
        'Tempane',
    ],
    'Upper West': [
        'Daffiama Bussie Issa', 'Jirapa', 'Lambussie Karni', 'Lawra', 'Nadowli Kaleo', 'Nandom',
        'Sissala East', 'Sissala West', 'Wa East', 'Wa Metropolitan', 'Wa West',
    ],
    'Volta': [
        'Adaklu', 'Afadzato South', 'Agotime Ziope', 'Akatsi North', 'Akatsi South', 'Central Tongu',
        'Ho Metropolitan', 'Ho West', 'Hohoe', 'Keta', 'Ketu North', 'Ketu South', 'Kpando', 'North Dayi',
        'North Tongu', 'South Dayi', 'South Tongu', 'Anloga',
    ],
    'Oti': [
        'Biakoye', 'Jasikan', 'Kadjebi', 'Krachi East', 'Krachi Nchumuru', 'Krachi West', 'Nkwanta North',
        'Nkwanta South', 'Guan',
    ],
    'Western': [
        'Ahanta West', 'Amenfi Central', 'Wassa Amenfi East', 'Wassa Amenfi West', 'Ellembelle', 'Jomoro',
        'Mpohor', 'Nzema East', 'Prestea-Huni Valley', 'Sekondi Takoradi Metropolitan', 'Shama',
        'Tarkwa-Nsuaem', 'Wassa East', 'Effia Kwesimintsim',
    ],
    'Western North': [
        'Aowin', 'Bia East', 'Bia West', 'Bibiani-Anhwiaso Bekwai', 'Bodi', 'Juaboso', 'Sefwi Akontombra',
        'Sefwi Wiawso', 'Suaman',
    ],
}

INSTITUTIONS = [
    # Public universities
    ('University of Ghana', 'university', 'Greater Accra'),
    ('Kwame Nkrumah University of Science and Technology', 'university', 'Ashanti'),
    ('University of Cape Coast', 'university', 'Central'),
    ('University of Education, Winneba', 'university', 'Central'),
    ('University for Development Studies', 'university', 'Northern'),
    ('University of Mines and Technology', 'university', 'Western'),
    ('University of Energy and Natural Resources', 'university', 'Bono'),
    ('University of Health and Allied Sciences', 'university', 'Volta'),
    ('Ghana Institute of Management and Public Administration', 'university', 'Greater Accra'),
    ('University of Professional Studies, Accra', 'university', 'Greater Accra'),
    ('University of Environment and Sustainable Development', 'university', 'Eastern'),
    ('University of Technology and Applied Sciences, Navrongo (UTAS)', 'university', 'Upper East'),
    ('Simon Diedong Dombo University of Business and Integrated Development Studies', 'university', 'Upper West'),
    # Private universities
    ('Ashesi University', 'university', 'Eastern'),
    ('Central University', 'university', 'Greater Accra'),
    ('Valley View University', 'university', 'Eastern'),
    ('Presbyterian University, Ghana', 'university', 'Eastern'),
    ('Methodist University Ghana', 'university', 'Greater Accra'),
    ('Academic City University College', 'university', 'Greater Accra'),
    ('All Nations University', 'university', 'Eastern'),
    ('Catholic University of Ghana', 'university', 'Bono'),
    ('Ghana Communication Technology University', 'university', 'Greater Accra'),
    ('Regent University College of Science and Technology', 'university', 'Greater Accra'),
    ('Pentecost University', 'university', 'Greater Accra'),
    ('Islamic University College, Ghana', 'university', 'Greater Accra'),
    ('Wisconsin International University College', 'university', 'Greater Accra'),
    ('Webster University Ghana', 'university', 'Greater Accra'),
    # Technical universities
    ('Accra Technical University', 'technical_university', 'Greater Accra'),
    ('Kumasi Technical University', 'technical_university', 'Ashanti'),
    ('Takoradi Technical University', 'technical_university', 'Western'),
    ('Ho Technical University', 'technical_university', 'Volta'),
    ('Sunyani Technical University', 'technical_university', 'Bono'),
    ('Cape Coast Technical University', 'technical_university', 'Central'),
    ('Tamale Technical University', 'technical_university', 'Northern'),
    ('Koforidua Technical University', 'technical_university', 'Eastern'),
    ('Wa Technical University', 'technical_university', 'Upper West'),
    ('Bolgatanga Technical University', 'technical_university', 'Upper East'),
    # Colleges of education
    ('Akropong Presbyterian College of Education', 'college_of_education', 'Eastern'),
    ('Wesley College of Education', 'college_of_education', 'Central'),
    ('Dambai College of Education', 'college_of_education', 'Oti'),
    ('Tamale College of Education', 'college_of_education', 'Northern'),
    ('Bagabaga College of Education', 'college_of_education', 'Northern'),
    ('Gbewaa College of Education', 'college_of_education', 'North East'),
    ("St. John Bosco's College of Education", 'college_of_education', 'Upper East'),
    ('Tumu College of Education', 'college_of_education', 'Upper West'),
    ('Berekum College of Education', 'college_of_education', 'Bono'),
    ('Mount Mary College of Education', 'college_of_education', 'Eastern'),
    ('Enchi College of Education', 'college_of_education', 'Western North'),
    ('Al-Faruq College of Education', 'college_of_education', 'Bono'),
    ('Foso College of Education', 'college_of_education', 'Central'),
    ('OLA College of Education', 'college_of_education', 'Central'),
    ('Komenda College of Education', 'college_of_education', 'Central'),
    ('Mampong Technical College of Education', 'college_of_education', 'Ashanti'),
    ("Presbyterian Women's College of Education, Aburi", 'college_of_education', 'Eastern'),
    # Nursing and midwifery training colleges
    ('Korle Bu Nursing and Midwifery Training College', 'nursing_training_college', 'Greater Accra'),
    ('37 Military Hospital School of Nursing', 'nursing_training_college', 'Greater Accra'),
    ('Komfo Anokye Nursing and Midwifery Training College', 'nursing_training_college', 'Ashanti'),
    ('Nurses and Midwifery Training College, Tamale', 'nursing_training_college', 'Northern'),
    ('Nurses and Midwifery Training College, Bolgatanga', 'nursing_training_college', 'Upper East'),
    ('Cape Coast Nursing and Midwifery Training College', 'nursing_training_college', 'Central'),
    # Popular senior high schools (southern/well-known)
    ("Presbyterian Boys' Secondary School (PRESEC-Legon)", 'school', 'Greater Accra'),
    ('Achimota School', 'school', 'Greater Accra'),
    ('Accra Academy', 'school', 'Greater Accra'),
    ('Mfantsipim School', 'school', 'Central'),
    ("Wesley Girls' High School", 'school', 'Central'),
    ('Adisadel College', 'school', 'Central'),
    ('Holy Child School', 'school', 'Central'),
    ("St. Augustine's College", 'school', 'Central'),
    ('Ghana National College', 'school', 'Central'),
    ('Prempeh College', 'school', 'Ashanti'),
    ('Opoku Ware School', 'school', 'Ashanti'),
    ("Yaa Asantewaa Girls' Senior High School", 'school', 'Ashanti'),
    ("Aburi Girls' Senior High School", 'school', 'Eastern'),
    # Northern-Ghana senior high schools (DERA's core mission region)
    ('Tamale Senior High School', 'school', 'Northern'),
    ('Navrongo Senior High School', 'school', 'Upper East'),
    ('Bolgatanga Senior High School', 'school', 'Upper East'),
    ('Wa Senior High Technical School', 'school', 'Upper West'),
    ('Damongo Senior High School', 'school', 'Savannah'),
    ('Nalerigu Senior High School', 'school', 'North East'),
    ('Oti Senior High/Technical School', 'school', 'Oti'),
]

SCHOLARSHIPS = [
    {
        'title': 'MTN Bright Scholarship',
        'provider': 'MTN Ghana Foundation',
        'education_level': 'Tertiary',
        'deadline': '2026-05-31',
        'eligibility_criteria': (
            'Ghanaian citizens enrolled as continuing students pursuing a first degree at a public '
            'tertiary institution, or in a vocational/technical skills training programme; teachers '
            'furthering their education at public universities are also eligible. Applicants must have a '
            'good academic record and good conduct (no disciplinary issues). Priority given to STEM, '
            'ICT, Engineering, AI and Data Analytics fields, women, persons with disabilities, and '
            'students from underserved regions. Covers tuition, accommodation, a book stipend, and a '
            'device. Free to apply — no fees at any stage.'
        ),
        'source_url': 'https://scholarship.mtn.com.gh/',
    },
    {
        'title': 'Local Tertiary Scholarship Scheme',
        'provider': 'Ghana Scholarships Secretariat',
        'education_level': 'Tertiary',
        'deadline': None,
        'eligibility_criteria': (
            'Ghanaian citizen with a valid Ghana Card, admitted to an accredited public tertiary '
            'institution in Ghana, demonstrated academic merit and financial need (verified at the '
            'district level), and not currently receiving another government scholarship. Covers full or '
            'partial tuition, examination fees, library/ICT levies, and in selected cases accommodation. '
            'Application windows open periodically — confirm current dates on the official portal before '
            'applying.'
        ),
        'source_url': 'https://apply.scholarships.gov.gh/',
    },
    {
        'title': 'CAMFED Ghana Secondary School Bursary',
        'provider': 'Campaign for Female Education (CAMFED) Ghana',
        'education_level': 'SHS',
        'deadline': None,
        'eligibility_criteria': (
            'Girls from marginalized, low-income rural households demonstrating academic potential and '
            'financial need. Covers school fees, uniforms, shoes, books, and other essentials for the '
            'full duration of secondary education. Operates through District CAMA Resource Centres across '
            "12 regions of Ghana. Contact your district CAMFED office or the school's guidance "
            'coordinator to apply.'
        ),
        'source_url': 'https://camfed.org/',
    },
    {
        'title': 'Mastercard Foundation Scholars Program at Ashesi University',
        'provider': 'Mastercard Foundation / Ashesi University',
        'education_level': 'Tertiary',
        'deadline': None,
        'eligibility_criteria': (
            'Citizens of African countries with an excellent academic record, demonstrated financial '
            'need, and leadership potential with a commitment to community service. Applicants apply '
            "through Ashesi University's regular undergraduate admissions process; the scholarship "
            'committee separately determines award recipients from admitted students. Fully funded: 100% '
            'tuition waiver, on-campus housing and meals, and a monthly living stipend.'
        ),
        'source_url': 'https://ashesi.edu.gh/the-mastercard-foundation-scholars-programme/',
    },
]


class Command(BaseCommand):
    help = 'Seeds real Ghana regions/districts, top institutions, and verified scholarships.'

    def handle(self, *args, **options):
        district_count = 0
        for region, names in DISTRICTS_BY_REGION.items():
            for name in names:
                _, created = District.objects.get_or_create(name=name, region=region)
                if created:
                    district_count += 1
        self.stdout.write(f'Districts created: {district_count} (total: {District.objects.count()})')

        institution_count = 0
        for name, itype, region in INSTITUTIONS:
            _, created = Institution.objects.get_or_create(
                name=name, defaults={'type': itype, 'region': region}
            )
            if created:
                institution_count += 1
        self.stdout.write(f'Institutions created: {institution_count} (total: {Institution.objects.count()})')

        scholarship_count = 0
        for s in SCHOLARSHIPS:
            _, created = Scholarship.objects.get_or_create(
                title=s['title'],
                defaults={
                    'provider': s['provider'],
                    'education_level': s['education_level'],
                    'deadline': s['deadline'],
                    'eligibility_criteria': s['eligibility_criteria'],
                    'source_url': s['source_url'],
                },
            )
            if created:
                scholarship_count += 1
        self.stdout.write(f'Scholarships created: {scholarship_count} (total: {Scholarship.objects.count()})')
