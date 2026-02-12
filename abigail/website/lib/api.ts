/**
 * API client for communicating with the FastAPI backend.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface GenerateReadingRequest {
  card_ids: number[];
  language: string;
  question: string;
}

export interface CardInfo {
  id: number;
  name_key: string;
  meaning: string;
}

export interface GenerateReadingResponse {
  reading_text: string;
  cards: CardInfo[];
  language: string;
  metadata?: {
    generation_method: string;
    generation_time_ms: number;
    llm_enabled: boolean;
  };
}

export async function generateReading(
  request: GenerateReadingRequest
): Promise<GenerateReadingResponse> {
  try {
    console.log('Calling API:', `${API_BASE_URL}/api/generate-reading`, request);
    const response = await fetch(`${API_BASE_URL}/api/generate-reading`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    console.log('API Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.detail || `API request failed with status ${response.status}`;
      console.error('API Error Response:', errorData);
      throw new Error(errorMessage);
    }

    const data: GenerateReadingResponse = await response.json();
    console.log('API Success Response:', data);
    return data;
  } catch (error) {
    console.error('Error in generateReading API call:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate reading: ${error.message}`);
    }
    throw new Error('Failed to generate reading: Unknown error');
  }
}




