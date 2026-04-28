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

import TableHeader from '../../components/common/TableHeader'
import TenantAddEditModal from './TenantAddEditModel'
import AppButton from '../../components/common/AppButton'

import {
  getAllTenants,
  createTenant,
  updateTenant,
  deleteTenant,
  setTenant,
} from '../../redux/slice/tenantSlice'

function Tenants() {
  const dispatch = useDispatch()
  const tenantsData = useSelector((state) => state.tenants?.result)
  const tenants = tenantsData || []

  const [visible, setVisible] = useState(false)
  const [activeColumn, setActiveColumn] = useState('')
  const [form, setForm] = useState({ id: 0, name: '' })

  useEffect(() => {
    dispatch(getAllTenants())
  }, [dispatch])

  const handleSave = () => {
    if (!form.name) return

    if (form.id === 0) {
      dispatch(createTenant(form))
    } else {
      dispatch(updateTenant(form))
    }

    setVisible(false)
    setForm({ id: 0, name: '' })
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard style={{ border: 'none' }}>
          <CCardBody>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h4 className="mb-1">Tenants</h4>
                <AppButton variant="golden" data={tenants} fileName="Tenants_Report" size="sm">
                  Export to Excel
                </AppButton>
              </div>

              <AppButton onClick={() => setVisible(true)}>Add Tenant</AppButton>
            </div>

            <CTable responsive>
              <CTableHead>
                <CTableRow>
                  <TableHeader
                    col="Tenant Name"
                    activeColumn={activeColumn}
                    setActiveColumn={setActiveColumn}
                  />
                  <TableHeader col="Action" />
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {tenants?.map((t) => (
                  <CTableRow key={t.id}>
                    <CTableDataCell>{t.name}</CTableDataCell>

                    <CTableDataCell className="text-end">
                      <AppButton
                        size="sm"
                        onClick={() => {
                          setForm(t)
                          setVisible(true)
                        }}
                      >
                        Edit
                      </AppButton>

                      <AppButton
                        size="sm"
                        color="danger"
                        style={{ marginLeft: 5 }}
                        onClick={() => dispatch(deleteTenant(t.id))}
                      >
                        Delete
                      </AppButton>

                      <AppButton
                        size="sm"
                        style={{ marginLeft: 5 }}
                        onClick={() => dispatch(setTenant(t))}
                      >
                        Select
                      </AppButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>

      <TenantAddEditModal
        visible={visible}
        setVisible={setVisible}
        form={form}
        setForm={setForm}
        handleSave={handleSave}
      />
    </CRow>
  )
}

export default Tenants
