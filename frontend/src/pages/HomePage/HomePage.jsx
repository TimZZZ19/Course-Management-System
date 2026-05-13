import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

export default function HomePage({ courses, records, setCourses }) {
  const getRecordCount = (courseId) =>
    records.filter((r) => r.courseId === courseId).length;

  const getCompletedHours = (courseId) =>
    records.filter((r) => r.courseId === courseId).reduce((s, r) => s + Number(r.duration), 0);

  const deleteCourse = (id) => {
    if (window.confirm('确定要删除该课程吗？相关记录也将被删除。')) {
      setCourses((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <h2>课程列表</h2>
        <Link to="/add-course" className={`${styles.btn} ${styles.btnPrimary}`}>+ 添加课程</Link>
      </div>

      {courses.length === 0 ? (
        <div className={styles.emptyState}>
          <p>暂无课程，点击上方按钮添加</p>
        </div>
      ) : (
        courses.map((course) => {
          const done = getCompletedHours(course.id);
          const total = Number(course.totalHours);
          const progress = total > 0 ? Math.min((done / total) * 100, 100) : 0;

          return (
            <div className={styles.card} key={course.id}>
              <div className={styles.cardHeader}>
                <div>
                  <span className={`${styles.badge} ${course.type === 'oneOnOne' ? styles.badgeBlue : styles.badgeGreen}`}>
                    {course.type === 'oneOnOne' ? '一对一' : '班课'}
                  </span>
                  <span className={styles.cardTitle} style={{ marginLeft: 8 }}>
                    {course.type === 'oneOnOne' ? course.studentName : course.className}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Link to={`/edit-course/${course.id}`} className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}>编辑</Link>
                  <button onClick={() => deleteCourse(course.id)} className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}>删除</button>
                </div>
              </div>

              {course.type === 'group' && course.studentList && (
                <div className={styles.cardSubtitle}>学生: {course.studentList}</div>
              )}

              <div className={styles.progressWrap}>
                <div className={styles.progressTrack}>
                  <div className={styles.progressFill} style={{
                    width: `${progress}%`,
                    background: progress >= 100 ? '#22c55e' : '#4361ee',
                  }} />
                </div>
                <span className={styles.progressText}>{done}h / {total}h</span>
              </div>

              <div style={{ marginTop: 10, display: 'flex', gap: 20 }}>
                <Link to={`/course/${course.id}`} className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}>
                  查看记录 ({getRecordCount(course.id)})
                </Link>
                <Link to={`/course/${course.id}/add-record`} className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}>
                  + 添加记录
                </Link>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
