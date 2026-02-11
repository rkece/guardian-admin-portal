import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaBell, FaCheckCircle, FaHospital, FaExclamationTriangle } from 'react-icons/fa';
import api from '../../services/api';

const AdminOverview = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeAlerts: 0,
        resolvedAlerts: 0,
        helpCenters: 0
    });
    const [recentAlerts, setRecentAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const res = await api.get('/admin/dashboard');
            if (res.data.success) {
                setStats(res.data.data.stats);
                setRecentAlerts(res.data.data.recentAlerts);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ icon, title, value, color, trend }) => (
        <motion.div
            className="glass-panel"
            style={{ padding: '2rem' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        {title}
                    </p>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color }}>{value}</h2>
                    {trend && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--success)', marginTop: '0.5rem' }}>
                            {trend}
                        </p>
                    )}
                </div>
                <div style={{
                    fontSize: '2.5rem',
                    color,
                    opacity: 0.3
                }}>
                    {icon}
                </div>
            </div>
        </motion.div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    Admin Dashboard
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Monitor and manage the Guardian safety system
                </p>
            </div>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                <StatCard
                    icon={<FaUsers />}
                    title="Total Users"
                    value={stats.totalUsers}
                    color="var(--secondary)"
                    trend="+12% this month"
                />
                <StatCard
                    icon={<FaExclamationTriangle />}
                    title="Active Alerts"
                    value={stats.activeAlerts}
                    color="var(--primary)"
                />
                <StatCard
                    icon={<FaCheckCircle />}
                    title="Resolved Alerts"
                    value={stats.resolvedAlerts}
                    color="var(--success)"
                    trend="+8 today"
                />
                <StatCard
                    icon={<FaHospital />}
                    title="Help Centers"
                    value={stats.helpCenters}
                    color="var(--accent)"
                />
            </div>

            {/* Recent Alerts */}
            <motion.div
                className="glass-panel"
                style={{ padding: '2rem' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem'
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                        <FaBell style={{ marginRight: '0.5rem', color: 'var(--primary)' }} />
                        Recent SOS Alerts
                    </h2>
                    <button className="btn btn-glass" style={{ padding: '0.5rem 1rem' }}>
                        View All
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                        Loading alerts...
                    </div>
                ) : recentAlerts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                        No recent alerts
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {recentAlerts.map((alert, idx) => (
                            <motion.div
                                key={alert._id}
                                style={{
                                    padding: '1.25rem',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: '12px',
                                    borderLeft: `4px solid ${alert.status === 'active' ? 'var(--primary)' :
                                            alert.status === 'resolved' ? 'var(--success)' :
                                                'var(--warning)'
                                        }`,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ x: 5 }}
                            >
                                <div>
                                    <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                                        {alert.userId?.name || 'Unknown User'}
                                    </p>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        Priority: {alert.priority} • {new Date(alert.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    background: alert.status === 'active' ? 'rgba(255, 69, 58, 0.2)' : 'rgba(48, 209, 88, 0.2)',
                                    color: alert.status === 'active' ? 'var(--primary)' : 'var(--success)',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    textTransform: 'capitalize'
                                }}>
                                    {alert.status}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default AdminOverview;
