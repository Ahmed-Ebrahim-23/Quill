import React from 'react'
import Table from '../ui/Table'
import { deleteUser } from '../../api'

/**
 * MembersTab Component
 * Manages viewing and deleting members
 */
export default function MembersTab({ users, onDataUpdate, showSuccess, showError }) {
  const handleDeleteUser = async (user) => {
    if (window.confirm(`Delete user "${user.name}"?`)) {
      try {
        await deleteUser(user.id)
        showSuccess('User deleted successfully')
        onDataUpdate()
      } catch (err) {
        const message =
          err.response?.data?.data?.description ||
          err.response?.data?.message ||
          'Failed to delete user'
        showError(message)
      }
    }
  }

  return (
    <div className="members-tab">
      <section aria-labelledby="members-list-heading">
        <h3 id="members-list-heading">Members List ({users.length})</h3>
        {users.length > 0 ? (
          <Table
            columns={[
              { key: 'name', title: 'Name' },
              { key: 'email', title: 'Email' },
              { key: 'role', title: 'Role' }
            ]}
            data={users}
            onDelete={handleDeleteUser}
          />
        ) : (
          <div className="no-results">
            <p>No members found.</p>
          </div>
        )}
      </section>
    </div>
  )
}
