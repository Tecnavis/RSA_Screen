import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { collection, getDocs, getFirestore, onSnapshot, doc, getDoc, query, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Index from '../Index';

const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;

const Container = styled.div`
    position: relative;
    padding: 20px;
    background-color: #f0f4f7;
    min-height: 100vh;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    animation: ${fadeIn} 0.5s ease-in-out;
`;

const TableHeader = styled.th`
    background-color: #f39c12;
    color: white;
    padding: 15px;
    font-size: 1.2rem;
    text-align: left;
`;

const TableRow = styled.tr`
    background-color: ${(props) => (props.highlight ? 'lightblue' : 'white')};
    &:nth-child(even) {
        background-color: #f2f2f2;
    }
`;

const TableData = styled.td`
    padding: 15px;
    font-size: 1rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
`;

const Title = styled.h1`
    font-size: 2.5rem;
    font-weight: 700;
    color: #333;
    text-align: center;
    margin-bottom: 20px;
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

const blink = keyframes`
    0% { background-color: #f8f9fa; }
    50% { background-color: #e2e6ea; }
    100% { background-color: #f8f9fa; }
`;

const BlinkingRow = styled.tr`
    animation: ${blink} 1s linear infinite;
`;
const StatusBadge = styled.span`
    padding: 4px 15px;
    border-radius: 25px;
    font-weight: bold;
    text-align: center;
    color: white;
    background-color: ${(props) => {
        switch (props.status) {
            case 'Booking added':
                return '#3498db';
            case 'called to customer':
                return '#2980b9';
            case 'Order Received':
                return '#27ae60';
            case 'On the way to pickup location':
                return '#16a085';
            case 'Vehicle Confirmed':
                return '#8e44ad';
            case 'Vehicle Picked':
                return '#e67e22';
            case 'To DropOff Location':
                return '#d35400';
            case 'On the way to dropoff location':
                return '#c0392b';
            case 'Vehicle Dropped':
                return '#f1c40f';
            case 'Order Completed':
                return '#2ecc71';
            case 'Rejected':
                return '#e74c3c';
            default:
                return '#f39c12';
        }
    }};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease, transform 0.3s ease;
    &:hover {
        transform: scale(1.05);
        background-color: ${(props) => {
            switch (props.status) {
                case 'Rejected':
                    return '#c0392b';
                case 'Order Completed':
                    return '#2ecc71';
                case 'pending':
                    return '#e67e22';
                default:
                    return '#e67e22';
            }
        }};
    }
    animation: fadeIn 1.5s ease-in-out;
    letter-spacing: 1px;
`;

const StatusTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [recordsData, setRecordsData] = useState([]);
    const [drivers, setDrivers] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const db = getFirestore();

    useEffect(() => {
        dispatch(setPageTitle('Status'));

        const fetchBookings = async () => {
            const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const updatedBookingsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setRecordsData(updatedBookingsData);

            const driverData = {};
            for (const record of updatedBookingsData) {
                const driverId = record.selectedDriver;

                if (driverId && !driverData[driverId]) {
                    const driverDoc = await getDoc(doc(db, 'driver', driverId));
                    if (driverDoc.exists()) {
                        driverData[driverId] = driverDoc.data();
                    }
                }
            }
            setDrivers(driverData);
        };

        const unsubscribe = onSnapshot(collection(db, 'bookings'), () => {
            fetchBookings();
        });

        return () => unsubscribe();
    }, [db, dispatch]);

    const filteredRecordsData = recordsData.filter((record) => Object.values(record).some((value) => value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())));

    const sortedRecordsData = filteredRecordsData.slice().sort((a, b) => {
        const dateA = new Date(a.dateTime);
        const dateB = new Date(b.dateTime);
        return dateB - dateA;
    });

    const completedBookings = sortedRecordsData.filter((record) => record.status === 'Order Completed');
    const ongoingBookings = sortedRecordsData.filter((record) => record.status !== 'Order Completed');

    return (
        <Container>
            <Title>Driver Status</Title>
            <Index />
            <Table>
                <thead>
                    <tr>
                        <TableHeader>Date & Time</TableHeader>
                        <TableHeader>BookingID</TableHeader>
                        <TableHeader>Driver Name</TableHeader>
                        <TableHeader>Vehicle Number</TableHeader>
                        <TableHeader>Status</TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {ongoingBookings.map((record) => (
                        <TableRow key={record.id} highlight={record.bookingStatus === 'ShowRoom Booking'}>
                            <TableData>{record.dateTime}</TableData>
                            <TableData>{record.bookingId}</TableData>
                            <TableData>{record.driver}</TableData>
                            <TableData>{record.vehicleNumber}</TableData>
                            <TableData>
                                <StatusBadge  className='flex' status={record.status}>{record.status}</StatusBadge>
                                {record.status === 'Vehicle Picked' && <Timer status={record.status} />}
                            </TableData>
                        </TableRow>
                    ))}
                </tbody>
            </Table>
            <Title>Order Completed</Title>
            <Table>
                <thead>
                    <tr>
                        <TableHeader>Date & Time</TableHeader>
                        <TableHeader>BookingID</TableHeader>
                        <TableHeader>Driver Name</TableHeader>
                        <TableHeader>Vehicle Number</TableHeader>
                        <TableHeader>Status</TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {completedBookings.map((record) => (
                        <TableRow key={record.id}>
                            <TableData>{record.dateTime}</TableData>
                            <TableData>{record.bookingId}</TableData>
                            <TableData>{record.driver}</TableData>
                            <TableData>{record.vehicleNumber}</TableData>
                            <TableData>
                                <StatusBadge className='flex' status="Order Completed">{record.status}</StatusBadge>
                            </TableData>
                        </TableRow>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

const Timer = ({ status, onTimeUp }) => {
    const [time, setTime] = useState(0);

    useEffect(() => {
        if (status === 'Vehicle Picked') {
            const startTime = Date.now();
            const interval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                setTime(elapsed);

                if (elapsed >= 7200) { // 2 hours in seconds
                    clearInterval(interval);
                    onTimeUp(); // Notify the parent component
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [status, onTimeUp]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}m ${secs}s`;
    };

    return (
        <TimerContainer>
            <TimerIcon>⏱️</TimerIcon>
            <TimerText>{formatTime(time)}</TimerText>
        </TimerContainer>
    );
};


export default StatusTable;
