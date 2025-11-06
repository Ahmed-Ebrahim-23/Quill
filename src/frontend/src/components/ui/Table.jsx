import React from 'react'

function Table({ columns, data, onDelete, onUpdate, showActions = true, customActions }){
  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map(c=> <th key={c.key}>{c.title}</th>)}
          {(showActions || customActions) && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map(row=> (
          <tr key={row.id || row.isbn} onClick={() => onUpdate && onUpdate(row)} style={{cursor: onUpdate ? 'pointer' : 'default'}}>
            {columns.map(c=> <td key={c.key}>{c.render ? c.render(row) : row[c.key]}</td>)}
            {(showActions || customActions) && (
              <td>
                {customActions && customActions(row)}
                {onUpdate && <button className="update-btn" onClick={(e) => { e.stopPropagation(); onUpdate(row); }}>Update</button>}
                {onDelete && <button className="delete-btn" onClick={(e) => { e.stopPropagation(); onDelete(row); }}>Delete</button>}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table