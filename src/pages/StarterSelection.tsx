import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { StarterPackageSelection } from '@/components/StarterPackageSelection';
import { Publication } from '@/types';

const StarterSelection = () => {
  const navigate = useNavigate();

  const handleSelectionComplete = (selectedPublication: Publication) => {
    // Navigate to checkout with the selected publication
    navigate('/checkout', {
      state: {
        packageType: 'starter',
        selectedStarterPublication: selectedPublication,
        selectedPublications: []
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <StarterPackageSelection onSelectionComplete={handleSelectionComplete} />
    </div>
  );
};

export default StarterSelection;