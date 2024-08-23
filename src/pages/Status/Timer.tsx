// import React, { useEffect, useState } from 'react';
// import styled from 'styled-components';

// // Styled-components for timer display
// const TimerContainer = styled.div`
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     padding: 5px 10px;
//     border-radius: 5px;
//     background: linear-gradient(145deg, #f8f9fa, #e2e6ea);
//     box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
//     font-family: 'Arial', sans-serif;
//     color: #333;
//     font-size: 16px;
//     font-weight: bold;
// `;

// const TimerIcon = styled.span`
//     margin-right: 8px;
//     font-size: 18px;
//     color: #e67e22;
// `;

// const TimerText = styled.span`
//     display: inline-block;
//     font-size: 16px;
//     color: #e67e22;
// `;

// interface TimerProps {
//     status: string;
//     onTimeUp: () => void;
// }

// const Timer: React.FC<TimerProps> = ({ status, onTimeUp }) => {
//     const [time, setTime] = useState(60); // Start with 60 seconds

//     useEffect(() => {
//         const timer = setInterval(() => {
//             setTime((prev) => {
//                 if (prev <= 1) {
//                     clearInterval(timer);
//                     onTimeUp();
//                     return 0;
//                 }
//                 return prev - 1;
//             });
//         }, 1000);

//         return () => clearInterval(timer);
//     }, [onTimeUp]);

//     return (
//         <TimerContainer>
//             <TimerIcon>🕒</TimerIcon>
//             <TimerText>{time}s</TimerText>
//         </TimerContainer>
//     );
// };

// export default Timer;
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// Styled-components for timer display
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
`;

const TimerIcon = styled.span`
    margin-right: 8px;
    font-size: 18px;
    color: #e67e22;
`;

const TimerText = styled.span`
    display: inline-block;
    font-size: 16px;
    color: #e67e22;
`;

interface TimerProps {
    status: string;
    onTimeUp: () => void;
}

const Timer: React.FC<TimerProps> = ({ status, onTimeUp }) => {
    const [time, setTime] = useState(7200); // Start with 2 hours (7200 seconds)

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
            <TimerText>
                {hours}h {minutes}m {seconds}s
            </TimerText>
        </TimerContainer>
    );
};

export default Timer;
