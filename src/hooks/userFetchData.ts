import { useCallback, useEffect, useState } from 'react';
import { detailedStatsMockData } from '../constant/mock-data';
const mock ={
  "data": [
    {
      "title": "Sales Today",
      "icon": "receipt",
      "value": "13,456",
      "diff": 34,
      "period": "today"
    },
    {
      "title": "Visitors",
      "icon": "coin",
      "value": "4,145",
      "diff": -13,
      "period": "annual"
    },
    {
      "title": "Total Earnings",
      "icon": "discount",
      "value": "$ 74,5",
      "diff": 18,
      "period": "monthly"
    },
    {
      "title": "Pending Orders",
      "icon": "user",
      "value": "188",
      "diff": -30
    }
  ]
}

const useFetchData = () => {
  const [data, setData] = useState<any>([]);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);
console.log(data)
  const fetchData = useCallback(async () => {
    try {
      setData(detailedStatsMockData.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
   setTimeout(() => {
    fetchData();
   }, 3000);
  }, [detailedStatsMockData.data]);

  return { data, error, loading };
};

export default useFetchData;
