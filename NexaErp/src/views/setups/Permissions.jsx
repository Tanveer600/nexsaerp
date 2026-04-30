import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CRow, CCol, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react'
import AppButton from '../../components/common/AppButton'
import AddEditPermissionModal from './AddEditPermissionForm'
import '../../scss/permissingSetting.scss'
// Import your slices (Just like Users.jsx)
import {
  getAllPermissions,
  createPermission,
  updatePermission,
  deletePermission,
} from '../../redux/slice/permissionSlice'

function Permissions() {
  const dispatch = useDispatch()

  // Redux Selectors (Same pattern as Users.jsx)
  const permissionsData = useSelector((state) => state.permissions?.result)
  const permissions = permissionsData || []

  const [visible, setVisible] = useState(false)
  const [form, setForm] = useState({
    id: 0,
    permissionName: '',
    description: '',
    canView: false,
    canAdd: false,
    canUpdate: false,
    canDelete: false,
  })

  useEffect(() => {
    dispatch(getAllPermissions())
  }, [dispatch])

  const handleSave = () => {
    if (!form.permissionName) return

    if (form.id === 0) {
      dispatch(createPermission(form))
    } else {
      dispatch(updatePermission(form))
    }

    setVisible(false)
    setForm({
      id: 0,
      permissionName: '',
      description: '',
      canView: false,
      canAdd: false,
      canUpdate: false,
      canDelete: false,
    })
  }

  return (
    <div className="user-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="mb-1">Permissions</h4>
          <AppButton variant="golden" data={permissions} fileName="Permissions_Report" size="sm">
            download xls
          </AppButton>
        </div>
        <AppButton onClick={() => setVisible(true)}>Add Permission</AppButton>
      </div>

      {/* Table Header UI */}
      <div className="table-header px-4">
        <span>Permission Name</span>
        <span>Description</span>
        <span className="text-center">V / A / U / D</span>
        <span className="text-end pr-4">Action</span>
      </div>

      {/* Permission Cards (UI as per image) */}
      <div className="mt-2">
        {permissions.map((p) => (
          <div key={p.id} className="user-card px-4">
            <span className="fw-bold">{p.permissionName}</span>
            <span className="text-muted">{p.description}</span>

            {/* V/A/U/D Pills */}
            <div className="d-flex gap-1 justify-content-center">
              <span className={`badge ${p.canView ? 'bg-success' : 'bg-light text-dark'}`}>V</span>
              <span className={`badge ${p.canAdd ? 'bg-success' : 'bg-light text-dark'}`}>A</span>
              <span className={`badge ${p.canUpdate ? 'bg-success' : 'bg-light text-dark'}`}>
                U
              </span>
              <span className={`badge ${p.canDelete ? 'bg-success' : 'bg-light text-dark'}`}>
                D
              </span>
            </div>

            <div className="text-end">
              <CDropdown variant="btn-group">
                <CDropdownToggle color="white" className="p-0 border-0 shadow-none" caret={false}>
                  <div style={{ cursor: 'pointer', fontSize: '20px' }}>⋮</div>
                </CDropdownToggle>
                <CDropdownMenu className="border-0 shadow">
                  <CDropdownItem
                    onClick={() => {
                      setForm(p)
                      setVisible(true)
                    }}
                  >
                    Edit
                  </CDropdownItem>
                  <CDropdownItem
                    className="text-danger"
                    onClick={() => dispatch(deletePermission(p.id))}
                  >
                    Delete
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </div>
          </div>
        ))}
      </div>

      {/* Modal - Same pattern as UserAddEditModal */}
      <AddEditPermissionModal
        visible={visible}
        setVisible={setVisible}
        form={form}
        setForm={setForm}
        handleSave={handleSave}
      />
    </div>
  )
}

export default Permissions
