import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react'
import { useToast } from '../../components/common/ToastContext'
import { useAppLanguage } from '../../components/common/LanguageContext'
import TableHeader from '../../components/common/TableHeader'
import AppButton from '../../components/common/AppButton'
import AppPagination from '../../components/common/AppPagination'
import AddEditCustomerModal from './AddEditCustomerModal'

// CSS imports
import '../../scss/permissingSetting.scss'
import '../../scss/pagination.scss'

import {
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
  createCustomer,
} from '../../redux/slice/customerSlice'

function Customers() {
  const dispatch = useDispatch()
  const { addToast } = useToast() // Toast initialization
  const { l } = useAppLanguage() // Translation initialization

  const customersData = useSelector((state) => state.customers?.result) || []
  const totalCount = useSelector((state) => state.customers?.totalCount) || 0
  console.log('Customers Data from Redux:', customersData)
  // States
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [activeColumn, setActiveColumn] = useState(l('name')) // Underline state
  const [visible, setVisible] = useState(false)
  const [form, setForm] = useState({
    id: 0,
    name: '',
    address: '',
    phone: '',
    email: '',
  })
  const gridLayout = {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1.8fr 1fr 1.5fr 0.5fr',
    alignItems: 'center',
  }

  useEffect(() => {
    dispatch(getAllCustomers({ page: currentPage, size: pageSize }))
  }, [dispatch, currentPage, pageSize])
  const totalPages = Math.ceil(totalCount / pageSize)
  const currentCustomers = customersData
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [totalPages])
  const handleSave = () => {
    if (!form.name) return
    if (form.id === 0) {
      dispatch(createCustomer(form))
      addToast(l('success'), l('customer created successfully'), 'success')
    } else {
      dispatch(updateCustomer(form))
      addToast(l('success'), l('customer updated successfully'), 'success')
    }
    setVisible(false)
    resetForm()
  }

  const handleDelete = (id) => {
    if (window.confirm(l('are you sure you want to delete this customer?'))) {
      dispatch(deleteCustomer(id))
      addToast(l('deleted'), l('customer deleted successfully'), 'error')
    }
  }

  const resetForm = () => {
    setForm({ id: 0, name: '', address: '', phone: '', email: '' })
  }
  return (
    <div className="user-container px-3">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
        <div>
          <h4 className="mb-0 text-dark fw-semibold">{l('customer_management')}</h4>
          <small className="text-muted">Home | {l('customers')}</small>
          <div className="mt-1">
            <AppButton variant="golden" data={customersData} fileName="Customer_Report" size="sm">
              {l('download_xls')}
            </AppButton>
          </div>
        </div>
        <AppButton
          onClick={() => {
            resetForm()
            setVisible(true)
          }}
        >
          {l('add_new')}
        </AppButton>
      </div>

      {/* Table Header with Underline Logic */}
      <div className="table-header px-4 d-none d-md-grid text-muted small mb-1" style={gridLayout}>
        <TableHeader
          col={l('name')}
          activeColumn={activeColumn}
          setActiveColumn={setActiveColumn}
        />
        <TableHeader
          col={l('email')}
          activeColumn={activeColumn}
          setActiveColumn={setActiveColumn}
        />
        <TableHeader
          col={l('phone')}
          activeColumn={activeColumn}
          setActiveColumn={setActiveColumn}
        />
        <TableHeader
          col={l('address')}
          activeColumn={activeColumn}
          setActiveColumn={setActiveColumn}
        />
        <TableHeader
          col={l('action')}
          activeColumn={activeColumn}
          setActiveColumn={setActiveColumn}
        />
      </div>

      {/* Customer List */}
      <div className="customer-list">
        {currentCustomers.length > 0 ? (
          currentCustomers.map((c) => (
            <div
              key={c.id}
              className="user-card px-4 py-2 mb-1 bg-white border rounded shadow-sm"
              style={gridLayout}
            >
              <span className="text-dark fw-bold">{c.name}</span>
              <span>
                <a
                  href={`mailto:${c.email}`}
                  className="text-decoration-none"
                  style={{ color: '#3498db' }}
                >
                  {c.email || '---'}
                </a>
              </span>
              <span className="text-muted small">{c.phone || '---'}</span>
              <span className="text-muted small text-truncate pe-2">{c.address || '---'}</span>

              <div className="text-end">
                <CDropdown variant="btn-group">
                  <CDropdownToggle color="white" className="p-0 border-0 shadow-none" caret={false}>
                    <div style={{ cursor: 'pointer', fontSize: '20px', color: '#666' }}>⋮</div>
                  </CDropdownToggle>
                  <CDropdownMenu className="border-0 shadow-sm">
                    <CDropdownItem
                      onClick={() => {
                        setForm(c)
                        setVisible(true)
                      }}
                    >
                      {l('edit')}
                    </CDropdownItem>
                    <CDropdownItem className="text-danger" onClick={() => handleDelete(c.id)}>
                      {l('delete')}
                    </CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-4 bg-white border rounded">
            <p className="text-muted mb-0">{l('no_records_found')}</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-1">
        <AppPagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      <AddEditCustomerModal
        visible={visible}
        setVisible={setVisible}
        form={form}
        setForm={setForm}
        handleSave={handleSave}
      />
    </div>
  )
}

export default Customers
