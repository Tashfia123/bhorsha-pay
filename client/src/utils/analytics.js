/**
 * Utility functions for analytics in the application
 */

/**
 * Calculates the success rate of a campaign based on target and collected amount
 * @param {number} target - Target amount
 * @param {number} collected - Collected amount
 * @returns {number} - Success rate as percentage (0-100)
 */
export const calculateSuccessRate = (target, collected) => {
  if (!target || target <= 0) return 0;
  
  const rate = (collected / target) * 100;
  return Math.min(100, Math.max(0, rate));
};

/**
 * Calculates time-based metrics for a campaign
 * @param {Date|number} startDate - Campaign start date
 * @param {Date|number} endDate - Campaign end date
 * @param {number} collected - Collected amount
 * @returns {Object} - Time-based metrics
 */
export const calculateTimeMetrics = (startDate, endDate, collected) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      duration: 0,
      elapsed: 0,
      remaining: 0,
      completionPercentage: 0,
      averagePerDay: 0,
      projectedTotal: 0
    };
  }
  
  // Total duration in days
  const duration = Math.max(0, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  
  // Time elapsed in days (capped at duration)
  const elapsed = Math.min(duration, Math.max(0, Math.ceil((now - start) / (1000 * 60 * 60 * 24))));
  
  // Remaining time in days
  const remaining = Math.max(0, duration - elapsed);
  
  // Percentage of time completed
  const completionPercentage = duration > 0 ? (elapsed / duration) * 100 : 0;
  
  // Average amount collected per day
  const averagePerDay = elapsed > 0 ? collected / elapsed : 0;
  
  // Projected total at current rate
  const projectedTotal = averagePerDay * duration;
  
  return {
    duration,
    elapsed,
    remaining,
    completionPercentage,
    averagePerDay,
    projectedTotal
  };
};

/**
 * Calculates the funding velocity (rate of funding over time)
 * @param {number} collected - Amount collected
 * @param {number} elapsed - Time elapsed in days
 * @returns {number} - Funding velocity (amount per day)
 */
export const calculateFundingVelocity = (collected, elapsed) => {
  if (!collected || collected <= 0 || !elapsed || elapsed <= 0) return 0;
  
  return collected / elapsed;
};

/**
 * Analyzes donor behavior
 * @param {Array} donations - Array of donation objects
 * @returns {Object} - Donor behavior analysis
 */
export const analyzeDonorBehavior = (donations) => {
  if (!donations || !donations.length) {
    return {
      totalDonors: 0,
      newDonors: 0,
      repeatDonors: 0,
      repeatDonationRate: 0,
      averageDonation: 0,
      medianDonation: 0,
      largestDonation: 0,
      smallestDonation: 0
    };
  }
  
  // Count unique donors
  const uniqueDonors = new Set(donations.map(d => d.donor)).size;
  
  // Count donations by donor
  const donationsByDonor = donations.reduce((acc, donation) => {
    if (!acc[donation.donor]) {
      acc[donation.donor] = [];
    }
    acc[donation.donor].push(donation);
    return acc;
  }, {});
  
  // Count repeat donors
  const repeatDonors = Object.values(donationsByDonor).filter(d => d.length > 1).length;
  
  // Calculate repeat donation rate
  const repeatDonationRate = uniqueDonors > 0 ? (repeatDonors / uniqueDonors) * 100 : 0;
  
  // Calculate average donation
  const donationAmounts = donations.map(d => parseFloat(d.amount));
  const totalDonated = donationAmounts.reduce((sum, amount) => sum + amount, 0);
  const averageDonation = donations.length > 0 ? totalDonated / donations.length : 0;
  
  // Calculate median donation
  const sortedAmounts = [...donationAmounts].sort((a, b) => a - b);
  const midIndex = Math.floor(sortedAmounts.length / 2);
  const medianDonation = sortedAmounts.length > 0 
    ? sortedAmounts.length % 2 === 0
      ? (sortedAmounts[midIndex - 1] + sortedAmounts[midIndex]) / 2
      : sortedAmounts[midIndex]
    : 0;
  
  // Find largest and smallest donations
  const largestDonation = sortedAmounts.length > 0 ? sortedAmounts[sortedAmounts.length - 1] : 0;
  const smallestDonation = sortedAmounts.length > 0 ? sortedAmounts[0] : 0;
  
  return {
    totalDonors: uniqueDonors,
    newDonors: uniqueDonors - repeatDonors,
    repeatDonors,
    repeatDonationRate,
    averageDonation,
    medianDonation,
    largestDonation,
    smallestDonation
  };
};

