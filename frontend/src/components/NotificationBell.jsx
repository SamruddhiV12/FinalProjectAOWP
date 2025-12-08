import React, { useEffect, useState } from 'react';
import '../styles/NotificationBell.css';

function NotificationBell({ user }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (err) {
      console.error('Error fetching notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.REACT_APP_API_URL}/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error('Error marking notification as read', err);
    }
  };

  const markAll = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.REACT_APP_API_URL}/api/notifications/read-all`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('Error marking all as read', err);
    }
  };

  const toggle = () => {
    setOpen(!open);
    if (!open) {
      fetchNotifications();
    }
  };

  return (
    <div className="notif-wrapper">
      <button className="notif-bell" onClick={toggle} aria-label="Notifications">
        🔔
        {unreadCount > 0 && <span className="notif-count">{unreadCount}</span>}
      </button>
      {open && (
        <div className="notif-panel">
          <div className="notif-header">
            <div>
              <h4>Alerts</h4>
              <p className="helper-text">{loading ? 'Loading...' : `${notifications.length} items`}</p>
            </div>
            <button className="mark-all" onClick={markAll}>Mark all read</button>
          </div>
          <div className="notif-list">
            {notifications.length === 0 && <p className="helper-text">No notifications</p>}
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`notif-item ${n.read ? '' : 'unread'}`}
                onClick={() => markAsRead(n._id)}
              >
                <p className="notif-title">{n.title}</p>
                <p className="notif-message">{n.message}</p>
                <p className="notif-time">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
