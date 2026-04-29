import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CFormSelect,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CCardHeader,
  CBadge,
  CFormCheck,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilShieldAlt, cilSave, cilSettings, cilLockLocked } from '@coreui/icons'
import AppButton from '../../components/common/AppButton'

// Actions
import { getAllRoles } from '../../redux/slice/roleSlice'
import { getAllMenus } from '../../redux/slice/menuSlice'
import { getAllPermissions } from '../../redux/slice/permissionSlice'
import {
  assignRoleMenuPermissions,
  getPermissionsByRole,
} from '../../redux/slice/roleMenuPermissionSlice'

function RoleMenuPermission() {
  const dispatch = useDispatch()

  // --- 1. Selectors ---
  const roles = useSelector((state) => state.roles?.result || [])
  const menusData = useSelector((state) => state.menues?.result?.data || state.menues?.result || [])
  console.log('>>> Menus Data:', menusData)
  const dbPermissions = useSelector((state) => state.roleMenuPermissions?.rolePermissions || [])
  const permissions = useSelector((state) => state.permissions?.result || [])
  console.log('>>> Permissions:', permissions)
  const isLoading = useSelector((state) => state.roleMenuPermissions?.isLoading)

  // --- 2. Local State ---
  const [selectedRole, setSelectedRole] = useState('')
  // Ab hum sirf IDs nahi, balki object save karenge: { menuId: permissionId }
  const [assignments, setAssignments] = useState({})

  // --- 3. Load Data ---
  useEffect(() => {
    dispatch(getAllRoles())
    dispatch(getAllMenus())
    dispatch(getAllPermissions())
  }, [dispatch])

  // --- 4. Role Change Logic ---
  useEffect(() => {
    if (selectedRole) {
      dispatch(getPermissionsByRole(Number(selectedRole)))
    } else {
      setAssignments({})
    }
  }, [selectedRole, dispatch])

  useEffect(() => {
    if (!dbPermissions || dbPermissions.length === 0) return

    const map = dbPermissions.reduce((acc, item) => {
      if (item.menuId && item.permissionId) {
        acc[item.menuId] = item.permissionId
      }
      return acc
    }, {})

    setAssignments(map)
  }, [dbPermissions])

  // --- 6. Handlers ---
  const handlePermissionChange = (menuId, permissionId) => {
    setAssignments((prev) => ({
      ...prev,
      [menuId]: permissionId ? Number(permissionId) : null,
    }))
  }

  const handleSave = () => {
    if (!selectedRole) return alert('Please select a role!')

    // Payload structure for Backend
    const payload = {
      roleId: Number(selectedRole),
      tenantId: 1,
      // Sirf wo bhejein jin ki permission select ki hai
      menuPermissions: Object.keys(assignments)
        .filter((mId) => assignments[mId] !== null)
        .map((mId) => ({
          menuId: Number(mId),
          permissionId: assignments[mId],
        })),
    }

    dispatch(assignRoleMenuPermissions(payload))
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 shadow border-0">
          <CCardHeader className="p-4 bg-white border-bottom-0">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-1 fw-bold text-dark">
                  <CIcon icon={cilShieldAlt} className="me-2 text-primary" />
                  Access Control Matrix
                </h4>
                <p className="text-muted small">Link Roles to Menus and define Permission Levels</p>
              </div>
              <AppButton onClick={handleSave} loading={isLoading} disabled={!selectedRole}>
                <CIcon icon={cilSave} className="me-2" /> Save Matrix
              </AppButton>
            </div>
          </CCardHeader>

          <CCardBody className="p-0">
            {/* Header Section */}
            <div className="px-4 py-3 bg-light border-top border-bottom d-flex align-items-center">
              <div style={{ width: '300px' }}>
                <label className="small fw-bold text-uppercase text-muted mb-2 d-block">
                  Target Role
                </label>
                <CFormSelect
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="shadow-sm border-light"
                >
                  <option value="">Select a Role to Configure...</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.roleName}
                    </option>
                  ))}
                </CFormSelect>
              </div>
              <div className="ms-4 mt-4">
                <CBadge color="primary" shape="rounded-pill" className="px-3 py-2">
                  {Object.values(assignments).filter((v) => v).length} Active Assignments
                </CBadge>
              </div>
            </div>

            {/* Matrix Grid */}
            <div className="table-responsive">
              <CTable align="middle" hover borderless className="mb-0">
                <CTableHead className="bg-light text-muted small text-uppercase">
                  <CTableRow>
                    <CTableHeaderCell className="ps-4 py-3" style={{ width: '40px' }}>
                      #
                    </CTableHeaderCell>
                    <CTableHeaderCell className="py-3">Menu Component</CTableHeaderCell>
                    <CTableHeaderCell className="py-3" style={{ width: '300px' }}>
                      Permission Level
                    </CTableHeaderCell>
                    <CTableHeaderCell className="py-3 text-center">Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {menusData.map((menu, index) => (
                    <CTableRow key={menu.id} className="border-bottom border-light">
                      <CTableDataCell className="ps-4 text-muted small">{index + 1}</CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex align-items-center">
                          <div
                            className={`p-2 rounded-3 me-3 ${menu.parentId ? 'bg-white' : 'bg-light'}`}
                          >
                            <CIcon
                              icon={cilSettings}
                              size="sm"
                              className={menu.parentId ? 'text-info' : 'text-primary'}
                            />
                          </div>
                          <div>
                            <div
                              className={`fw-semibold ${menu.parentId ? 'text-muted small ps-3' : 'text-dark'}`}
                            >
                              {menu.parentId && <span className="me-2">↳</span>}
                              {menu.title}
                            </div>
                            <span className="text-muted" style={{ fontSize: '10px' }}>
                              {menu.url}
                            </span>
                          </div>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormSelect
                          size="sm"
                          className="border-light shadow-sm"
                          value={assignments[menu.id] || ''}
                          onChange={(e) => handlePermissionChange(menu.id, e.target.value)}
                          disabled={!selectedRole}
                        >
                          <option value="">No Access</option>
                          {permissions.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.permissionName}
                            </option>
                          ))}
                        </CFormSelect>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {assignments[menu.id] ? (
                          <CBadge color="success" shape="rounded-pill" variant="outline">
                            Enabled
                          </CBadge>
                        ) : (
                          <CIcon icon={cilLockLocked} className="text-light" />
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default RoleMenuPermission
