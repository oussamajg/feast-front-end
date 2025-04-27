
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the home page instead of login page
    navigate('/');
  }, [navigate]);

  return null;
};

export default Index;
