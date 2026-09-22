"""Field schema shared by validation, training documentation, and the API."""

LEVEL_FIELDS = {
    'BASIC': {
        'age': 'number', 'class_level': 'text', 'attendance_rate': 'number', 'average_score': 'number',
        'previous_academic_performance': 'number', 'days_absent': 'number', 'assignment_completion': 'number',
        'parent_guardian_support': 'choice', 'financial_difficulty': 'boolean',
        'distance_transport_difficulty': 'boolean', 'school_engagement': 'choice',
        'repeated_class': 'boolean', 'disciplinary_incidents': 'number',
    },
    'JHS': {
        'age': 'number', 'class_level': 'text', 'attendance_rate': 'number', 'average_score': 'number',
        'previous_academic_performance': 'number', 'failed_subjects': 'number', 'days_absent': 'number',
        'assignment_completion': 'number', 'repeated_class': 'boolean', 'parent_guardian_support': 'choice',
        'financial_difficulty': 'boolean', 'fee_difficulty': 'boolean', 'school_engagement': 'choice',
        'study_hours': 'number', 'distance_transport_difficulty': 'boolean',
        'disciplinary_incidents': 'number', 'intention_to_continue_education': 'choice',
    },
    'SHS': {
        'age': 'number', 'class_level': 'text', 'programme': 'text', 'attendance_rate': 'number',
        'average_score': 'number', 'previous_academic_performance': 'number', 'failed_subjects': 'number',
        'assignment_completion': 'number', 'repeated_class': 'boolean', 'parent_guardian_support': 'choice',
        'financial_difficulty': 'boolean', 'fee_difficulty': 'boolean', 'school_engagement': 'choice',
        'study_hours': 'number', 'internet_access': 'boolean', 'device_access': 'boolean',
        'accommodation_difficulty': 'boolean', 'transport_difficulty': 'boolean',
        'disciplinary_incidents': 'number', 'intention_to_continue_education': 'choice',
    },
    'TERTIARY': {
        'age': 'number', 'class_level': 'text', 'programme': 'text', 'cwa_cgpa': 'number',
        'previous_semester_cwa_cgpa': 'number', 'attendance_rate': 'number', 'failed_courses': 'number',
        'repeated_courses': 'number', 'assignment_completion': 'number', 'academic_probation': 'boolean',
        'fee_difficulty': 'boolean', 'financial_difficulty': 'boolean', 'accommodation_difficulty': 'boolean',
        'employment_status': 'choice', 'working_hours_per_week': 'number', 'study_hours': 'number',
        'internet_access': 'boolean', 'device_access': 'boolean', 'school_engagement': 'choice',
        'intention_to_continue_education': 'choice',
    },
}

EDUCATION_LEVELS = tuple(LEVEL_FIELDS)