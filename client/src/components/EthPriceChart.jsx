import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTheme } from '../context/ThemeContext';
import { FaChartLine } from 'react-icons/fa';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const EthPriceChart = () => {
  const [priceData, setPriceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchEthPriceHistory = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get the current date
        const endDate = new Date();
        // Get the date 24 months ago
        const startDate = new Date(endDate);
        startDate.setMonth(startDate.getMonth() - 24);
        
        // Format dates for API
        const startTimestamp = Math.floor(startDate.getTime() / 1000);
        const endTimestamp = Math.floor(endDate.getTime() / 1000);
        
        // CoinGecko API for historical Ethereum price data
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/ethereum/market_chart/range?vs_currency=usd&from=${startTimestamp}&to=${endTimestamp}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch ETH price data');
        }
        
        const data = await response.json();
        
        // Process the data to get monthly averages
        const processedData = processMonthlyData(data.prices);
        setPriceData(processedData);
      } catch (err) {
        console.error('Error fetching ETH price data:', err);
        setError(err.message);
        
        // Fallback to mock data if API fails
        setPriceData(getMockEthData());
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEthPriceHistory();
  }, []);
  
  // Process data to get monthly averages
  const processMonthlyData = (pricePoints) => {
    const monthlyData = {};
    
    pricePoints.forEach(point => {
      const date = new Date(point[0]);
      const price = point[1];
      
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          sum: 0,
          count: 0
        };
      }
      
      monthlyData[monthYear].sum += price;
      monthlyData[monthYear].count += 1;
    });
    
    // Calculate averages and format for chart
    const labels = [];
    const prices = [];
    
    Object.keys(monthlyData).forEach(monthYear => {
      labels.push(monthYear);
      prices.push(monthlyData[monthYear].sum / monthlyData[monthYear].count);
    });
    
    return {
      labels,
      prices
    };
  };
  
  // Fallback mock data if API fails
  const getMockEthData = () => {
    const labels = [];
    const prices = [
      1192, 1368, 1655, 1912, 2732, 2530, 2985, 3433, 3715, 4080, 4586, 4200,
      3100, 2758, 2890, 3240, 3102, 1650, 1050, 1280, 1780, 1950, 2050, 2250
    ];
    
    // Generate labels for the past 24 months
    const today = new Date();
    for (let i = 23; i >= 0; i--) {
      const date = new Date(today);
      date.setMonth(today.getMonth() - i);
      labels.push(`${date.getMonth() + 1}/${date.getFullYear()}`);
    }
    
    return {
      labels,
      prices
    };
  };

  // Chart configuration
  const getChartData = () => {
    if (!priceData) return null;
    
    return {
      labels: priceData.labels,
      datasets: [
        {
          label: 'ETH Price (USD)',
          data: priceData.prices,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#fff',
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.4,
        }
      ]
    };
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDarkMode ? '#f3f4f6' : '#374151',
          font: {
            family: "'Inter', sans-serif",
            size: 12,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        titleColor: isDarkMode ? '#f3f4f6' : '#111827',
        bodyColor: isDarkMode ? '#d1d5db' : '#4b5563',
        borderColor: isDarkMode ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          family: "'Inter', sans-serif",
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 13
        },
        callbacks: {
          label: function(context) {
            return `ETH Price: $${context.raw.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: isDarkMode ? '#9ca3af' : '#6b7280',
          font: {
            family: "'Inter', sans-serif",
            size: 10
          },
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        grid: {
          color: isDarkMode ? 'rgba(156, 163, 175, 0.1)' : 'rgba(209, 213, 219, 0.5)',
          drawBorder: false,
        },
        ticks: {
          color: isDarkMode ? '#9ca3af' : '#6b7280',
          font: {
            family: "'Inter', sans-serif",
            size: 11
          },
          callback: function(value) {
            return '$' + value.toLocaleString('en-US');
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      intersect: false,
    },
    animation: {
      duration: 1000,
    },
    elements: {
      line: {
        borderJoinStyle: 'round'
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Card sx={{ 
        backgroundColor: "#1a1e2e", 
        color: "white", 
        borderRadius: 2, 
        p: 2, 
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
          <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading ETH price data...</p>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error && !priceData) {
    return (
      <Card sx={{ 
        backgroundColor: "#1a1e2e", 
        color: "white", 
        borderRadius: 2, 
        p: 2, 
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold mb-2">Data Error</h3>
          <p className="text-gray-400 text-center">
            {error}. Showing fallback data for demonstration.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ 
      backgroundColor: "#1a1e2e", 
      color: "white", 
      borderRadius: 2, 
      p: 2, 
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
      },
    }}>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-500 to-blue-300 p-2 rounded-lg mr-3">
              <FaChartLine className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Ethereum Price History
            </h2>
          </div>
          <div className="text-blue-500 font-medium text-sm">
            Last 24 Months
          </div>
        </div>

        <div className="h-[350px] w-full">
          {priceData && getChartData() && (
            <Line data={getChartData()} options={chartOptions} />
          )}
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            {error ? 'Using fallback data for demonstration purposes' : 'Data sourced from CoinGecko API'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EthPriceChart; 