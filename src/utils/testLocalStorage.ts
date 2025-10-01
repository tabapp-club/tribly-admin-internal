// Test utility to verify localStorage fix

export function testLocalStorageFix() {
  if (typeof window === 'undefined') return;

  console.log('Testing localStorage fix...');

  // Test 1: Store a plain string token
  localStorage.setItem('test_token', 'test_token_123');
  const retrievedToken = localStorage.getItem('test_token');
  console.log('Test 1 - Plain string token:', retrievedToken);

  // Test 2: Store a JSON object
  const userData = { id: '1', name: 'Test User' };
  localStorage.setItem('test_user', JSON.stringify(userData));
  const retrievedUser = localStorage.getItem('test_user');
  console.log('Test 2 - JSON object:', retrievedUser);

  // Test 3: Try to parse both
  try {
    const parsedToken = JSON.parse(retrievedToken || '');
    console.log('Test 3a - Token parsed as JSON:', parsedToken);
  } catch (error) {
    console.log('Test 3a - Token is plain string (expected):', retrievedToken);
  }

  try {
    const parsedUser = JSON.parse(retrievedUser || '');
    console.log('Test 3b - User parsed as JSON:', parsedUser);
  } catch (error) {
    console.log('Test 3b - User parse failed:', error);
  }

  // Clean up
  localStorage.removeItem('test_token');
  localStorage.removeItem('test_user');

  console.log('LocalStorage fix test completed');
}

// Run test in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Uncomment the line below to run the test
  // testLocalStorageFix();
}
