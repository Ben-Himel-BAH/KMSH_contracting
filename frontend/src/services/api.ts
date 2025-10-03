// API service layer for communicating with FastAPI backend
import type { Company, Contract, Location, User } from '../types';

const API_BASE_URL = 'http://localhost:8000';

// API service class
class ApiService {
  private async fetchWithErrorHandling<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API call failed for ${url}:`, error);
      throw error;
    }
  }

  // Company endpoints
  async getCompanies(): Promise<Company[]> {
    return this.fetchWithErrorHandling<Company[]>('/companies/');
  }

  async createCompany(legalName: string): Promise<Company> {
    return this.fetchWithErrorHandling<Company>('/companies/', {
      method: 'POST',
      body: JSON.stringify({ legal_name: legalName }),
    });
  }

  // Contract endpoints
  async getContracts(): Promise<Contract[]> {
    return this.fetchWithErrorHandling<Contract[]>('/contracts/');
  }

  async createContract(contractData: {
    contract_number: string;
    title: string;
    company_id: number;
    total_value: number;
    date_awarded: string;
  }): Promise<Contract> {
    return this.fetchWithErrorHandling<Contract>('/contracts/', {
      method: 'POST',
      body: JSON.stringify(contractData),
    });
  }

  // Location endpoints
  async getLocations(): Promise<Location[]> {
    return this.fetchWithErrorHandling<Location[]>('/locations/');
  }

  // User endpoints
  async getUsers(): Promise<User[]> {
    return this.fetchWithErrorHandling<User[]>('/users/');
  }

  async getUser(userId: number): Promise<User> {
    return this.fetchWithErrorHandling<User>(`/users/${userId}`);
  }

  async createUser(userData: {
    username: string;
    email: string;
    password: string;
  }): Promise<User> {
    return this.fetchWithErrorHandling<User>('/users/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId: number, userData: {
    username?: string;
    email?: string;
  }): Promise<User> {
    return this.fetchWithErrorHandling<User>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId: number): Promise<void> {
    return this.fetchWithErrorHandling<void>(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // Health check endpoint
  async healthCheck(): Promise<{ message: string }> {
    return this.fetchWithErrorHandling<{ message: string }>('/');
  }
}

// Export singleton instance
export const apiService = new ApiService();