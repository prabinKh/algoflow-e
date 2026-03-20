import { useState, useEffect } from "react";

export const DealCountdown = () => {
  const [time, setTime] = useState({ days: 8, hours: 23, minutes: 29, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        if (days < 0) return prev;
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const blocks = [
    { label: "Days", value: time.days },
    { label: "Hrs", value: time.hours },
    { label: "Min", value: time.minutes },
    { label: "Sec", value: time.seconds },
  ];

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {blocks.map((b, i) => (
        <div key={b.label} className="flex items-center gap-2 sm:gap-4">
          <div className="flex flex-col items-center bg-primary rounded-2xl sm:rounded-3xl px-4 sm:px-6 py-3 sm:py-4 min-w-[50px] sm:min-w-[70px] shadow-xl shadow-primary/20 border border-white/10 ring-1 ring-white/20">
            <span className="font-mono tabular-nums text-xl sm:text-3xl font-black text-primary-foreground leading-none tracking-tighter">
              {String(b.value).padStart(2, "0")}
            </span>
            <p className="text-[8px] sm:text-[10px] uppercase font-black text-primary-foreground/60 mt-2 tracking-[0.2em]">{b.label}</p>
          </div>
          {i < blocks.length - 1 && (
            <div className="flex flex-col gap-1.5 animate-pulse">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
