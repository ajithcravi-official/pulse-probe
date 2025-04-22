import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../shared/interface/api-response.interface';

interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

interface LoginDto {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_BASE = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  register(data: RegisterDto): Observable<ApiResponse<RegisterDto>> {
    return this.http.post<ApiResponse<RegisterDto>>(
      `${this.API_BASE}/register`,
      data
    );
  }

  login(data: LoginDto): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(
      `${this.API_BASE}/login`,
      data
    );
  }

  storeToken(token: string) {
    localStorage.setItem('access_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  logout() {
    localStorage.removeItem('access_token');
  }
}
