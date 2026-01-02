import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useInterval } from './useInterval';

interface UseTimerProps {
    initialTime: number; // in seconds
    isRunning: boolean;
    onFinish?: () => void;
    onTick?: (timeLeft: number) => void;
    key?: string; // localStorage key
}

export function useTimer({ initialTime, isRunning, onFinish, onTick, key = 'focus_timer_left' }: UseTimerProps) {
    const [timeLeft, setTimeLeft] = useLocalStorage<number>(key, initialTime, 1);

    useInterval(() => {
        if (timeLeft > 0) {
            setTimeLeft(t => t - 1);
            if (onTick) onTick(timeLeft - 1);
        } else {
            if (onFinish) onFinish();
        }
    }, isRunning ? 1000 : null);

    const reset = useCallback(() => {
        setTimeLeft(initialTime);
    }, [initialTime, setTimeLeft]);

    const addTime = useCallback((seconds: number) => {
        setTimeLeft(t => t + seconds);
    }, [setTimeLeft]);

    return { timeLeft, reset, addTime };
}
