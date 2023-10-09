import { firestore } from 'config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react'

const CourseContext = createContext();



export default function CourseContextProvider({ children }) {

    const [dbCourses, setDbCourses] = useState([])
    const getCourse = async () => {
        const querySnapshot = await getDocs(collection(firestore, "courses"));
        const arr = [];
        querySnapshot.forEach((doc) => {
            arr.push(doc.data())
           setDbCourses(arr);
        });

    }
    useEffect(() => {
        getCourse()
    }, [])

    return (
        <CourseContext.Provider value={{dbCourses, setDbCourses }}>
            {children}
        </CourseContext.Provider>
    )
}

export const useCourseContext = () => useContext(CourseContext)
