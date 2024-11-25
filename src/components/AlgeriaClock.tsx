import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

function AlgeriaClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatter = new Intl.DateTimeFormat('ar-DZ', {
    timeZone: 'Africa/Algiers',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  return (
    <div className="flex items-center gap-2 text-lg">
      <Clock size={20} />
      <span className="font-mono">{formatter.format(time)}</span>
    </div>
  );
}

export default AlgeriaClock;