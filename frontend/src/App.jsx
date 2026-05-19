import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { useLocalStorage } from "./hooks/useLocalStorage";
import HomePage from "./pages/HomePage/HomePage";
import AddCoursePage from "./pages/AddCoursePage/AddCoursePage";
import CourseRecordsPage from "./pages/CourseRecordsPage/CourseRecordsPage";
import AddRecordPage from "./pages/AddRecordPage/AddRecordPage";
import WeeklyRecordPage from "./pages/WeeklyRecordPage/WeeklyRecordPage";
import styles from "./App.module.css";

export default function App() {
  const [courses, setCourses] = useLocalStorage("courses", []);
  const [records, setRecords] = useLocalStorage("records", []);

  return (
    <BrowserRouter>
      <div className={styles.app}>
        <nav className={styles.navbar}>
          <h1 className={styles.logo}>CourseApp</h1>
          <div className={styles.navLinks}>
            <NavLink to="/" end>
              课程列表
            </NavLink>
            <NavLink to="/weekly">本周记录</NavLink>
            <NavLink to="/add-course">添加课程</NavLink>
          </div>
        </nav>
        <main className={styles.mainContent}>
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  courses={courses}
                  records={records}
                  setCourses={setCourses}
                  setRecords={setRecords}
                />
              }
            />
            <Route
              path="/add-course"
              element={
                <AddCoursePage courses={courses} setCourses={setCourses} />
              }
            />
            <Route
              path="/weekly"
              element={<WeeklyRecordPage courses={courses} records={records} />}
            />
            <Route
              path="/edit-course/:id"
              element={
                <AddCoursePage courses={courses} setCourses={setCourses} />
              }
            />
            <Route
              path="/course/:id"
              element={
                <CourseRecordsPage
                  courses={courses}
                  records={records}
                  setRecords={setRecords}
                />
              }
            />
            <Route
              path="/course/:id/add-record"
              element={
                <AddRecordPage
                  courses={courses}
                  records={records}
                  setRecords={setRecords}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
