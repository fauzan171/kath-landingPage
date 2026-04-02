/**
 * NotificationBell Component
 *
 * Displays notifications with dropdown and mark as read functionality
 */

import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck, ExternalLink, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { notificationsService } from '@/services/cibc.service';
import { useLanguage } from '@/contexts/LanguageContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationBellProps {
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllRead: () => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  unreadCount,
  onMarkAsRead,
  onMarkAllRead
}) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationsService.getMy();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    if (!notification.is_read) {
      try {
        await notificationsService.markRead(notification.id);
        onMarkAsRead(notification.id);
        setNotifications(prev =>
          prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
        );
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    }

    // Navigate if link exists
    if (notification.link) {
      navigate(notification.link);
    }

    setIsOpen(false);
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsService.markAllRead();
      onMarkAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.success(language === 'id' ? 'Semua notifikasi ditandai sudah dibaca' : 'All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error(language === 'id' ? 'Gagal menandai notifikasi' : 'Failed to mark notifications');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'payment_verified':
      case 'submission_graded':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'payment_rejected':
      case 'needs_revision':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'warning':
      case 'deadline_reminder':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'payment_verified':
      case 'submission_graded':
        return 'bg-green-100';
      case 'payment_rejected':
      case 'needs_revision':
        return 'bg-red-100';
      case 'warning':
      case 'deadline_reminder':
        return 'bg-amber-100';
      default:
        return 'bg-blue-100';
    }
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return language === 'id' ? 'Baru saja' : 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} ${language === 'id' ? 'menit lalu' : 'min ago'}`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} ${language === 'id' ? 'jam lalu' : 'hours ago'}`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} ${language === 'id' ? 'hari lalu' : 'days ago'}`;
    return date.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 bg-white border border-[#0F0F0F]/5 text-[#0F0F0F]/60 hover:text-[#FFB22C] rounded-xl shadow-sm transition-all hover:-translate-y-0.5"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#FFB22C] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
            <h3 className="font-semibold text-[#0F0F0F]">
              {language === 'id' ? 'Notifikasi' : 'Notifications'}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-xs font-medium text-[#FFB22C] hover:text-[#FFB22C]/80 transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
                {language === 'id' ? 'Tandai semua' : 'Mark all read'}
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-2 border-[#FFB22C] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">{language === 'id' ? 'Memuat...' : 'Loading...'}</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  {language === 'id' ? 'Belum ada notifikasi' : 'No notifications yet'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                      !notification.is_read ? 'bg-[#FFB22C]/5' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getBgColor(notification.type)}`}>
                        {getIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm ${!notification.is_read ? 'font-semibold text-[#0F0F0F]' : 'text-gray-700'}`}>
                            {notification.title}
                          </p>
                          {!notification.is_read && (
                            <span className="w-2 h-2 bg-[#FFB22C] rounded-full flex-shrink-0 mt-1.5"></span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] text-gray-400">
                            {timeAgo(notification.created_at)}
                          </span>
                          {notification.link && (
                            <ExternalLink className="w-3 h-3 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => {
                  setIsOpen(false);
                  // Could navigate to a full notifications page
                }}
                className="w-full text-center text-sm font-medium text-[#FFB22C] hover:text-[#FFB22C]/80 transition-colors"
              >
                {language === 'id' ? 'Lihat semua notifikasi' : 'View all notifications'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;