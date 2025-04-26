
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the login page instead of root path
    navigate('/login');
  }, [navigate]);

  return null;
};

export default Index;
