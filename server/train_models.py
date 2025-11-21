"""
MediAssist Model Training Script
=================================

This script trains multiple machine learning models for three disease prediction tasks:
1. Diabetes prediction
2. Heart disease prediction
3. Parkinson's disease prediction

For each disease, 5 different models are trained and evaluated:
- Logistic Regression
- Decision Tree
- Random Forest
- Support Vector Machine (SVM)
- XGBoost

The best performing model for each disease is saved for deployment.
"""

import pandas as pd
import numpy as np
import pickle
import os
import warnings
from datetime import datetime

# Machine Learning Models
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from xgboost import XGBClassifier

# Evaluation Metrics
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report,
    roc_auc_score
)

warnings.filterwarnings('ignore')


class DiseaseModelTrainer:
    """
    A class to train and evaluate multiple models for disease prediction.
    """
    
    def __init__(self, disease_name, X_train, X_test, y_train, y_test):
        """
        Initialize the trainer with preprocessed data.
        
        Args:
            disease_name (str): Name of the disease (diabetes, heart_disease, parkinsons)
            X_train (DataFrame): Training features
            X_test (DataFrame): Test features
            y_train (Series): Training labels
            y_test (Series): Test labels
        """
        self.disease_name = disease_name
        self.X_train = X_train
        self.X_test = X_test
        self.y_train = y_train.values.ravel()  # Flatten to 1D array
        self.y_test = y_test.values.ravel()
        
        self.models = {}
        self.results = {}
        self.best_model = None
        self.best_model_name = None
        self.best_score = 0
        
    def initialize_models(self):
        """
        Initialize all 5 machine learning models with optimized hyperparameters.
        """
        self.models = {
            'Logistic Regression': LogisticRegression(
                max_iter=1000,
                random_state=42,
                solver='liblinear'
            ),
            'Decision Tree': DecisionTreeClassifier(
                max_depth=10,
                min_samples_split=5,
                min_samples_leaf=2,
                random_state=42
            ),
            'Random Forest': RandomForestClassifier(
                n_estimators=100,
                max_depth=15,
                min_samples_split=5,
                min_samples_leaf=2,
                random_state=42,
                n_jobs=-1
            ),
            'SVM': SVC(
                kernel='rbf',
                C=1.0,
                gamma='scale',
                probability=True,
                random_state=42
            ),
            'XGBoost': XGBClassifier(
                n_estimators=100,
                max_depth=6,
                learning_rate=0.1,
                random_state=42,
                eval_metric='logloss',
                use_label_encoder=False
            )
        }
        
        print(f"Initialized {len(self.models)} models for {self.disease_name}")
        
    def train_model(self, model_name, model):
        """
        Train a single model and return training time.
        
        Args:
            model_name (str): Name of the model
            model: Sklearn/XGBoost model instance
            
        Returns:
            float: Training time in seconds
        """
        start_time = datetime.now()
        model.fit(self.X_train, self.y_train)
        end_time = datetime.now()
        training_time = (end_time - start_time).total_seconds()
        
        return training_time
        
    def evaluate_model(self, model_name, model):
        """
        Evaluate a trained model and calculate all performance metrics.
        
        Args:
            model_name (str): Name of the model
            model: Trained model instance
            
        Returns:
            dict: Dictionary containing all evaluation metrics
        """
        # Make predictions
        y_pred = model.predict(self.X_test)
        y_pred_proba = model.predict_proba(self.X_test)[:, 1] if hasattr(model, 'predict_proba') else None
        
        # Calculate metrics
        accuracy = accuracy_score(self.y_test, y_pred)
        precision = precision_score(self.y_test, y_pred, zero_division=0)
        recall = recall_score(self.y_test, y_pred, zero_division=0)
        f1 = f1_score(self.y_test, y_pred, zero_division=0)
        
        # ROC AUC Score (if probability predictions available)
        try:
            roc_auc = roc_auc_score(self.y_test, y_pred_proba) if y_pred_proba is not None else None
        except:
            roc_auc = None
        
        # Confusion Matrix
        cm = confusion_matrix(self.y_test, y_pred)
        tn, fp, fn, tp = cm.ravel() if cm.size == 4 else (0, 0, 0, 0)
        
        # Specificity
        specificity = tn / (tn + fp) if (tn + fp) > 0 else 0
        
        metrics = {
            'model_name': model_name,
            'accuracy': accuracy,
            'precision': precision,
            'recall': recall,
            'f1_score': f1,
            'roc_auc': roc_auc,
            'specificity': specificity,
            'confusion_matrix': cm,
            'true_negatives': int(tn),
            'false_positives': int(fp),
            'false_negatives': int(fn),
            'true_positives': int(tp)
        }
        
        return metrics
        
    def train_all_models(self):
        """
        Train and evaluate all models, tracking the best performer.
        """
        print(f"\n{'='*70}")
        print(f"Training Models for {self.disease_name.upper().replace('_', ' ')}")
        print(f"{'='*70}\n")
        
        self.initialize_models()
        
        for model_name, model in self.models.items():
            print(f"Training {model_name}...")
            
            # Train the model
            training_time = self.train_model(model_name, model)
            
            # Evaluate the model
            metrics = self.evaluate_model(model_name, model)
            metrics['training_time'] = training_time
            
            # Store results
            self.results[model_name] = {
                'model': model,
                'metrics': metrics
            }
            
            # Track best model based on F1 Score (balanced metric for medical data)
            if metrics['f1_score'] > self.best_score:
                self.best_score = metrics['f1_score']
                self.best_model = model
                self.best_model_name = model_name
            
            # Print metrics
            print(f"  Accuracy:  {metrics['accuracy']:.4f}")
            print(f"  Precision: {metrics['precision']:.4f}")
            print(f"  Recall:    {metrics['recall']:.4f}")
            print(f"  F1 Score:  {metrics['f1_score']:.4f}")
            if metrics['roc_auc']:
                print(f"  ROC AUC:   {metrics['roc_auc']:.4f}")
            print(f"  Training Time: {training_time:.2f}s")
            print()
        
    def display_results_summary(self):
        """
        Display a comprehensive summary of all model performances.
        """
        print(f"\n{'='*70}")
        print(f"RESULTS SUMMARY - {self.disease_name.upper().replace('_', ' ')}")
        print(f"{'='*70}\n")
        
        # Create comparison table
        print(f"{'Model':<25} {'Accuracy':<10} {'Precision':<10} {'Recall':<10} {'F1 Score':<10}")
        print(f"{'-'*70}")
        
        for model_name, result in self.results.items():
            metrics = result['metrics']
            marker = " *BEST*" if model_name == self.best_model_name else ""
            print(f"{model_name:<25} "
                  f"{metrics['accuracy']:<10.4f} "
                  f"{metrics['precision']:<10.4f} "
                  f"{metrics['recall']:<10.4f} "
                  f"{metrics['f1_score']:<10.4f}"
                  f"{marker}")
        
        print(f"\n{'='*70}")
        print(f"BEST MODEL: {self.best_model_name}")
        print(f"F1 Score: {self.best_score:.4f}")
        
        # Display confusion matrix for best model
        best_metrics = self.results[self.best_model_name]['metrics']
        print(f"\nConfusion Matrix (Best Model):")
        print(f"  True Negatives:  {best_metrics['true_negatives']}")
        print(f"  False Positives: {best_metrics['false_positives']}")
        print(f"  False Negatives: {best_metrics['false_negatives']}")
        print(f"  True Positives:  {best_metrics['true_positives']}")
        print(f"{'='*70}\n")
        
    def save_best_model(self, output_dir='models'):
        """
        Save the best performing model to disk.
        
        Args:
            output_dir (str): Directory to save the model
        """
        # Create models directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
        
        # Save the model
        model_filename = f"{output_dir}/{self.disease_name}_model.pkl"
        with open(model_filename, 'wb') as f:
            pickle.dump(self.best_model, f)
        
        # Save model metadata
        metadata = {
            'disease': self.disease_name,
            'model_name': self.best_model_name,
            'metrics': self.results[self.best_model_name]['metrics'],
            'training_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'train_samples': len(self.X_train),
            'test_samples': len(self.X_test),
            'features': list(self.X_train.columns)
        }
        
        metadata_filename = f"{output_dir}/{self.disease_name}_metadata.pkl"
        with open(metadata_filename, 'wb') as f:
            pickle.dump(metadata, f)
        
        print(f"Saved best model ({self.best_model_name}) to {model_filename}")
        print(f"Saved model metadata to {metadata_filename}")
        
    def save_all_results(self, output_dir='models'):
        """
        Save detailed results of all models to a CSV file.
        
        Args:
            output_dir (str): Directory to save the results
        """
        os.makedirs(output_dir, exist_ok=True)
        
        results_data = []
        for model_name, result in self.results.items():
            metrics = result['metrics']
            results_data.append({
                'Disease': self.disease_name,
                'Model': model_name,
                'Accuracy': metrics['accuracy'],
                'Precision': metrics['precision'],
                'Recall': metrics['recall'],
                'F1_Score': metrics['f1_score'],
                'ROC_AUC': metrics['roc_auc'] if metrics['roc_auc'] else 'N/A',
                'Specificity': metrics['specificity'],
                'Training_Time': metrics['training_time'],
                'True_Negatives': metrics['true_negatives'],
                'False_Positives': metrics['false_positives'],
                'False_Negatives': metrics['false_negatives'],
                'True_Positives': metrics['true_positives']
            })
        
        results_df = pd.DataFrame(results_data)
        results_filename = f"{output_dir}/{self.disease_name}_results.csv"
        results_df.to_csv(results_filename, index=False)
        
        print(f"Saved detailed results to {results_filename}\n")


