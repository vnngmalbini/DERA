"""Level-specific dropout model loading and early-warning prediction.

The checked-in demo uses transparent feature rules until approved historical
data is supplied and a scikit-learn pipeline is trained with train_dropout_models.
The API contract remains the same when model artifacts replace the demo scorer.
"""

from pathlib import Path

from .dropout_schema import LEVEL_FIELDS

MODEL_DIR = Path(__file__).resolve().parent / 'model_artifacts'
_MODEL_CACHE = {}


def _trained_model(level):
    if level in _MODEL_CACHE:
        return _MODEL_CACHE[level]
    artifact = MODEL_DIR / f'{level.lower()}_dropout.joblib'
    if not artifact.exists():
        _MODEL_CACHE[level] = None
        return None
    try:
        import joblib
        _MODEL_CACHE[level] = joblib.load(artifact)
    except (ImportError, OSError, ValueError):
        _MODEL_CACHE[level] = None
    return _MODEL_CACHE[level]


def _number(data, name, default=None):
    value = data.get(name, default)
    try:
        return float(value) if value not in (None, '') else default
    except (TypeError, ValueError):
        return default


def predict_dropout(level, data):
    score = 0.08
    factors = []

    attendance = _number(data, 'attendance_rate')
    if attendance is not None and attendance < 70:
        score += 0.24
        factors.append('Low attendance')
    average = _number(data, 'average_score', _number(data, 'cwa_cgpa'))
    if average is not None and ((level == 'TERTIARY' and average < 2.0) or (level != 'TERTIARY' and average < 50)):
        score += 0.22
        factors.append('Low academic performance')
    failed = _number(data, 'failed_subjects', 0) + _number(data, 'failed_courses', 0)
    repeated = _number(data, 'repeated_courses', 0)
    if failed >= 2 or repeated >= 1:
        score += 0.16
        factors.append('Multiple failed or repeated subjects/courses')
    if data.get('financial_difficulty') or data.get('fee_difficulty'):
        score += 0.14
        factors.append('Financial or fee difficulty')
    if data.get('accommodation_difficulty') or data.get('distance_transport_difficulty') or data.get('transport_difficulty'):
        score += 0.08
        factors.append('Accommodation or transport difficulty')
    if data.get('school_engagement') in ('Low', 'low'):
        score += 0.12
        factors.append('Low school engagement')
    if data.get('parent_guardian_support') in ('Low', 'low', 'None', 'none'):
        score += 0.08
        factors.append('Limited parent or guardian support')
    if data.get('academic_probation'):
        score += 0.12
        factors.append('Academic probation')
    if data.get('intention_to_continue_education') in ('No', 'no', 'Unsure', 'unsure'):
        score += 0.10
        factors.append('Uncertain intention to continue education')

    probability = round(min(score, 0.98), 4)
    trained_model = _trained_model(level)
    if trained_model is not None:
        ordered_data = [data.get(field, '') for field in LEVEL_FIELDS[level]]
        probability = round(float(trained_model.predict_proba([ordered_data])[0][1]), 4)
    risk_level = 'HIGH' if probability >= 0.70 else 'MEDIUM' if probability >= 0.40 else 'LOW'
    recommendations = ['Academic counselling']
    if attendance is not None and attendance < 70:
        recommendations.append('Attendance monitoring')
    if data.get('financial_difficulty') or data.get('fee_difficulty'):
        recommendations.append('Financial support assessment')
    if level == 'TERTIARY' and (data.get('academic_probation') or failed > 0):
        recommendations.append('Speak with an academic advisor')
    elif failed > 0 or (average is not None and average < 50):
        recommendations.append('Targeted learning support')
    return {
        'risk_probability': probability,
        'risk_level': risk_level,
        'risk_factors': factors or ['No major risk indicators identified'],
        'recommendations': list(dict.fromkeys(recommendations)),
        'model_version': 'synthetic-demo-v1',
    }