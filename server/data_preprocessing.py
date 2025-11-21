"""
MediAssist Data Preprocessing Script
===================================

This script provides comprehensive data preprocessing functions for three healthcare datasets:
1. Diabetes prediction dataset
2. Heart disease prediction dataset  
3. Parkinson's disease prediction dataset

Each function handles the complete preprocessing pipeline: loading, cleaning, splitting, and scaling.

"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import LabelEncoder
import joblib
import os
import warnings
warnings.filterwarnings('ignore')

def preprocess_diabetes_data(filepath):
    """
    Preprocess diabetes dataset for machine learning model training.
    
    Dataset Columns: ['ID', 'No_Pation', 'Gender', 'AGE', 'Urea', 'Cr', 'HbA1c', 
                      'Chol', 'TG', 'HDL', 'LDL', 'VLDL', 'BMI', 'CLASS']
    Target Column: 'CLASS' (N = No Diabetes, P = Positive/Has Diabetes, Y = Yes/Has Diabetes)
    
    Args:
        filepath (str): Path to the diabetes CSV dataset
        
    Returns:
        tuple: (X_train_scaled, X_test_scaled, y_train, y_test)
            - X_train_scaled: Scaled training features (pandas DataFrame)
            - X_test_scaled: Scaled test features (pandas DataFrame) 
            - y_train: Training target labels (pandas Series)
            - y_test: Test target labels (pandas Series)
    """
    print("Processing Diabetes Dataset...")
    
    # 1. Load Data
    df = pd.read_csv(filepath)
    print(f"   Loaded {len(df)} records with {len(df.columns)} columns")
    
    # 2. Handle Missing Values and Data Cleaning
    # Drop unnecessary identifier columns
    df = df.drop(['ID', 'No_Pation'], axis=1, errors='ignore')
    
    # Handle categorical variables - encode Gender
    if 'Gender' in df.columns:
        le_gender = LabelEncoder()
        df['Gender'] = le_gender.fit_transform(df['Gender'])
    
    # Check for NaN values in the target column
    if df['CLASS'].isna().any():
        print(f"   WARNING: Found {df['CLASS'].isna().sum()} NaN values in target column. Dropping these rows.")
        df = df.dropna(subset=['CLASS'])
    
    # Replace any 0 values with median only in columns where 0 is likely a missing value indicator
    columns_to_fix = ['Urea', 'Cr', 'HbA1c', 'Chol', 'BMI']  # Critical health metrics that shouldn't be 0
    for col in columns_to_fix:
        if col in df.columns:  # Still check if column exists for safety
            median_val = df[col].median()
            df[col] = df[col].replace(0, median_val)
    
    print(f"   Cleaned data: {len(df)} records remaining")
    
    # 3. Separate Features and Target
    # Convert target labels to binary (0 = No Diabetes, 1 = Has Diabetes)
    target_mapping = {'N': 0, 'P': 1, 'Y': 1}
    df['CLASS'] = df['CLASS'].map(target_mapping)
    
    # Check if any values couldn't be mapped (became NaN)
    if df['CLASS'].isna().any():
        print(f"   WARNING: Found {df['CLASS'].isna().sum()} unmapped values in CLASS column. Values found: {set(df['CLASS'].unique()) - set([0, 1])}")
        print("   INFO: Dropping rows with unmapped target values.")
        df = df.dropna(subset=['CLASS'])
    if df['CLASS'].isna().any():
        print(f"   WARNING: Found {df['CLASS'].isna().sum()} unmapped values in CLASS column. Values found: {df['CLASS'].unique()}")
        print("   INFO: Dropping rows with unmapped target values.")
        df = df.dropna(subset=['CLASS'])
    
    X = df.drop('CLASS', axis=1)
    y = df['CLASS']
    
    print(f"   Features shape: {X.shape}, Target distribution: {y.value_counts().to_dict()}")
    
    # 4. Split Data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"   Train set: {X_train.shape[0]} samples, Test set: {X_test.shape[0]} samples")
    
    # 5. Scale Numerical Features
    scaler = StandardScaler()
    
    # Fit scaler only on training data
    X_train_scaled = pd.DataFrame(
        scaler.fit_transform(X_train),
        columns=X_train.columns,
        index=X_train.index
    )
    
    # Transform test data using the fitted scaler
    X_test_scaled = pd.DataFrame(
        scaler.transform(X_test),
        columns=X_test.columns,
        index=X_test.index
    )
    
    print(f"   Features scaled using StandardScaler")
    print(f"   Diabetes preprocessing completed!\n")
    
    return X_train_scaled, X_test_scaled, y_train, y_test, scaler


def preprocess_heart_disease_data(filepath):
    """
    Preprocess heart disease dataset for machine learning model training.
    
    Dataset Columns: ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 
                      'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal', 'target']
    Target Column: 'target' (0 = No Heart Disease, 1 = Has Heart Disease)
    
    Args:
        filepath (str): Path to the heart disease CSV dataset
        
    Returns:
        tuple: (X_train_scaled, X_test_scaled, y_train, y_test)
    """
    print("Processing Heart Disease Dataset...")
    
    # 1. Load Data
    df = pd.read_csv(filepath)
    print(f"   Loaded {len(df)} records with {len(df.columns)} columns")
    
    # 2. Handle Missing Values    
 
    # Some datasets have '?' as missing value indicator
    df = df.replace('?', np.nan)
    
    # Convert string columns to numeric
    for col in df.columns:
        if col != 'target' and df[col].dtype == 'object':
            print(f"   Converting column '{col}' from string to numeric")
            df[col] = pd.to_numeric(df[col], errors='coerce')  # 'coerce' will convert non-convertible values to NaN
        
    # Fill any NaN values with median
    for col in df.columns:
        if col != 'target' and df[col].isnull().sum() > 0:
            df[col].fillna(df[col].median(), inplace=True)
    
    print(f"   Cleaned data: {len(df)} records remaining")
    
    # 3. Separate Features and Target
    X = df.drop('target', axis=1)
    y = df['target']
    
    print(f"   Features shape: {X.shape}, Target distribution: {y.value_counts().to_dict()}")
    
    # 4. Split Data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"   Train set: {X_train.shape[0]} samples, Test set: {X_test.shape[0]} samples")
    
    # 5. Scale Numerical Features
    scaler = StandardScaler()
    
    # Fit scaler only on training data
    X_train_scaled = pd.DataFrame(
        scaler.fit_transform(X_train),
        columns=X_train.columns,
        index=X_train.index
    )
    
    # Transform test data using the fitted scaler
    X_test_scaled = pd.DataFrame(
        scaler.transform(X_test),
        columns=X_test.columns,
        index=X_test.index
    )
    
    print(f"   Features scaled using StandardScaler")
    print(f"   Heart Disease preprocessing completed!\n")
    
    return X_train_scaled, X_test_scaled, y_train, y_test, scaler


def preprocess_parkinsons_data(filepath):
    """
    Preprocess Parkinson's disease dataset for machine learning model training.
    
    Dataset Columns: ['PatientID', 'Age', 'Gender', 'Ethnicity', 'EducationLevel', 'BMI', 
                      'Smoking', 'AlcoholConsumption', 'PhysicalActivity', 'DietQuality', 
                      'SleepQuality', ..., 'Diagnosis', 'DoctorInCharge']
    Target Column: 'Diagnosis' (0 = No Parkinson's, 1 = Has Parkinson's)
    
    Args:
        filepath (str): Path to the Parkinson's CSV dataset
        
    Returns:
        tuple: (X_train_scaled, X_test_scaled, y_train, y_test)
    """
    print("Processing Parkinson's Disease Dataset...")
    
    # 1. Load Data
    df = pd.read_csv(filepath)
    print(f"   Loaded {len(df)} records with {len(df.columns)} columns")
    
    # 2. Handle Irrelevant Columns
    # Drop identifier and irrelevant columns
    columns_to_drop = ['PatientID', 'DoctorInCharge']
    df = df.drop(columns_to_drop, axis=1, errors='ignore')
    
    # Handle missing values
    null_counts = df.isnull().sum()
    if null_counts.sum() > 0:
        print(f" Found missing values: {dict(null_counts[null_counts > 0])}")
        
        # Explicitly define categorical columns
        categorical_cols = ['Gender', 'Ethnicity', 'EducationLevel', 'Smoking', 
                           'FamilyHistoryParkinsons', 'TraumaticBrainInjury', 
                           'Hypertension', 'Diabetes', 'Depression', 'Stroke',
                           'Tremor', 'Rigidity', 'Bradykinesia', 'PosturalInstability', 
                           'SpeechProblems', 'SleepDisorders', 'Constipation']
        
        # Fill missing values appropriately
        for col in df.columns:
            if col != 'Diagnosis':
                if col in categorical_cols:
                    # For categorical columns, fill with mode
                    df[col].fillna(df[col].mode()[0], inplace=True)
                else:
                    # For numerical columns, fill with median
                    df[col].fillna(df[col].median(), inplace=True)
    
    print(f" Cleaned data: {len(df)} records remaining")
    
    # 3. Separate Features and Target
    X = df.drop('Diagnosis', axis=1)
    y = df['Diagnosis']
    
    # Ensure target is binary (0/1)
    if y.dtype == 'object' or y.nunique() > 2:
        le_target = LabelEncoder()
        y = le_target.fit_transform(y)
    
    print(f"   Features shape: {X.shape}, Target distribution: {pd.Series(y).value_counts().to_dict()}")
    
    # 4. Split Data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"   Train set: {X_train.shape[0]} samples, Test set: {X_test.shape[0]} samples")
    
    # 5. Scale Numerical Features
    scaler = StandardScaler()
    
    # Fit scaler only on training data
    X_train_scaled = pd.DataFrame(
        scaler.fit_transform(X_train),
        columns=X_train.columns,
        index=X_train.index
    )
    
    # Transform test data using the fitted scaler
    X_test_scaled = pd.DataFrame(
        scaler.transform(X_test),
        columns=X_test.columns,
        index=X_test.index
    )
    
    print(f"   Features scaled using StandardScaler")
    print(f"   Parkinson's preprocessing completed!\n")
    
    return X_train_scaled, X_test_scaled, y_train, y_test, scaler


def save_preprocessed_data(X_train, X_test, y_train, y_test, scaler, dataset_name, output_dir='data/processed/'):
    """
    Save preprocessed data to CSV files for later use.
    
    Args:
        X_train, X_test, y_train, y_test: Preprocessed data
        scaler: The fitted StandardScaler object
        dataset_name (str): Name of the dataset (e.g., 'diabetes')
        output_dir (str): Directory to save the processed files
    """
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    os.makedirs('models', exist_ok=True)
    
    # Save the data
    X_train.to_csv(f"{output_dir}{dataset_name}_X_train.csv", index=False)
    X_test.to_csv(f"{output_dir}{dataset_name}_X_test.csv", index=False)
    y_train.to_csv(f"{output_dir}{dataset_name}_y_train.csv", index=False)
    y_test.to_csv(f"{output_dir}{dataset_name}_y_test.csv", index=False)
    
    # Save the scaler to models directory for API use
    scaler_path = f"models/{dataset_name}_scaler.pkl"
    joblib.dump(scaler, scaler_path)
    
    print(f"Saved {dataset_name} preprocessed data to {output_dir}")
    print(f"Saved {dataset_name} scaler to {scaler_path}")


if __name__ == "__main__":
    """
    Demonstration of how to use the preprocessing functions.
    """
    print("MediAssist Data Preprocessing Pipeline")
    print("=" * 50)
    
    # Define file paths based on your project structure
    diabetes_path = "data/raw/diabetes/diabetes_dataset.csv"
    heart_disease_path = "data/raw/heart_disease/heart_disease_dataset.csv"
    parkinsons_path = "data/raw/parkinsons/parkinsons_dataset.csv"
    
    try:
        # 1. Preprocess Diabetes Data
        print("1. DIABETES DATASET")
        print("-" * 30)
        X_train_diabetes, X_test_diabetes, y_train_diabetes, y_test_diabetes, scaler_diabetes = preprocess_diabetes_data(diabetes_path)
        
        # Save preprocessed diabetes data
        save_preprocessed_data(X_train_diabetes, X_test_diabetes, y_train_diabetes, y_test_diabetes, scaler_diabetes, 'diabetes')
        
        # 2. Preprocess Heart Disease Data
        print("2. HEART DISEASE DATASET")
        print("-" * 30)
        X_train_heart, X_test_heart, y_train_heart, y_test_heart, scaler_heart = preprocess_heart_disease_data(heart_disease_path)
        
        # Save preprocessed heart disease data
        save_preprocessed_data(X_train_heart, X_test_heart, y_train_heart, y_test_heart, scaler_heart, 'heart_disease')
        
        # 3. Preprocess Parkinson's Data
        print("3. PARKINSON'S DATASET")
        print("-" * 30)
        X_train_parkinsons, X_test_parkinsons, y_train_parkinsons, y_test_parkinsons, scaler_parkinsons = preprocess_parkinsons_data(parkinsons_path)
        
        # Save preprocessed Parkinson's data
        save_preprocessed_data(X_train_parkinsons, X_test_parkinsons, y_train_parkinsons, y_test_parkinsons, scaler_parkinsons, 'parkinsons')
        
        print("ALL PREPROCESSING COMPLETED SUCCESSFULLY!")
        print("=" * 50)
        print("Summary:")
        print(f"   - Diabetes: {X_train_diabetes.shape[0]} train, {X_test_diabetes.shape[0]} test samples")
        print(f"   - Heart Disease: {X_train_heart.shape[0]} train, {X_test_heart.shape[0]} test samples") 
        print(f"   - Parkinson's: {X_train_parkinsons.shape[0]} train, {X_test_parkinsons.shape[0]} test samples")
        print(f"   - All data saved to 'data/processed/' directory")
        print("\nReady for model training!")
        
    except FileNotFoundError as e:
        print(f"ERROR: Dataset file not found - {e}")
        print("Please ensure the CSV files are in the correct directories:")
        print(f"   - {diabetes_path}")
        print(f"   - {heart_disease_path}")
        print(f"   - {parkinsons_path}")
        
    except Exception as e:
        print(f"ERROR: An error occurred during preprocessing: {e}")
        print("Please check your data files and try again.")