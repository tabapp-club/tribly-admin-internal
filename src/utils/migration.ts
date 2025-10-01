// Migration utilities for localStorage data

export function migrateLocalStorageData() {
  if (typeof window === 'undefined') return;

  try {
    // Check if auth_token exists and is not valid JSON
    const authToken = localStorage.getItem('auth_token');
    if (authToken) {
      try {
        JSON.parse(authToken);
        // If it parses successfully, it's already JSON - no migration needed
      } catch {
        // If it fails to parse, it's a plain string - keep it as is
        // This is actually the correct format for tokens
      }
    }

    // Check if user_data exists and is valid JSON
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        JSON.parse(userData);
        // If it parses successfully, it's already JSON - no migration needed
      } catch (error) {
        // If it fails to parse, remove it as it's corrupted
        localStorage.removeItem('user_data');
      }
    }

    // Clean up any other potentially corrupted data
    const keysToCheck = ['auth_token', 'user_data'];
    keysToCheck.forEach(key => {
      const value = localStorage.getItem(key);
      if (value === 'undefined' || value === 'null') {
        localStorage.removeItem(key);
      }
    });

  } catch (error) {
  }
}

// Run migration on app start
if (typeof window !== 'undefined') {
  migrateLocalStorageData();
}