/**
 * Analyzes campaign growth over time
 * @param {Array} donations - Array of donation objects with timestamps
 * @param {number} interval - Interval in days for grouping
 * @returns {Array} - Time series data of donations
 */
export const analyzeCampaignGrowth = (donations, interval = 1) => {
  if (!donations || !donations.length) return [];
  
  // Sort donations by timestamp
  const sortedDonations = [...donations].sort((a, b) => a.timestamp - b.timestamp);
  
  // Get start and end dates
  const startDate = new Date(sortedDonations[0].timestamp);
  const endDate = new Date(sortedDonations[sortedDonations.length - 1].timestamp);
  
  // Create time intervals
  const timeIntervals = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    timeIntervals.push({
      start: new Date(currentDate),
      end: new Date(currentDate.setDate(currentDate.getDate() + interval)),
      amount: 0,
      count: 0
    });
    
    // Avoid infinite loops if the date arithmetic somehow fails
    if (timeIntervals.length > 1000) break;
  }
  
  // Group donations by interval
  sortedDonations.forEach(donation => {
    const donationDate = new Date(donation.timestamp);
    
    for (const interval of timeIntervals) {
      if (donationDate >= interval.start && donationDate < interval.end) {
        interval.amount += parseFloat(donation.amount);
        interval.count += 1;
        break;
      }
    }
  });
  
  // Calculate cumulative amounts
  let cumulativeAmount = 0;
  let cumulativeCount = 0;
  
  return timeIntervals.map(interval => {
    cumulativeAmount += interval.amount;
    cumulativeCount += interval.count;
    
    return {
      startDate: interval.start,
      endDate: interval.end,
      dailyAmount: interval.amount,
      dailyCount: interval.count,
      cumulativeAmount,
      cumulativeCount
    };
  });
};

/**
 * Forecasts future campaign performance based on historical data
 * @param {Array} timeSeriesData - Time series data from analyzeCampaignGrowth
 * @param {number} forecastDays - Number of days to forecast
 * @returns {Array} - Forecast data
 */
export const forecastCampaignPerformance = (timeSeriesData, forecastDays = 7) => {
  if (!timeSeriesData || !timeSeriesData.length) return [];
  
  // Calculate average daily amount and count
  const totalDays = timeSeriesData.length;
  const totalAmount = timeSeriesData.reduce((sum, data) => sum + data.dailyAmount, 0);
  const totalCount = timeSeriesData.reduce((sum, data) => sum + data.dailyCount, 0);
  
  const averageDailyAmount = totalDays > 0 ? totalAmount / totalDays : 0;
  const averageDailyCount = totalDays > 0 ? totalCount / totalDays : 0;
  
  // Calculate trend (simple linear regression)
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  
  timeSeriesData.forEach((data, i) => {
    sumX += i;
    sumY += data.dailyAmount;
    sumXY += i * data.dailyAmount;
    sumXX += i * i;
  });
  
  const n = timeSeriesData.length;
  const slope = n > 0 ? (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX) : 0;
  const intercept = n > 0 ? (sumY - slope * sumX) / n : 0;
  
  // Generate forecast
  const lastDate = timeSeriesData[timeSeriesData.length - 1].endDate;
  let cumulativeAmount = timeSeriesData[timeSeriesData.length - 1].cumulativeAmount;
  let cumulativeCount = timeSeriesData[timeSeriesData.length - 1].cumulativeCount;
  
  const forecast = [];
  
  for (let i = 1; i <= forecastDays; i++) {
    const forecastDate = new Date(lastDate);
    forecastDate.setDate(forecastDate.getDate() + i);
    
    const trendBasedAmount = intercept + slope * (n + i - 1);
    const forecastedAmount = trendBasedAmount > 0 ? trendBasedAmount : averageDailyAmount;
    
    cumulativeAmount += forecastedAmount;
    cumulativeCount += averageDailyCount;
    
    forecast.push({
      forecastDate,
      dailyAmount: forecastedAmount,
      dailyCount: averageDailyCount,
      cumulativeAmount,
      cumulativeCount
    });
  }
  
  return forecast;
};

