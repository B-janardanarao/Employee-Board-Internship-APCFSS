import React, { useEffect, useState } from 'react';

const greetingsByTime = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const WelcomePage = () => {
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('Guest');

  useEffect(() => {
    setGreeting(greetingsByTime());

    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user?.name) setUserName(user.name);
    }
  }, []);

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>{greeting}, {userName}!</h1>
      <p>Welcome back to your dashboard.</p>
    </div>
  );
};

export default WelcomePage;
