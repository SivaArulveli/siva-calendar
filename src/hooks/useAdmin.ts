import { useState, useEffect } from 'react';

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check local storage or URL params for admin state
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
    } else if (localStorage.getItem('isAdmin') === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const login = (passcode: string) => {
    if (passcode === 'omnamahshivaya') { // simple dummy passcode
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
    // also clear URL param if it exists
    const url = new URL(window.location.href);
    if (url.searchParams.has('admin')) {
      url.searchParams.delete('admin');
      window.history.replaceState({}, '', url.toString());
    }
  };

  return { isAdmin, login, logout };
}
