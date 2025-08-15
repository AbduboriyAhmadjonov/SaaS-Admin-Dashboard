// services/authStore.ts
class AuthStore {
  private accessToken: string | null = null;
  private isInitializing = false;
  private initPromise: Promise<boolean> | null = null;

  async initializeAuth(): Promise<boolean> {
    // Prevent multiple initialization calls (Race condition fix)
    if (this.initPromise) {
      return this.initPromise;
    }

    if (this.isInitializing) {
      return false;
    }

    this.isInitializing = true;

    this.initPromise = this.performInitialization();
    const result = await this.initPromise;

    this.isInitializing = false;
    this.initPromise = null;

    return result;
  }

  private async performInitialization(): Promise<boolean> {
    try {
      // If we already have a token, verify it's still valid
      if (this.accessToken) {
        const isValid = await this.verifyToken();
        if (isValid) return true;
        this.clearToken();
      }

      // Try to refresh token from httpOnly cookie
      const refreshed = await this.refreshTokenSilently();
      return refreshed;
    } catch (error) {
      console.error('Auth initialization failed:', error);
      this.clearToken();
      return false;
    }
  }

  private async verifyToken(): Promise<boolean> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/auth/verify`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );
      return response.ok;
    } catch {
      return false;
    }
  }

  private async refreshTokenSilently(): Promise<boolean> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/auth/refresh`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        this.setToken(data.accessToken);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  async refreshAccessToken(): Promise<{ accessToken: string } | null> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/auth/refresh`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        this.clearToken();
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      this.setToken(data.accessToken);
      return data;
    } catch (error) {
      this.clearToken();
      throw error;
    }
  }

  setToken(token: string) {
    this.accessToken = token;
  }

  getToken(): string | null {
    return this.accessToken;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  clearToken() {
    this.accessToken = null;
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      this.clearToken();
    }
  }
}

export const authStore = new AuthStore();
