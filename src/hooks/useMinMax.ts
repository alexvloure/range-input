import { useEffect, useState } from 'react';

export const useMinMax = () => {
  const [data, setData] = useState<{ min: number; max: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/mockableMinMax`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setIsLoading(false);
      });
  }, []);

  return { data, isLoading };
};