/**
 * Segments donors based on donation amount
 * @param {Array} donations - Array of donation objects
 * @returns {Object} - Donor segments
 */
export const segmentDonors = (donations) => {
  if (!donations || !donations.length) {
    return {
      small: { count: 0, amount: 0, percentage: 0 },
      medium: { count: 0, amount: 0, percentage: 0 },
      large: { count: 0, amount: 0, percentage: 0 }
    };
  }
  
  // Group donations by donor and sum amounts
  const donorTotals = {};
  
  donations.forEach(donation => {
    if (!donorTotals[donation.donor]) {
      donorTotals[donation.donor] = 0;
    }
    donorTotals[donation.donor] += parseFloat(donation.amount);
  });
  
  // Determine segment thresholds (using quartiles)
  const amounts = Object.values(donorTotals);
  const sortedAmounts = [...amounts].sort((a, b) => a - b);
  
  const q1Index = Math.floor(sortedAmounts.length * 0.25);
  const q3Index = Math.floor(sortedAmounts.length * 0.75);
  
  const smallThreshold = sortedAmounts[q1Index] || 0;
  const largeThreshold = sortedAmounts[q3Index] || 0;
  
  // Segment donors
  const segments = {
    small: { count: 0, amount: 0 },
    medium: { count: 0, amount: 0 },
    large: { count: 0, amount: 0 }
  };
  
  Object.entries(donorTotals).forEach(([donor, amount]) => {
    if (amount <= smallThreshold) {
      segments.small.count += 1;
      segments.small.amount += amount;
    } else if (amount >= largeThreshold) {
      segments.large.count += 1;
      segments.large.amount += amount;
    } else {
      segments.medium.count += 1;
      segments.medium.amount += amount;
    }
  });
  
  // Calculate percentages
  const totalDonors = Object.keys(donorTotals).length;
  
  segments.small.percentage = totalDonors > 0 ? (segments.small.count / totalDonors) * 100 : 0;
  segments.medium.percentage = totalDonors > 0 ? (segments.medium.count / totalDonors) * 100 : 0;
  segments.large.percentage = totalDonors > 0 ? (segments.large.count / totalDonors) * 100 : 0;
  
  return segments;
};

/**
 * Calculates campaign efficiency metrics
 * @param {number} raised - Amount raised
 * @param {number} target - Target amount
 * @param {number} costs - Campaign costs
 * @returns {Object} - Efficiency metrics
 */
export const calculateEfficiencyMetrics = (raised, target, costs = 0) => {
  if (!raised || raised <= 0) {
    return {
      costToRaiseRatio: 0,
      returnOnInvestment: 0,
      targetEfficiency: 0,
      netProceeds: 0
    };
  }
  
  // Calculate cost-to-raise ratio (cost per dollar raised)
  const costToRaiseRatio = costs > 0 ? costs / raised : 0;
  
  // Calculate return on investment (ROI)
  const returnOnInvestment = costs > 0 ? ((raised - costs) / costs) * 100 : 0;
  
  // Calculate target efficiency (percentage of target reached)
  const targetEfficiency = target > 0 ? (raised / target) * 100 : 0;
  
  // Calculate net proceeds
  const netProceeds = raised - costs;
  
  return {
    costToRaiseRatio,
    returnOnInvestment,
    targetEfficiency,
    netProceeds
  };
};

/**
 * Calculate campaign engagement metrics
 * @param {number} views - Number of campaign views
 * @param {number} donors - Number of donors
 * @param {number} shares - Number of social shares
 * @returns {Object} - Engagement metrics
 */
export const calculateEngagementMetrics = (views, donors, shares = 0) => {
  if (!views || views <= 0) {
    return {
      conversionRate: 0,
      shareRate: 0,
      shareToConversionRate: 0
    };
  }
  
  // Calculate conversion rate (percentage of viewers who donated)
  const conversionRate = views > 0 ? (donors / views) * 100 : 0;
  
  // Calculate share rate (percentage of viewers who shared)
  const shareRate = views > 0 ? (shares / views) * 100 : 0;
  
  // Calculate share-to-conversion rate (percentage of shares that resulted in donations)
  const shareToConversionRate = shares > 0 ? (donors / shares) * 100 : 0;
  
  return {
    conversionRate,
    shareRate,
    shareToConversionRate
  };
}; 