import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableRow,
  CAvatar,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilCheckCircle } from '@coreui/icons'

import TableHeader from '../../components/common/TableHeader'
import RoleAddEditModel from './RoleAddEditModel'
import AppButton from '../../components/common/AppButton'

import {
  getAllRoles,
  createRole,
  updateRole,
  deleteRole,
  setRole,
} from '../../redux/slice/roleSlice'

function Roles() {
  const dispatch = useDispatch()
  const rolesData = useSelector((state) => state.roles?.result)
  const roles = rolesData || []

  const [visible, setVisible] = useState(false)
  const [activeColumn, setActiveColumn] = useState('')
  const [form, setForm] = useState({ id: 0, name: '' })

  useEffect(() => {
    dispatch(getAllRoles())
  }, [dispatch])

  const handleSave = () => {
    if (!form.roleName) return
    form.id === 0 ? dispatch(createRole(form)) : dispatch(updateRole(form))
    setVisible(false)
    setForm({ id: 0, roleName: '', description: '' })
  }

  return (
    <CRow>
      <CCol xs={12}>
        {/* Modern Shadow aur Border-radius ke sath card */}
        <CCard className="mb-4 shadow-sm border-0 overflow-hidden">
          <CCardBody className="p-0">
            {' '}
            {/* Padding 0 taake header color full width ho */}
            <div className="d-flex justify-content-between align-items-center p-4 bg-light border-bottom">
              <div>
                <h5 className="mb-1 fw-bold text-dark">User Roles</h5>
                <p className="text-muted small mb-0">Manage system access levels and permissions</p>
              </div>
              <div className="d-flex gap-2">
                <AppButton variant="outline" size="sm" data={roles} fileName="Roles_Report">
                  Export Excel
                </AppButton>
                <AppButton onClick={() => setVisible(true)}>+ Add New Role</AppButton>
              </div>
            </div>
            <CTable align="middle" className="mb-0 border-0" hover responsive>
              <CTableHead color="light">
                <CTableRow>
                  <CTableDataCell className="border-0 ps-4 py-3">
                    <TableHeader
                      col="Role Name"
                      activeColumn={activeColumn}
                      setActiveColumn={setActiveColumn}
                    />
                  </CTableDataCell>
                  <CTableDataCell className="border-0 py-3 text-muted fw-normal">
                    Description
                  </CTableDataCell>
                  <CTableDataCell className="border-0 py-3 text-end pe-4">Actions</CTableDataCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {roles?.map((t) => (
                  <CTableRow key={t.id} className="align-middle border-bottom-light">
                    {/* Role Name with Avatar Icon for Modern Look */}
                    <CTableDataCell className="ps-4 py-3">
                      <div className="d-flex align-items-center">
                        <CAvatar
                          color="primary"
                          textColor="white"
                          className="me-3 small text-uppercase"
                        >
                          {t.roleName.charAt(0)}
                        </CAvatar>
                        <div className="fw-semibold text-dark">{t.roleName}</div>
                      </div>
                    </CTableDataCell>

                    <CTableDataCell className="py-3 text-muted">
                      {t.description || (
                        <span className="text-opacity-25 opacity-50 italic">No description</span>
                      )}
                    </CTableDataCell>

                    <CTableDataCell className="text-end pe-4 py-3">
                      <div className="d-flex justify-content-end gap-1">
                        <AppButton
                          size="sm"
                          variant="ghost" // Less distracting buttons
                          onClick={() => {
                            setForm(t)
                            setVisible(true)
                          }}
                        >
                          <CIcon icon={cilPencil} className="text-primary" />
                        </AppButton>

                        <AppButton
                          size="sm"
                          variant="ghost"
                          onClick={() => dispatch(deleteRole(t.id))}
                        >
                          <CIcon icon={cilTrash} className="text-danger" />
                        </AppButton>

                        <AppButton size="sm" variant="ghost" onClick={() => dispatch(setRole(t))}>
                          <CIcon icon={cilCheckCircle} className="text-success" />
                        </AppButton>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>

      <RoleAddEditModel
        visible={visible}
        setVisible={setVisible}
        form={form}
        setForm={setForm}
        handleSave={handleSave}
      />
    </CRow>
  )
}

export default Roles
