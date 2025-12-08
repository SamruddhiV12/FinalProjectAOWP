import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/StudentSchedule.css';

function StudentSchedule({ user }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/class-schedules?published=true`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (data.success) {
        setSchedules(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch class schedules');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getUpcomingSchedules = () => {
    const now = new Date();
    return schedules.filter((s) => new Date(s.date) >= now);
  };

  const groupSchedulesByDate = () => {
    const grouped = {};
    const upcoming = getUpcomingSchedules();

    upcoming.forEach((schedule) => {
      const dateKey = new Date(schedule.date).toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(schedule);
    });

    return grouped;
  };

  if (loading) {
    return (
      <div className="student-schedule-container">
        <div className="loading">Loading class schedules...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-schedule-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  const groupedSchedules = groupSchedulesByDate();
  const sortedDates = Object.keys(groupedSchedules).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  return (
    <div className="student-schedule-container">
      <div className="schedule-header">
        <h1>📅 Class Schedule</h1>
        <Link to="/student" className="btn-back">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="schedule-info-card">
        <h3>Upcoming Classes</h3>
        <p>Check your scheduled classes below. All times are in local timezone.</p>
      </div>

      {sortedDates.length === 0 ? (
        <div className="no-schedules">
          <h2>No Upcoming Classes</h2>
          <p>Your teacher hasn't published any class schedules yet.</p>
        </div>
      ) : (
        <div className="schedule-timeline">
          {sortedDates.map((dateKey) => (
            <div key={dateKey} className="schedule-day">
              <div className="day-label">
                <div className="date-info">
                  <span className="day-name">
                    {new Date(dateKey).toLocaleDateString('en-US', {
                      weekday: 'long',
                    })}
                  </span>
                  <span className="date-num">
                    {new Date(dateKey).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <div className="day-schedule-cards">
                {groupedSchedules[dateKey].map((schedule) => (
                  <div key={schedule._id} className="schedule-card">
                    <div className="time-badge">
                      {schedule.startTime} - {schedule.endTime}
                    </div>
                    <h3>{schedule.batch?.name}</h3>
                    <p className="batch-level">{schedule.batch?.level} Level</p>
                    {schedule.topic && (
                      <p className="class-topic">
                        <strong>Topic:</strong> {schedule.topic}
                      </p>
                    )}
                    <p className="class-location">
                      <strong>Location:</strong> {schedule.location}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentSchedule;
