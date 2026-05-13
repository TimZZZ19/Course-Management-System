import { Link, useParams, useNavigate } from 'react-router-dom';
import styles from './CourseRecordsPage.module.css';

export default function CourseRecordsPage({ courses, records, setRecords }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = courses.find((c) => c.id === Number(id));

  if (!course) {
    return (
      <div className={styles.emptyState}>
        <p>课程不存在</p>
        <Link to="/" className={`${styles.btn} ${styles.btnPrimary}`} style={{ marginTop: 16 }}>返回首页</Link>
      </div>
    );
  }

  const courseRecords = records
    .filter((r) => r.courseId === Number(id))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalHours = courseRecords.reduce((s, r) => s + Number(r.duration), 0);

  const deleteRecord = (recordId) => {
    if (window.confirm('确定要删除该记录吗？')) {
      setRecords((prev) => prev.filter((r) => r.id !== recordId));
    }
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h2>{course.type === 'oneOnOne' ? course.studentName : course.className}</h2>
          <span className={`${styles.badge} ${course.type === 'oneOnOne' ? styles.badgeBlue : styles.badgeGreen}`} style={{ marginTop: 4 }}>
            {course.type === 'oneOnOne' ? '一对一' : '班课'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => navigate(-1)} className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}>返回</button>
          <Link to={`/course/${id}/add-record`} className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}>+ 添加记录</Link>
        </div>
      </div>

      <div className={styles.summaryBar}>
        <div className={styles.summaryItem}>
          <div className={styles.summaryLabel}>已完成课时</div>
          <div className={styles.summaryValue}>{totalHours.toFixed(1)}h</div>
        </div>
        <div className={styles.summaryItem}>
          <div className={styles.summaryLabel}>总课时</div>
          <div className={styles.summaryValue}>{Number(course.totalHours).toFixed(1)}h</div>
        </div>
        <div className={styles.summaryItem}>
          <div className={styles.summaryLabel}>进度</div>
          <div className={styles.summaryValue}>
            {Number(course.totalHours) > 0 ? Math.min((totalHours / Number(course.totalHours)) * 100, 100).toFixed(0) : 0}%
          </div>
        </div>
      </div>

      {courseRecords.length === 0 ? (
        <div className={styles.emptyState}><p>暂无课程记录</p></div>
      ) : (
        courseRecords.map((r) => (
          <div className={styles.recordItem} key={r.id}>
            <div className={styles.dateDuration}>
              <strong>{r.date}</strong>
              <span style={{ color: '#4361ee', fontWeight: 600 }}>{Number(r.duration).toFixed(1)}h</span>
            </div>
            {r.content && <><div className={styles.contentLabel}>上课内容</div><div style={{ fontSize: '0.9rem' }}>{r.content}</div></>}
            {r.homework && <><div className={styles.contentLabel}>作业安排</div><div style={{ fontSize: '0.9rem' }}>{r.homework}</div></>}
            <div style={{ marginTop: 8, textAlign: 'right' }}>
              <button onClick={() => deleteRecord(r.id)} className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}>删除</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
