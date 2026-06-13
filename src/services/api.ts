export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzYeZnKSuriJCud8cgMwPF7i2QuvkzzykVl2M9isVLLajFk5yyuOrnpFfh8VcUB9_9y/exec';
export const USE_MOCK = true;

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export async function fetchFromAPI<T = any>(
  action: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST',
  body?: Record<string, any>
): Promise<T> {
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify({ action, ...body }) : JSON.stringify({ action }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const result: APIResponse<T> = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'API request failed');
    }

    return result.data as T;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
