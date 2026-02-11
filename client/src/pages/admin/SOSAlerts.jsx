import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBell, FaMapMarkerAlt, FaUser, FaPhone, FaClock } from 'react-icons/fa';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const SOSAlerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAlerts();
    }, [filter]);

    const fetchAlerts = async () => {
        try {
            const params = filter !== 'all' ? { status: filter } : {};
            const res = await api.get('/admin/alerts', { params });
            if (res.data.success) {
                setAlerts(res.data.data.alerts);
            }
        } catch (error) {
            console.error('Error fetching alerts:', error);
            toast.error('Failed to load alerts');
        } finally {
            setLoading(false);
        }
    };

    const updateAlertStatus = async (alertId, newStatus) => {
        try {
            const res = await api.put(`/admin/alerts/${alertId}/status`, { status: newStatus });
            if (res.data.success) {
                toast.success('Alert status updated');
                fetchAlerts();
            }
        } catch (error) {
            toast.error('Failed to update alert');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    SOS Alerts Management
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Monitor and respond to emergency alerts
                </p>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {['all', 'active', 'resolved', 'false-alarm'].map((status) => (
                    <motion.button
                        key={status}
                        className={filter === status ? 'btn btn-primary' : 'btn btn-glass'}
                        style={{ padding: '0.75rem 1.5rem', textTransform: 'capitalize' }}
                        onClick={() => setFilter(status)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {status === 'all' ? 'All Alerts' : status.replace('-', ' ')}
                    </motion.button>
                ))}
            </div>

            {/* Alerts List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {loading ? (
                    <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                        Loading alerts...
                    </div>
                ) : alerts.length === 0 ? (
                    <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        No alerts found
                    </div>
                ) : (
                    alerts.map((alert, idx) => (
                        <motion.div
                            key={alert._id}
                            className="glass-panel"
                            style={{ padding: '2rem' }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                                {/* Left: Alert Details */}
                                <div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        marginBottom: '1rem'
                                    }}>
                                        <div style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.5rem'
                                        }}>
                                            <FaBell color="white" />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>
                                                Emergency Alert #{alert._id.slice(-6)}
                                            </h3>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                <FaClock style={{ marginRight: '0.5rem' }} />
                                                {new Date(alert.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '1rem',
                                        marginTop: '1.5rem'
                                    }}>
                                        <div>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                                                <FaUser style={{ marginRight: '0.5rem' }} />
                                                User
                                            </p>
                                            <p style={{ fontWeight: 600 }}>{alert.userId?.name || 'Unknown'}</p>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                {alert.userId?.email}
                                            </p>
                                        </div>
                                        <div>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                                                <FaPhone style={{ marginRight: '0.5rem' }} />
                                                Phone
                                            </p>
                                            <p style={{ fontWeight: 600 }}>{alert.userId?.phone || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                                                <FaMapMarkerAlt style={{ marginRight: '0.5rem' }} />
                                                Location
                                            </p>
                                            <p style={{ fontWeight: 600 }}>
                                                {alert.location?.latitude?.toFixed(4)}, {alert.location?.longitude?.toFixed(4)}
                                            </p>
                                        </div>
                                        <div>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                                                Priority
                                            </p>
                                            <p style={{
                                                fontWeight: 700,
                                                color: alert.priority === 'critical' ? 'var(--primary)' : 'var(--warning)',
                                                textTransform: 'uppercase'
                                            }}>
                                                {alert.priority}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Actions */}
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem',
                                    justifyContent: 'center'
                                }}>
                                    <div style={{
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        background: alert.status === 'active' ? 'rgba(255, 69, 58, 0.15)' : 'rgba(48, 209, 88, 0.15)',
                                        border: `2px solid ${alert.status === 'active' ? 'var(--primary)' : 'var(--success)'}`,
                                        textAlign: 'center'
                                    }}>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                            Status
                                        </p>
                                        <p style={{
                                            fontSize: '1.2rem',
                                            fontWeight: 700,
                                            textTransform: 'capitalize',
                                            color: alert.status === 'active' ? 'var(--primary)' : 'var(--success)'
                                        }}>
                                            {alert.status}
                                        </p>
                                    </div>

                                    {alert.status === 'active' && (
                                        <>
                                            <motion.button
                                                className="btn btn-secondary"
                                                style={{ width: '100%' }}
                                                onClick={() => updateAlertStatus(alert._id, 'resolved')}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Mark Resolved
                                            </motion.button>
                                            <motion.button
                                                className="btn btn-glass"
                                                style={{ width: '100%' }}
                                                onClick={() => updateAlertStatus(alert._id, 'false-alarm')}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                False Alarm
                                            </motion.button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
};

export default SOSAlerts;
