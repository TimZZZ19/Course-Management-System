import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './AddRecordPage.module.css';

export default function AddRecordPage({ courses, records, setRecords }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = courses.find((c) => c.id === Number(id));

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    duration: '',
    content: '',
    homework: '',
  });

  if (!course) {
    return (
      <div className={styles.emptyState}>
        <p>课程不存在</p>
        <button onClick={() => navigate('/')} className={`${styles.btn} ${styles.btnPrimary}`} style={{ marginTop: 16 }}>返回首页</button>
      </div>
    );
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setRecords((prev) => [...prev, {
      id: Date.now(),
      courseId: Number(id),
      date: form.date,
      duration: Number(form.duration),
      content: form.content,
      homework: form.homework,
    }]);
    navigate(`/course/${id}`);
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <h2>添加课程记录</h2>
        <button onClick={() => navigate(-1)} className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}>返回</button>
      </div>

      <div className={styles.card} style={{ marginBottom: 20 }}>
        <span className={`${styles.badge} ${course.type === 'oneOnOne' ? styles.badgeBlue : styles.badgeGreen}`}>
          {course.type === 'oneOnOne' ? '一对一' : '班课'}
        </span>
        <span style={{ marginLeft: 8, fontWeight: 600 }}>
          {course.type === 'oneOnOne' ? course.studentName : course.className}
        </span>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>日期</label>
          <input name="date" type="date" value={form.date} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label>时长（小时）</label>
          <input name="duration" type="number" step="0.5" min="0.5" value={form.duration} onChange={handleChange} placeholder="例如: 2" required />
        </div>
        <div className={styles.formGroup}>
          <label>上课内容</label>
          <textarea name="content" value={form.content} onChange={handleChange} placeholder="记录本节课的教学内容" />
        </div>
        <div className={styles.formGroup}>
          <label>作业安排</label>
          <textarea name="homework" value={form.homework} onChange={handleChange} placeholder="记录课后作业" />
        </div>
        <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
          添加记录
        </button>
      </form>
    </div>
  );
}
