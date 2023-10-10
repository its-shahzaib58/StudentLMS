import { firestore } from 'config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react'

const StudentContext = createContext();



export default function StudentContextProvider({ children }) {

    const [dbStudents , setDbStudents] = useState([])
    const getStudent = async () => {
        const querySnapshot = await getDocs(collection(firestore, "students"));
        const arr = [];
        querySnapshot.forEach((doc) => {
            arr.push(doc.data())
           setDbStudents(arr)
        });

    }
    useEffect(() => {
        getStudent()
        console.log(dbStudents)
    }, [])

    return (
        <StudentContext.Provider value={{dbStudents, setDbStudents }}>
            {children}
        </StudentContext.Provider>
    )
}

export const useStudentContext = () => useContext(StudentContext)
