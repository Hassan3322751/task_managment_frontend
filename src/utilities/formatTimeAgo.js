export const formatTimeAgo = (dateString) => {
  if (!dateString) return '';

  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now - past) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const counter = Math.floor(diffInSeconds / seconds);
    if (counter > 0) {
      if (counter === 1) {
        return `1 ${unit} ago`; 
      } else {
        return `${counter} ${unit}s ago`;
      }
    }
  }

  return 'Just now';
};