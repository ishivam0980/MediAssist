# Parkinson's Disease Dataset

## Dataset Information

- Source : [Parkinsons Disease Clinical Factors Dataset CSV Download Free](https://www.opendatabay.com/data/healthcare/df6ac731-2885-4b5e-b370-e3cf1d89d1d5)
- **Format**: CSV

## Attribute Information

| Column Name              | Description                                                                                                                   | Data Type   |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | ----------- |
| PatientID                | A unique identifier assigned to each patient, ranging from 3058 to 5162                                                       | Numeric     |
| Age                      | The age of the patients, spanning from 50 to 90 years (Age)                                                                   | Numeric     |
| Gender                   | Gender of the patients, with '0' representing Male and '1' representing Female (Gender)                                       | Categorical |
| Ethnicity                | The ethnicity of the patients, coded as '0': Caucasian, '1': African American, '2': Asian, '3': Other (Ethnicity)             | Categorical |
| EducationLevel           | The education level of the patients, coded as '0': None, '1': High School, '2': Bachelor's, '3': Higher (Education)           | Categorical |
| BMI                      | Body Mass Index of the patients, ranging from 15 to 40 (BMI)                                                                  | Numeric     |
| Smoking                  | Smoking status, where '0' indicates No and '1' indicates Yes (Smoker)                                                         | Categorical |
| AlcoholConsumption       | Weekly alcohol consumption in units, ranging from 0 to 20 (Alcohol)                                                           | Numeric     |
| PhysicalActivity         | Weekly physical activity in hours, ranging from 0 to 10 (Activity)                                                            | Numeric     |
| DietQuality              | Diet quality score, ranging from 0 to 10 (Diet)                                                                               | Numeric     |
| SleepQuality             | Sleep quality score, ranging from 4 to 10 (Sleep)                                                                             | Numeric     |
| FamilyHistoryParkinsons  | Family history of Parkinson's Disease, where '0' indicates No and '1' indicates Yes (Family History)                          | Categorical |
| TraumaticBrainInjury     | History of traumatic brain injury, where '0' indicates No and '1' indicates Yes (Brain Injury)                                | Categorical |
| Hypertension             | Presence of hypertension, where '0' indicates No and '1' indicates Yes (Hypertension)                                         | Categorical |
| Diabetes                 | Presence of diabetes, where '0' indicates No and '1' indicates Yes (Diabetes)                                                 | Categorical |
| Depression               | Presence of depression, where '0' indicates No and '1' indicates Yes (Depression)                                             | Categorical |
| Stroke                   | History of stroke, where '0' indicates No and '1' indicates Yes (Stroke)                                                      | Categorical |
| SystolicBP               | Systolic blood pressure, ranging from 90 to 180 mmHg (Sys BP)                                                                 | Numeric     |
| DiastolicBP              | Diastolic blood pressure, ranging from 60 to 120 mmHg (Dia BP)                                                                | Numeric     |
| CholesterolTotal         | Total cholesterol levels, ranging from 150 to 300 mg/dL (Total Chol.)                                                         | Numeric     |
| CholesterolLDL           | Low-density lipoprotein cholesterol levels, ranging from 50 to 200 mg/dL (LDL)                                                | Numeric     |
| CholesterolHDL           | High-density lipoprotein cholesterol levels, ranging from 20 to 100 mg/dL (HDL)                                               | Numeric     |
| CholesterolTriglycerides | Triglycerides levels, ranging from 50 to 400 mg/dL (Triglycerides)                                                            | Numeric     |
| UPDRS                    | Unified Parkinson's Disease Rating Scale score, ranging from 0 to 199. Higher scores indicate greater severity of the disease (UPDRS) | Numeric     |
| MoCA                     | Montreal Cognitive Assessment score, ranging from 0 to 30. Lower scores indicate cognitive impairment (MoCA)                  | Numeric     |
| FunctionalAssessment     | Functional assessment score, ranging from 0 to 10. Lower scores indicate greater impairment (Functional)                      | Numeric     |
| Tremor                   | Presence of tremor, where '0' indicates No and '1' indicates Yes (Tremor)                                                     | Categorical |
| Rigidity                 | Presence of muscle rigidity, where '0' indicates No and '1' indicates Yes (Rigidity)                                          | Categorical |
| Bradykinesia             | Presence of bradykinesia (slowness of movement), where '0' indicates No and '1' indicates Yes (Bradykinesia)                  | Categorical |
| PosturalInstability      | Presence of postural instability, where '0' indicates No and '1' indicates Yes (Postural Instability)                         | Categorical |
| SpeechProblems           | Presence of speech problems, where '0' indicates No and '1' indicates Yes (Speech Problems)                                   | Categorical |
| SleepDisorders           | Presence of sleep disorders, where '0' indicates No and '1' indicates Yes (Sleep Disorders)                                   | Categorical |
| Constipation             | Presence of constipation, where '0' indicates No and '1' indicates Yes (Constipation)                                         | Categorical |
| Diagnosis                | Diagnosis status for Parkinson's Disease, where '0' indicates No and '1' indicates Yes                                        | Categorical |
| DoctorInCharge           | This column contains confidential information, with "DrXXXConfid" as the value for all patients                               | String      |
