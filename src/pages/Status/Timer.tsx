import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

const blinkBackground = keyframes`
    0% { background-color: #f8f9fa; }
    25% { background-color: #e74c3c; } /* Bright red for danger */
    50% { background-color: #f8f9fa; }
    75% { background-color: #e74c3c; } /* Bright red for danger */
    100% { background-color: #f8f9fa; }
`;

const TimerContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px 10px;
    border-radius: 5px;
    background: linear-gradient(145deg, #f8f9fa, #e2e6ea);
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
    font-family: 'Arial', sans-serif;
    color: #333;
    font-size: 16px;
    font-weight: bold;
    width:200px
`;

const TimerIcon = styled.span`
    margin-right: 8px;
    font-size: 18px;
    color: #e67e22;
`;

const TimerText = styled.span<{ isBlinking: boolean }>`
    display: inline-block;
    font-size: 16px;
    color: ${({ isBlinking }) => (isBlinking ? '#fff' : '#e67e22')};
    background-color: ${({ isBlinking }) => (isBlinking ? '#e74c3c' : '#f8f9fa')};
    ${({ isBlinking }) =>
        isBlinking &&
        css`
            animation: ${blinkBackground} 1s infinite;
            padding: 2px 4px;
            border-radius: 3px;
            box-shadow: 0 0 10px rgba(255, 0, 0, 0.8); /* Red glow */
        `}
`;

interface TimerProps {
    pickedTime: Date;
    onTimeUp: () => void;
}

const Timer: React.FC<TimerProps> = ({ pickedTime, onTimeUp }) => {
    const [time, setTime] = useState(() => {
        const now = new Date();
        const endTime = new Date(pickedTime.getTime() + 120 * 60 * 1000); // pickedTime + 5 minutes
        const diff = endTime.getTime() - now.getTime();
        return Math.max(0, Math.floor(diff / 1000));
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTime((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [onTimeUp]);

    // Convert seconds to hours, minutes, and seconds
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return (
        <TimerContainer>
            <TimerIcon>🕒</TimerIcon>
            <TimerText isBlinking={time <= 0}>
                {hours}h {minutes}m {seconds}s
            </TimerText>
        </TimerContainer>
    );
};

export default Timer;
