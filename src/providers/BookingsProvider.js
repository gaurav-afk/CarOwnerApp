import { useState, createContext } from 'react';

export const BookingsContext = createContext()

export const BookingsProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [bookings, setBookings] = useState([])

    return (
    <BookingsContext.Provider value={{ isLoading, setIsLoading, bookings, setBookings }}>
        {children}
    </BookingsContext.Provider>
    );
};