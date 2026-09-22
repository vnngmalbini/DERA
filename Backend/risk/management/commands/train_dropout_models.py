"""Validate an approved labelled CSV before training level-specific models."""

import csv
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError

from risk.dropout_schema import LEVEL_FIELDS


class Command(BaseCommand):
    help = 'Validate a labelled dropout CSV supplied by an approved data owner.'

    def add_arguments(self, parser):
        parser.add_argument('dataset', type=str)

    def handle(self, *args, **options):
        dataset = Path(options['dataset'])
        if not dataset.exists():
            raise CommandError('Dataset not found. Provide an approved labelled CSV; no outcomes are fabricated.')
        with dataset.open(newline='', encoding='utf-8') as source:
            rows = list(csv.DictReader(source))
        if not rows or 'at_risk' not in rows[0] or 'education_level' not in rows[0]:
            raise CommandError('Dataset must include education_level and at_risk columns.')
        try:
            import joblib
            from sklearn.compose import ColumnTransformer
            from sklearn.impute import SimpleImputer
            from sklearn.linear_model import LogisticRegression
            from sklearn.metrics import confusion_matrix, f1_score, precision_score, recall_score, roc_auc_score
            from sklearn.model_selection import train_test_split
            from sklearn.pipeline import Pipeline
            from sklearn.preprocessing import OneHotEncoder, StandardScaler
        except ImportError as exc:
            raise CommandError('Install backend requirements before training: scikit-learn and joblib are required.') from exc

        output_dir = Path(__file__).resolve().parents[2] / 'model_artifacts'
        output_dir.mkdir(exist_ok=True)
        for level, schema in LEVEL_FIELDS.items():
            level_rows = [row for row in rows if row.get('education_level') == level]
            if len(level_rows) < 10 or len({row['at_risk'] for row in level_rows}) < 2:
                self.stdout.write(self.style.WARNING(f'Skipping {level}: need at least 10 rows and both target classes.'))
                continue
            columns = list(schema)
            numeric = [index for index, name in enumerate(columns) if schema[name] == 'number']
            categorical = [index for index, name in enumerate(columns) if schema[name] != 'number']
            transformer = ColumnTransformer([
                ('numeric', Pipeline([('imputer', SimpleImputer(strategy='median')), ('scale', StandardScaler())]), numeric),
                ('categorical', Pipeline([('imputer', SimpleImputer(strategy='most_frequent')), ('encode', OneHotEncoder(handle_unknown='ignore'))]), categorical),
            ])
            pipeline = Pipeline([
                ('preprocess', transformer),
                ('model', LogisticRegression(max_iter=1000, class_weight='balanced')),
            ])
            features = [[row.get(column, '') for column in columns] for row in level_rows]
            targets = [int(row['at_risk']) for row in level_rows]
            train_x, test_x, train_y, test_y = train_test_split(features, targets, test_size=0.2, random_state=42, stratify=targets)
            pipeline.fit(train_x, train_y)
            probabilities = pipeline.predict_proba(test_x)[:, 1]
            predicted = [int(value >= 0.5) for value in probabilities]
            metrics = {
                'precision': precision_score(test_y, predicted, zero_division=0),
                'recall': recall_score(test_y, predicted, zero_division=0),
                'f1': f1_score(test_y, predicted, zero_division=0),
                'roc_auc': roc_auc_score(test_y, probabilities),
                'confusion_matrix': confusion_matrix(test_y, predicted).tolist(),
            }
            artifact = output_dir / f'{level.lower()}_dropout.joblib'
            joblib.dump(pipeline, artifact)
            self.stdout.write(self.style.SUCCESS(f'{level}: {metrics}; saved {artifact}'))