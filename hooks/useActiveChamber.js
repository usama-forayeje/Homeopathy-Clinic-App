import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import chambersService from '@/services/chambers';

export function useActiveChamber() {
  const [activeChamberId, setActiveChamberId] = useState(null);

  const { data: chambers, isLoading: chambersLoading } = useQuery({
    queryKey: ['chambers'],
    queryFn: () => chambersService.getChambers(),
  });

  useEffect(() => {
    const storedChamber = localStorage.getItem('activeChamberId');
    if (storedChamber && chambers && chambers.some(c => c.$id === storedChamber)) {
      setActiveChamberId(storedChamber);
    } else if (chambers && chambers.length > 0) {
      setActiveChamberId(chambers[0].$id);
      localStorage.setItem('activeChamberId', chambers[0].$id);
    }
  }, [chambers]);

  const setChamber = (id) => {
    setActiveChamberId(id);
    localStorage.setItem('activeChamberId', id);
  };

  return { activeChamberId, setActiveChamberId: setChamber, chambers, chambersLoading };
}