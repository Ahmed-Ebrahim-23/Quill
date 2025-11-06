import React, { useEffect, useState } from 'react'
import { getUsers, deleteUser } from '../api'
import { useAuth } from '../contexts/AuthContext'

function Table({ columns, data, onDelete }){
  return (
    <table>
      <thead>
        <tr>
          {columns.map(c=> <th key={c.key}>{c.title}</th>)}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map(row=> (
          <tr key={row.id}>
            {columns.map(c=> <td key={c.key}>{c.render ? c.render(row) : row[c.key]}</td>)}
            <td>
              <button className="delete-btn" onClick={()=>onDelete(row)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function Admin(){
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{ fetchUsers() }, [])

  async function fetchUsers(){
    setLoading(true)
    try{
      const res = await getUsers()
      const usersData = res.data.data || res.data || []
      setUsers(usersData.filter(u => u.role === 'librarian'))
    }catch(err){
      console.error(err)
    }finally{ setLoading(false) }
  }

  const handleDeleteUser = async (u) => {
    if(window.confirm('Delete librarian?')){ await deleteUser(u.id); fetchUsers() }
  }
  return (
    <div className="page admin">
      <h2>Admin Dashboard</h2>
      <p>Manage librarians and system settings.</p>

      <h3>Librarians</h3>
      {loading && <div>Loading...</div>}
      {!loading && <Table columns={[{key:'name',title:'Name'},{key:'email',title:'Email'}]} data={users} onDelete={handleDeleteUser} />}
    </div>
  )
}
