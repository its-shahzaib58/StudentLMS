import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import AuthContextProvider from './contexts/AuthContext';
import CourseContextProvider from 'contexts/CourseContext';
import StudentContextProvider from 'contexts/StudentContext';
import AttendanceContextProvider from 'contexts/AttendanceContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider>
    <AttendanceContextProvider>
      <StudentContextProvider>
        <CourseContextProvider>
          <BrowserRouter>
            <React.StrictMode>
              <App />
            </React.StrictMode>
          </BrowserRouter>
        </CourseContextProvider>
      </StudentContextProvider>
    </AttendanceContextProvider>
  </AuthContextProvider>
);

reportWebVitals();
