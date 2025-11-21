const API_BASE_URL = "/api";

export interface PredictionResponse {
  success: boolean;
  prediction?: {
    has_disease: number;
    disease_detected: boolean;
    confidence: number;
    probability: number;
  };
  risk_assessment?: {
    level: "Low" | "Moderate" | "High";
    color: "green" | "orange" | "red";
    message: string;
  };
  error?: string;
}

export async function predictDiabetes(data: any): Promise<PredictionResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/predict/diabetes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error predicting diabetes:", error);
    return { success: false, error: "Failed to connect to the server." };
  }
}

export async function predictHeartDisease(data: any): Promise<PredictionResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/predict/heart-disease`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error predicting heart disease:", error);
    return { success: false, error: "Failed to connect to the server." };
  }
}

export async function predictParkinsons(data: any): Promise<PredictionResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/predict/parkinsons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error predicting parkinsons:", error);
    return { success: false, error: "Failed to connect to the server." };
  }
}
