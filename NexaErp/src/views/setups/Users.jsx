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
  CBadge,
} from '@coreui/react'
import { useToast } from '../../components/common/ToastContext'
import TableHeader from '../../components/common/TableHeader'
import UserAddEditModal from '../UserAddEditModal'
import AppButton from '../../components/common/AppButton'
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../../redux/slice/userSlice'
import { getAllTenants } from '../../redux/slice/tenantSlice'
import { getAllBranches } from '../../redux/slice/branchSlice'
import { getAllRoles } from '../../redux/slice/roleSlice'
import { getAllCompany } from '../../redux/slice/companySlice'
import { useAppLanguage } from "../../components/common/LanguageContext";
function Users() {
  const dispatch = useDispatch()
  const { addToast } = useToast()
  const { l} = useAppLanguage() // 2. Initialize translation

  // Selectors
  const usersData = useSelector((state) => state.users?.result)
  const roles = useSelector((state) => state.roles?.result || [])
  const branches = useSelector((state) => state.branches?.result || [])
  const allCompanies = useSelector((state) => state.companies?.companies || [])
  const tenants = useSelector((state) => state.tenants?.result || [])
  const users = usersData || []

  // States
  const [visible, setVisible] = useState(false)
  const [activeColumn, setActiveColumn] = useState('User Name')
  const [form, setForm] = useState({ id: 0, name: '' })

  useEffect(() => {
    dispatch(getAllUsers())
    dispatch(getAllRoles())
    dispatch(getAllBranches())
    dispatch(getAllTenants())
    dispatch(getAllCompany())
  }, [dispatch])

  const handleSave = (payload) => {
    if (!payload.Name) return

    if (payload.Id === 0) {
      dispatch(createUser(payload))
      addToast('Success', 'User created!', 'success')
    } else {
      dispatch(updateUser(payload))
      addToast('Success', 'User Updated!', 'success')
    }

    setVisible(false)
    setForm({ id: 0, name: '' })
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id))
      addToast('Deleted', 'User has been removed successfully.', 'error')
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard style={{ border: 'none' }}>
          <CCardBody>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                {/* 3. Title Translation */}
                <h4 className="mb-1">{l('user_management')}</h4> 
                <AppButton variant="golden" data={users} fileName="Users_Report" size="sm">
                  {l('download_xls', { defaultValue: 'download xls' })}
                </AppButton>
              </div>
              <AppButton onClick={() => setVisible(true)}>{l('add_new')}</AppButton>
            </div>

            <CTable responsive>
              <CTableHead>
                <CTableRow>


                  <TableHeader col={l('user name')} activeColumn={activeColumn} setActiveColumn={setActiveColumn} />
                  <TableHeader col={l('email')} activeColumn={activeColumn} setActiveColumn={setActiveColumn} />
                  <TableHeader col={l('phone')} activeColumn={activeColumn} setActiveColumn={setActiveColumn} />
                  <TableHeader col={l('status')} activeColumn={activeColumn} setActiveColumn={setActiveColumn} />
                  <TableHeader col={l('action')} activeColumn={activeColumn} setActiveColumn={setActiveColumn} />
                  
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {users?.map((u) => (
                  <CTableRow key={u.id}>
                    <CTableDataCell>{l(u.name)}</CTableDataCell>
                   <CTableDataCell>{l(u.email)}</CTableDataCell>
                    <CTableDataCell>{u.phoneNumber}</CTableDataCell>
                    <CTableDataCell>
                      {/* 4. Badge Status Translation */}
                      <CBadge color={u.status === 'Active' ? 'success' : 'danger'}>
                        {u.status === 'Active' ? l('active') : l('inactive')}
                      </CBadge>
                    </CTableDataCell>

                    <CTableDataCell className="text-end">
                      <AppButton
                        size="sm"
                        onClick={() => {
                          setForm({
                            ...u,
                            companyId: u.companyId ? Number(u.companyId) : '',
                            branchId: u.branchId ? Number(u.branchId) : '',
                            tenantId: u.tenantId ? Number(u.tenantId) : '',
                            roleId: u.roleId ? Number(u.roleId) : '',
                          })
                          setVisible(true)
                        }}
                      >
                        {l('edit')}
                      </AppButton>
                      <AppButton
                        size="sm"
                        color="danger"
                        className="ms-1"
                        onClick={() => handleDelete(u.id)}
                      >
                        {l('delete')}
                      </AppButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>

      <UserAddEditModal
        visible={visible}
        setVisible={setVisible}
        form={form}
        setForm={setForm}
        handleSave={handleSave}
        roles={roles}
        branches={branches}
        companies={allCompanies}
        tenants={tenants}
      />
    </CRow>
  )
}

export default Users