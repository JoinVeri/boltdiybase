import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface BusinessCountProps {
  cityId: string;
}

const BusinessCount = ({ cityId }: BusinessCountProps) => {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      const { data, error } = await supabase
        .rpc('get_city_business_count', { city_id: cityId });

      if (!error && data !== null) {
        setCount(data);
      }
      setLoading(false);
    };

    fetchCount();
  }, [cityId]);

  if (loading) {
    return <span className="animate-pulse">...</span>;
  }

  return <span>{count}</span>;
};

export default BusinessCount;