def load_preprocessed_data(disease_name):
    """
    Load preprocessed training and test data for a specific disease.
    
    Args:
        disease_name (str): Name of the disease dataset to load
        
    Returns:
        tuple: (X_train, X_test, y_train, y_test)
    """
    base_path = 'data/processed'
    
    try:
        X_train = pd.read_csv(f'{base_path}/{disease_name}_X_train.csv')
        X_test = pd.read_csv(f'{base_path}/{disease_name}_X_test.csv')
        y_train = pd.read_csv(f'{base_path}/{disease_name}_y_train.csv')
        y_test = pd.read_csv(f'{base_path}/{disease_name}_y_test.csv')
        
        print(f"Loaded {disease_name} data:")
        print(f"  Training samples: {X_train.shape[0]}")
        print(f"  Test samples: {X_test.shape[0]}")
        print(f"  Number of features: {X_train.shape[1]}")
        
        return X_train, X_test, y_train, y_test
        
    except FileNotFoundError as e:
        print(f"ERROR: Could not find preprocessed data for {disease_name}")
        print(f"Please run data_preprocessing.py first to generate the required files.")
        raise e


def main():
    """
    Main function to train models for all three diseases.
    """
    print("\n" + "="*70)
    print("MediAssist Model Training Pipeline")
    print("="*70)
    print(f"Training 5 models for each of 3 diseases (15 total models)")
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*70 + "\n")
    
    diseases = ['diabetes', 'heart_disease', 'parkinsons']
    all_results = []
    
    start_time = datetime.now()
    
    for disease in diseases:
        try:
            # Load preprocessed data
            X_train, X_test, y_train, y_test = load_preprocessed_data(disease)
            
            # Initialize trainer
            trainer = DiseaseModelTrainer(disease, X_train, X_test, y_train, y_test)
            
            # Train all models
            trainer.train_all_models()
            
            # Display results
            trainer.display_results_summary()
            
            # Save best model
            trainer.save_best_model()
            
            # Save all results
            trainer.save_all_results()
            
            all_results.append(trainer)
            
        except Exception as e:
            print(f"ERROR: Failed to train models for {disease}")
            print(f"Error message: {str(e)}\n")
            continue
    
    end_time = datetime.now()
    total_time = (end_time - start_time).total_seconds()
    
    # Final Summary
    print("\n" + "="*70)
    print("FINAL SUMMARY - ALL DISEASES")
    print("="*70 + "\n")
    
    for trainer in all_results:
        print(f"{trainer.disease_name.upper().replace('_', ' ')}:")
        print(f"  Best Model: {trainer.best_model_name}")
        print(f"  F1 Score: {trainer.best_score:.4f}")
        best_metrics = trainer.results[trainer.best_model_name]['metrics']
        print(f"  Accuracy: {best_metrics['accuracy']:.4f}")
        print(f"  Precision: {best_metrics['precision']:.4f}")
        print(f"  Recall: {best_metrics['recall']:.4f}")
        print()
    
    print("="*70)
    print(f"Total training time: {total_time:.2f} seconds ({total_time/60:.2f} minutes)")
    print(f"Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*70)
    print("\nAll models saved to 'models/' directory")
    print("Ready for deployment!\n")


if __name__ == "__main__":
    main()
