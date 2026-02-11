import React from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaChartBar, FaChartPie } from 'react-icons/fa';

const Analytics = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    Analytics & Reports
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    System insights and performance metrics
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <motion.div
                    className="glass-panel"
                    style={{ padding: '2rem', textAlign: 'center' }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -5 }}
                >
                    <FaChartLine size={50} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        Alert Trends
                    </h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Track emergency alert patterns over time
                    </p>
                </motion.div>

                <motion.div
                    className="glass-panel"
                    style={{ padding: '2rem', textAlign: 'center' }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ y: -5 }}
                >
                    <FaChartBar size={50} color="var(--secondary)" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        Response Times
                    </h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Average response time by help center type
                    </p>
                </motion.div>

                <motion.div
                    className="glass-panel"
                    style={{ padding: '2rem', textAlign: 'center' }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ y: -5 }}
                >
                    <FaChartPie size={50} color="var(--accent)" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        User Activity
                    </h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Active users and engagement metrics
                    </p>
                </motion.div>
            </div>

            <motion.div
                className="glass-panel"
                style={{ padding: '3rem', marginTop: '2rem', textAlign: 'center' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                    📊 Advanced analytics dashboard coming soon
                </p>
            </motion.div>
        </motion.div>
    );
};

export default Analytics;
