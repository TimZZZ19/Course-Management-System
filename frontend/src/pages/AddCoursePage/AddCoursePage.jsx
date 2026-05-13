import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './AddCoursePage.module.css';

const emptyForm = { totalHours: '', type: 'oneOnOne', studentName: '', className: '', studentList: '' };

export default function AddCoursePage({ courses, setCourses }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const existing = isEdit ? courses.find((c) => c.id === Number(id)) : null;

  const [form, setForm] = useState(
    existing ? {
      totalHours: existing.totalHours,
      type: existing.type,
      studentName: existing.studentName,
      className: existing.className,
      studentList: existing.studentList,
    } : { ...emptyForm }
  );

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const courseData = {
      totalHours: Number(form.totalHours),
      type: form.type,
      studentName: form.type === 'oneOnOne' ? form.studentName : '',
      className: form.type === 'group' ? form.className : '',
      studentList: form.type === 'group' ? form.studentList : '',
    };

    if (isEdit) {
      setCourses((prev) => prev.map((c) => (c.id === Number(id) ? { ...c, ...courseData } : c)));
    } else {
      setCourses((prev) => [...prev, { ...courseData, id: Date.now() }]);
    }
    navigate('/');
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <h2>{isEdit ? '编辑课程' : '添加课程'}</h2>
        <button onClick={() => navigate(-1)} className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}>返回</button>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>总课时（小时）</label>
          <input name="totalHours" type="number" step="0.5" min="0.5" value={form.totalHours} onChange={handleChange} placeholder="例如: 20" required />
        </div>

        <div className={styles.formGroup}>
          <label>课程类型</label>
          <div className={styles.typeToggle}>
            <button type="button" className={form.type === 'oneOnOne' ? 'active' : ''} onClick={() => setForm({ ...form, type: 'oneOnOne' })}>一对一</button>
            <button type="button" className={form.type === 'group' ? 'active' : ''} onClick={() => setForm({ ...form, type: 'group' })}>班课</button>
          </div>
        </div>

        {form.type === 'oneOnOne' ? (
          <div className={styles.formGroup}>
            <label>学生姓名</label>
            <input name="studentName" value={form.studentName} onChange={handleChange} placeholder="输入学生姓名" required />
          </div>
        ) : (
          <>
            <div className={styles.formGroup}>
              <label>班级名</label>
              <input name="className" value={form.className} onChange={handleChange} placeholder="例如: 高一数学班" required />
            </div>
            <div className={styles.formGroup}>
              <label>学生名单</label>
              <textarea name="studentList" value={form.studentList} onChange={handleChange} placeholder="用逗号或换行分隔学生姓名" />
            </div>
          </>
        )}

        <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
          {isEdit ? '保存修改' : '添加课程'}
        </button>
      </form>
    </div>
  );
}
