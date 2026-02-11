import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaHome,
    FaBell,
    FaUsers,
    FaHospital,
    FaChartBar,
    FaMapMarkedAlt,
    FaCog
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// Import Admin Pages
import AdminOverview from './admin/AdminOverview';
import SOSAlerts from './admin/SOSAlerts';
import UserManagement from './admin/UserManagement';
import HelpCenters from './admin/HelpCenters';
import Analytics from './admin/Analytics';

const Dashboard = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [activeAlerts, setActiveAlerts] = useState(0);

    useEffect(() => {
        fetchActiveAlerts();
    }, []);

    const fetchActiveAlerts = async () => {
        try {
            const res = await api.get('/admin/dashboard');
            if (res.data.success) {
                setActiveAlerts(res.data.data.stats.activeAlerts);
            }
        } catch (error) {
            console.error('Error fetching alerts:', error);
        }
    };

    const menuItems = [
        { path: '/dashboard', icon: <FaHome />, label: 'Overview' },
        { path: '/dashboard/alerts', icon: <FaBell />, label: 'SOS Alerts', badge: activeAlerts },
        { path: '/dashboard/users', icon: <FaUsers />, label: 'Users' },
        { path: '/dashboard/help-centers', icon: <FaHospital />, label: 'Help Centers' },
        { path: '/dashboard/analytics', icon: <FaChartBar />, label: 'Analytics' },
    ];

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            paddingTop: '80px'
        }}>
            {/* Sidebar */}
            <motion.aside
                style={{
                    width: '280px',
                    position: 'fixed',
                    left: 0,
                    top: '80px',
                    bottom: 0,
                    padding: '2rem 1rem',
                    borderRight: '1px solid var(--glass-border)',
                    background: 'rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(20px)',
                    zIndex: 100
                }}
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div style={{ marginBottom: '2rem', padding: '0 1rem' }}>
                    <h3 style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Admin Portal
                    </h3>
                    <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>{user?.name}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{user?.email}</p>
                </div>

                <nav>
                    {menuItems.map((item, idx) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={idx} to={item.path}>
                                <motion.div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        padding: '1rem 1.25rem',
                                        marginBottom: '0.5rem',
                                        borderRadius: '12px',
                                        background: isActive ? 'rgba(255, 69, 58, 0.15)' : 'transparent',
                                        border: isActive ? '1px solid rgba(255, 69, 58, 0.3)' : '1px solid transparent',
                                        color: isActive ? 'var(--primary)' : 'var(--text-primary)',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                    whileHover={{
                                        background: isActive ? 'rgba(255, 69, 58, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                        x: 5
                                    }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div style={{ fontSize: '1.2rem' }}>{item.icon}</div>
                                    <span style={{ fontWeight: isActive ? 600 : 400, flex: 1 }}>{item.label}</span>
                                    {item.badge > 0 && (
                                        <motion.div
                                            style={{
                                                background: 'var(--primary)',
                                                color: 'white',
                                                borderRadius: '20px',
                                                padding: '0.25rem 0.6rem',
                                                fontSize: '0.75rem',
                                                fontWeight: 700
                                            }}
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            {item.badge}
                                        </motion.div>
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>
            </motion.aside>

            {/* Main Content */}
            <main style={{
                marginLeft: '280px',
                flex: 1,
                padding: '2rem',
                minHeight: 'calc(100vh - 80px)'
            }}>
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route index element={<AdminOverview />} />
                        <Route path="alerts" element={<SOSAlerts />} />
                        <Route path="users" element={<UserManagement />} />
                        <Route path="help-centers" element={<HelpCenters />} />
                        <Route path="analytics" element={<Analytics />} />
                    </Routes>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default Dashboard;
