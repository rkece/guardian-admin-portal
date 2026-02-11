import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHospital, FaShieldAlt, FaPlus } from 'react-icons/fa';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const HelpCenters = () => {
    const [helpCenters, setHelpCenters] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHelpCenters();
    }, [filter]);

    const fetchHelpCenters = async () => {
        try {
            const params = filter !== 'all' ? { type: filter } : {};
            const res = await api.get('/help-centers', { params });
            if (res.data.success) {
                setHelpCenters(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching help centers:', error);
            toast.error('Failed to load help centers');
        } finally {
            setLoading(false);
        }
    };

    const getIconForType = (type) => {
        switch (type) {
            case 'hospital': return '🏥';
            case 'police': return '🚔';
            case 'ngo': return '🤝';
            case 'fire-station': return '🚒';
            default: return '📍';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                        Help Centers
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        Manage emergency response centers
                    </p>
                </div>
                <motion.button
                    className="btn btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FaPlus /> Add New Center
                </motion.button>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {['all', 'police', 'hospital', 'ngo', 'fire-station'].map((type) => (
                    <motion.button
                        key={type}
                        className={filter === type ? 'btn btn-primary' : 'btn btn-glass'}
                        style={{ padding: '0.75rem 1.5rem', textTransform: 'capitalize' }}
                        onClick={() => setFilter(type)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {type === 'all' ? 'All Centers' : type.replace('-', ' ')}
                    </motion.button>
                ))}
            </div>

            {/* Help Centers Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
                {loading ? (
                    <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                        Loading help centers...
                    </div>
                ) : helpCenters.length === 0 ? (
                    <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        No help centers found
                    </div>
                ) : (
                    helpCenters.map((center, idx) => (
                        <motion.div
                            key={center._id}
                            className="glass-panel"
                            style={{ padding: '2rem' }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ y: -5 }}
                        >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{
                                    fontSize: '3rem',
                                    flexShrink: 0
                                }}>
                                    {getIconForType(center.type)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                                        {center.name}
                                    </h3>
                                    <span style={{
                                        padding: '0.35rem 0.8rem',
                                        borderRadius: '12px',
                                        background: 'rgba(10, 132, 255, 0.2)',
                                        color: 'var(--secondary)',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        textTransform: 'uppercase'
                                    }}>
                                        {center.type.replace('-', ' ')}
                                    </span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div>
                                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                                        Address
                                    </p>
                                    <p style={{ fontWeight: 500 }}>{center.location?.address || 'N/A'}</p>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    <div>
                                        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                                            Phone
                                        </p>
                                        <p style={{ fontWeight: 600, color: 'var(--primary)' }}>{center.contact?.phone || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                                            Availability
                                        </p>
                                        <p style={{ fontWeight: 600, color: center.availability?.isOpen24x7 ? 'var(--success)' : 'var(--warning)' }}>
                                            {center.availability?.isOpen24x7 ? '24/7' : 'Limited'}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                                        Coordinates
                                    </p>
                                    <p style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>
                                        {center.location?.latitude?.toFixed(4)}, {center.location?.longitude?.toFixed(4)}
                                    </p>
                                </div>
                            </div>

                            <div style={{
                                marginTop: '1.5rem',
                                paddingTop: '1rem',
                                borderTop: '1px solid var(--glass-border)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Response Time</p>
                                    <p style={{ fontWeight: 700, color: 'var(--accent)' }}>~{center.responseTime || 10} min</p>
                                </div>
                                <div style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    background: center.isActive ? 'rgba(48, 209, 88, 0.2)' : 'rgba(255, 69, 58, 0.2)',
                                    color: center.isActive ? 'var(--success)' : 'var(--error)',
                                    fontSize: '0.85rem',
                                    fontWeight: 600
                                }}>
                                    {center.isActive ? 'Active' : 'Inactive'}
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
};

export default HelpCenters;
