import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import styles from "./WeeklyRecordPage.module.css";

const DAY_NAMES = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function fmtDate(d) {
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function WeekSelector({ monday, onChange }) {
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const prev = () => {
    const d = new Date(monday);
    d.setDate(d.getDate() - 7);
    onChange(d);
  };
  const next = () => {
    const d = new Date(monday);
    d.setDate(d.getDate() + 7);
    onChange(d);
  };
  const goToday = () => onChange(getMonday(new Date()));

  const isThisWeek =
    getMonday(new Date()).toDateString() === monday.toDateString();

  return (
    <div className={styles.weekSelector}>
      <button onClick={prev} className={styles.weekBtn}>&lsaquo;</button>
      <span className={styles.weekLabel}>
        {fmtDate(monday)} — {fmtDate(sunday)}
      </span>
      <button onClick={next} className={styles.weekBtn}>&rsaquo;</button>
      {!isThisWeek && (
        <button onClick={goToday} className={styles.todayBtn}>本周</button>
      )}
    </div>
  );
}

export default function WeeklyRecordPage({ courses, records }) {
  const [monday, setMonday] = useState(() => getMonday(new Date()));

  const weekRecords = useMemo(() => {
    const result = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      const dateStr = day.toISOString().split("T")[0];
      const dayRecords = records
        .filter((r) => r.date === dateStr)
        .map((r) => {
          const course = courses.find((c) => c.id === r.courseId);
          const name = course
            ? course.type === "oneOnOne"
              ? course.studentName
              : course.className
            : "未知课程";
          const type = course ? course.type : "oneOnOne";
          return { ...r, courseName: name, courseType: type, courseId: r.courseId };
        })
        .sort((a, b) => a.courseName.localeCompare(b.courseName));
      result.push({ date: dateStr, label: DAY_NAMES[i], records: dayRecords });
    }
    return result;
  }, [monday, records, courses]);

  const totalHours = useMemo(
    () =>
      weekRecords.reduce(
        (sum, day) =>
          sum + day.records.reduce((s, r) => s + Number(r.duration), 0),
        0
      ),
    [weekRecords]
  );

  const totalRecords = useMemo(
    () => weekRecords.reduce((sum, day) => sum + day.records.length, 0),
    [weekRecords]
  );

  return (
    <div>
      <div className={styles.pageHeader}>
        <h2>本周课程记录</h2>
        <Link to="/add-course" className={`${styles.btn} ${styles.btnPrimary}`}>
          + 添加课程
        </Link>
      </div>

      <WeekSelector monday={monday} onChange={setMonday} />

      <div className={styles.summaryBar}>
        <div className={styles.summaryItem}>
          <div className={styles.summaryLabel}>总记录数</div>
          <div className={styles.summaryValue}>{totalRecords}</div>
        </div>
        <div className={styles.summaryItem}>
          <div className={styles.summaryLabel}>总课时</div>
          <div className={styles.summaryValue}>{totalHours.toFixed(1)}h</div>
        </div>
        <div className={styles.summaryItem}>
          <div className={styles.summaryLabel}>覆盖课程</div>
          <div className={styles.summaryValue}>
            {new Set(weekRecords.flatMap((d) => d.records.map((r) => r.courseId))).size}
          </div>
        </div>
      </div>

      {weekRecords.every((d) => d.records.length === 0) ? (
        <div className={styles.emptyState}>
          <p>本周暂无课程记录</p>
        </div>
      ) : (
        <>
          <div className={styles.columnHeadings}>
            <span />
            <span>课程名称</span>
            <span>课时</span>
            <span>上课内容</span>
            <span>作业安排</span>
            <span />
          </div>
          <div className={styles.weekGrid}>
            {weekRecords.map((day) => (
            <div
              key={day.date}
              className={`${styles.dayColumn} ${day.records.length === 0 ? styles.dayEmpty : ""}`}
            >
              <div className={styles.dayHeader}>
                <span className={styles.dayLabel}>{day.label}</span>
                <span className={styles.dayDate}>{fmtDate(new Date(day.date))}</span>
              </div>
              {day.records.length === 0 ? (
                <div className={styles.noRecord}>—</div>
              ) : (
                day.records.map((r) => (
                  <div className={styles.recordCard} key={r.id}>
                    <span
                      className={`${styles.badge} ${
                        r.courseType === "oneOnOne"
                          ? styles.badgeBlue
                          : styles.badgeGreen
                      }`}
                    >
                      {r.courseType === "oneOnOne" ? "一对一" : "班课"}
                    </span>
                    <span className={styles.recordCourseName}>
                      {r.courseName}
                    </span>
                    <span className={styles.recordDuration}>
                      {Number(r.duration).toFixed(1)}h
                    </span>
                    <span className={styles.recordContent}>
                      {r.content || "—"}
                    </span>
                    <span className={styles.recordHomework}>
                      {r.homework || "—"}
                    </span>
                    <Link
                      to={`/course/${r.courseId}`}
                      className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}
                    >
                      查看
                    </Link>
                  </div>
                ))
              )}
            </div>
          ))}
          </div>
        </>
      )}
    </div>
  );
}
