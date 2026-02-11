import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaSearch, FaUserShield, FaUser } from 'react-icons/fa';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            if (res.data.success) {
                setUsers(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    User Management
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    View and manage all registered users
                </p>
            </div>

            {/* Search Bar */}
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ position: 'relative' }}>
                    <FaSearch style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-secondary)'
                    }} />
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: '3rem' }}
                    />
                </div>
            </div>

            {/* Users Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {loading ? (
                    <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                        Loading users...
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        No users found
                    </div>
                ) : (
                    filteredUsers.map((user, idx) => (
                        <motion.div
                            key={user._id}
                            className="glass-panel"
                            style={{ padding: '1.75rem' }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ y: -5 }}
                        >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--secondary), var(--accent))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem',
                                    flexShrink: 0
                                }}>
                                    <FaUser color="white" />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                                            {user.name}
                                        </h3>
                                    </div>
                                    <p style={{
                                        color: 'var(--text-secondary)',
                                        fontSize: '0.9rem',
                                        marginBottom: '0.75rem',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {user.email}
                                    </p>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr',
                                        gap: '0.5rem',
                                        fontSize: '0.85rem'
                                    }}>
                                        <div>
                                            <p style={{ color: 'var(--text-tertiary)' }}>Phone</p>
                                            <p style={{ fontWeight: 600 }}>{user.phone || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '0.75rem' }}>
                                        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                                            User ID: {user._id?.slice(-8)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Stats Summary */}
            <motion.div
                className="glass-panel"
                style={{ padding: '2rem', marginTop: '2rem' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
                    <div>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total Users</p>
                        <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)' }}>{users.length}</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default UserManagement;
