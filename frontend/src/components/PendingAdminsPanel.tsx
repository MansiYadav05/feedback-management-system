import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FaCheck, FaTimes, FaUserShield, FaClock } from 'react-icons/fa'
import axios from 'axios'

interface PendingAdmin {
    _id: string
    name: string
    email: string
    createdAt: string
}

interface PendingAdminsPanelProps {
    onRefresh?: () => void
}

export function PendingAdminsPanel({ onRefresh }: PendingAdminsPanelProps) {
    const [pendingAdmins, setPendingAdmins] = useState<PendingAdmin[]>([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    useEffect(() => {
        fetchPendingAdmins()
    }, [])

    const fetchPendingAdmins = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('adminToken')
            if (!token) {
                toast.error('No authentication token found')
                return
            }

            const config = {
                headers: { Authorization: `Bearer ${token}` },
            }

            const response = await axios.get(
                'http://localhost:5000/admin/pending-admins',
                config
            )

            setPendingAdmins(response.data.pendingAdmins || [])
        } catch (error: any) {
            const message =
                error.response?.data?.message || 'Failed to load pending admins'
            toast.error(message)
            console.error('Error fetching pending admins:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleApprove = async (userId: string, email: string) => {
        try {
            setActionLoading(userId)
            const token = localStorage.getItem('adminToken')
            if (!token) {
                toast.error('No authentication token found')
                return
            }

            const config = {
                headers: { Authorization: `Bearer ${token}` },
            }

            await axios.post(
                `http://localhost:5000/admin/approve-admin/${userId}`,
                {},
                config
            )

            toast.success(`${email} has been approved successfully`)
            setPendingAdmins(pendingAdmins.filter((admin) => admin._id !== userId))
            onRefresh?.()
        } catch (error: any) {
            const message =
                error.response?.data?.message || 'Failed to approve admin'
            toast.error(message)
            console.error('Error approving admin:', error)
        } finally {
            setActionLoading(null)
        }
    }

    const handleReject = async (userId: string, email: string) => {
        if (
            !window.confirm(
                `Are you sure you want to reject ${email}? This action cannot be undone.`
            )
        ) {
            return
        }

        try {
            setActionLoading(userId)
            const token = localStorage.getItem('adminToken')
            if (!token) {
                toast.error('No authentication token found')
                return
            }

            const config = {
                headers: { Authorization: `Bearer ${token}` },
            }

            await axios.post(
                `http://localhost:5000/admin/reject-admin/${userId}`,
                {},
                config
            )

            toast.success(`${email} has been rejected`)
            setPendingAdmins(pendingAdmins.filter((admin) => admin._id !== userId))
            onRefresh?.()
        } catch (error: any) {
            const message =
                error.response?.data?.message || 'Failed to reject admin'
            toast.error(message)
            console.error('Error rejecting admin:', error)
        } finally {
            setActionLoading(null)
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    if (loading) {
        return (
            <div className="pending-admins-panel loading">
                <div className="spinner"></div>
                <p>Loading pending admin requests...</p>
            </div>
        )
    }

    return (
        <div className="pending-admins-panel">
            <div className="panel-header">
                <div className="header-content">
                    <FaUserShield className="header-icon" />
                    <div>
                        <h2>Admin Approval Requests</h2>
                        <p>Manage pending admin registrations</p>
                    </div>
                </div>
                <div className="badge">{pendingAdmins.length}</div>
            </div>

            {pendingAdmins.length === 0 ? (
                <div className="empty-state">
                    <FaClock className="empty-icon" />
                    <p>No pending admin requests</p>
                    <span>All admin registrations have been reviewed</span>
                </div>
            ) : (
                <div className="admins-list">
                    {pendingAdmins.map((admin) => (
                        <div key={admin._id} className="admin-card">
                            <div className="admin-info">
                                <div className="admin-avatar">
                                    {admin.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="admin-details">
                                    <h3>{admin.name}</h3>
                                    <p className="email">{admin.email}</p>
                                    <p className="request-date">
                                        <FaClock className="date-icon" />
                                        Requested on {formatDate(admin.createdAt)}
                                    </p>
                                </div>
                            </div>
                            <div className="admin-actions">
                                <button
                                    className="btn btn-approve"
                                    onClick={() => handleApprove(admin._id, admin.email)}
                                    disabled={actionLoading === admin._id}
                                    title="Approve this admin"
                                >
                                    <FaCheck />
                                    {actionLoading === admin._id ? 'Processing...' : 'Approve'}
                                </button>
                                <button
                                    className="btn btn-reject"
                                    onClick={() => handleReject(admin._id, admin.email)}
                                    disabled={actionLoading === admin._id}
                                    title="Reject this admin"
                                >
                                    <FaTimes />
                                    {actionLoading === admin._id ? 'Processing...' : 'Reject'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
