import { useState, useEffect } from "react";
import { X } from "lucide-react";

export const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const initTimer = () => {
      const TIMER_DURATION = 48 * 60 * 60 * 1000; // 48 hours in milliseconds
      const COOKIE_NAME = 'countdown_start_time';

      console.log('CountdownTimer: Initializing timer');
      let startTime = getCookie(COOKIE_NAME);
      console.log('CountdownTimer: startTime from cookie:', startTime);
      
      if (!startTime) {
        // First visit - set start time
        startTime = Date.now().toString();
        setCookie(COOKIE_NAME, startTime, 7); // Cookie expires in 7 days
        console.log('CountdownTimer: Set new startTime:', startTime);
      }
      
      const start = parseInt(startTime);
      const endTime = start + TIMER_DURATION;
      const now = Date.now();
      
      console.log('CountdownTimer: start:', start, 'endTime:', endTime, 'now:', now);
      console.log('CountdownTimer: Time remaining (ms):', endTime - now);
      
      if (now >= endTime) {
        console.log('CountdownTimer: Timer expired');
        setIsExpired(true);
        return;
      }
      
      console.log('CountdownTimer: Setting visible to true');
      setIsVisible(true);
      
      const updateTimer = () => {
        const remaining = endTime - Date.now();
        
        if (remaining <= 0) {
          setIsExpired(true);
          setIsVisible(false);
          return;
        }
        
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        
        setTimeLeft({ hours, minutes, seconds });
      };
      
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      
      return () => clearInterval(interval);
    };

    const cleanup = initTimer();
    return cleanup;
  }, []);

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  };

  const setCookie = (name: string, value: string, days: number) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setCookie('countdown_dismissed', 'true', 7);
  };

  console.log('CountdownTimer render: isVisible:', isVisible, 'isExpired:', isExpired, 'timeLeft:', timeLeft);
  
  if (!isVisible || isExpired) {
    console.log('CountdownTimer: Not rendering - isVisible:', isVisible, 'isExpired:', isExpired);
    return null;
  }

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-[9999] bg-gradient-to-r from-red-600 to-red-700 text-white py-3 sm:py-4 px-2 sm:px-4 shadow-lg"
      style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999, backgroundColor: '#dc2626' }}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
        <div className="flex items-center space-x-1 sm:space-x-2 text-center sm:text-left">
          <span className="text-xs sm:text-sm font-medium">🔥 Limited Time:</span>
          <span className="text-base sm:text-lg font-bold">
            {String(timeLeft.hours).padStart(2, '0')}:
            {String(timeLeft.minutes).padStart(2, '0')}:
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
          <span className="text-xs sm:text-sm">left to claim $97 instead of $497!</span>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => window.location.href = '/starter-selection'}
            className="bg-white text-red-600 px-3 sm:px-6 py-1 sm:py-2 rounded-full text-xs sm:text-base font-bold hover:bg-gray-100 transition-colors"
          >
            Get Featured ✨
          </button>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-red-800 rounded"
            aria-label="Dismiss countdown"
          >
            <X size={14} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};