class AuthStore {
  private accessToken: string | null = null;

  async initializeAuth() {
    try {
      const response = await fetch('http://localhost:8000/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        this.setToken(data.accessToken);
        return true;
      }
    } catch {
      // silent fail
    }

    this.clearToken();
    return false;
  }

  setToken(token: string) {
    this.accessToken = token;
  }

  getToken() {
    return this.accessToken;
  }

  clearToken() {
    this.accessToken = null;
  }
}

export const authStore = new AuthStore();
