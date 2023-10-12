import { firestore } from 'config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react'

const AttendanceContext = createContext();



export default function AttendanceContextProvider({ children }) {

    const [dbAttendance, setDbAttendance] = useState([])
    const getCourse = async () => {
        const querySnapshot = await getDocs(collection(firestore, "attendance"));
        const arr = [];
        querySnapshot.forEach((doc) => {
            arr.push(doc.data())
           setDbAttendance(arr);
        });

    }
    useEffect(() => {
        getCourse()
    }, [])

    return (
        <AttendanceContext.Provider value={{dbAttendance, setDbAttendance }}>
            {children}
        </AttendanceContext.Provider>
    )
}

export const useAttendanceContext = () => useContext(AttendanceContext)
