import uuid

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ('risk', '0002_academicrecord_counselingsession_attendancerecord'),
    ]

    operations = [
        migrations.CreateModel(
            name='DropoutRiskAssessment',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('education_level', models.CharField(choices=[('BASIC', 'Basic School'), ('JHS', 'JHS'), ('SHS', 'SHS'), ('TERTIARY', 'Tertiary')], max_length=12)),
                ('input_data', models.JSONField(default=dict)),
                ('risk_probability', models.DecimalField(decimal_places=4, max_digits=5)),
                ('risk_level', models.CharField(choices=[('LOW', 'Low Risk'), ('MEDIUM', 'Medium Risk'), ('HIGH', 'High Risk')], max_length=6)),
                ('risk_factors', models.JSONField(default=list)),
                ('recommendations', models.JSONField(default=list)),
                ('model_version', models.CharField(default='synthetic-demo-v1', max_length=50)),
                ('assessed_at', models.DateTimeField(auto_now_add=True)),
                ('counselor', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='dropout_risk_assessments', to='accounts.counselorprofile')),
                ('youth', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='dropout_risk_assessments', to='accounts.youthprofile')),
            ],
            options={'db_table': 'dropout_risk_assessments', 'ordering': ['-assessed_at']},
        ),
    ]