import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,
  CSpinner,
} from '@coreui/react'

// Redux Actions
import { getAllQuotations } from '../../redux/slice/quotationSlice'
import { getAllEmployees } from '../../redux/slice/employeeSlice'
import { getAllUsers } from '../../redux/slice/userSlice'
import { getAllProducts } from '../../redux/slice/productSlice'
import { getAllCustomers } from '../../redux/slice/customerSlice'

const Dashboard = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  // Dynamic Theme Color (Sidebar wala variable)
  const dynamicPrimary = 'var(--cui-primary)'

  // Selectors with Optional Chaining (To avoid crashes)
  const quotations = useSelector((state) => state.quotations?.result) || []
  const employees = useSelector((state) => state.employee?.result) || []
  const users = useSelector((state) => state.users?.result) || []
  const products = useSelector((state) => state.products?.result) || []
  const customers = useSelector((state) => state.customers?.result) || []

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      // 1. Kam az kam 3 second ka delay
      const timer = new Promise((resolve) => setTimeout(resolve, 3000))

      // 2. Parallel API Calls
      const dataFetch = Promise.all([
        dispatch(getAllQuotations({ page: 1, size: 5 })),
        dispatch(getAllEmployees({ page: 1, size: 100 })),
        dispatch(getAllUsers({ page: 1, size: 100 })),
        dispatch(getAllProducts({ page: 1, size: 100 })),
        dispatch(getAllCustomers({ page: 1, size: 100 })),
      ])

      // Wait for both timer and data
      await Promise.all([dataFetch, timer])
      setLoading(false)
    }

    fetchData()
  }, [dispatch])

  // --- LOADING UI (CENTRE SCREEN) ---
  if (loading) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: '75vh', width: '100%' }}
      >
        <div className="text-center p-5">
          <CSpinner
            style={{
              width: '4.5rem',
              height: '4.5rem',
              color: dynamicPrimary,
              borderWidth: '0.5rem',
            }}
            variant="grow"
          />
          <h3 className="mt-4 fw-bold" style={{ color: '#3c4b64', letterSpacing: '2px' }}>
            NEXA <span style={{ color: dynamicPrimary }}>ERP</span>
          </h3>
          <p className="text-muted fw-semibold animate__animated animate__pulse animate__infinite">
            Connecting to Nexa Secure Server...
          </p>
        </div>
      </div>
    )
  }

  // --- STAT CARD COMPONENT ---
  const CountCard = ({ title, count, subtitle }) => (
    <CCard className="mb-4 shadow-sm border-0 bg-white">
      <CCardBody
        className="p-4 text-center border-top border-4"
        style={{ borderColor: dynamicPrimary }}
      >
        <div className="text-muted text-uppercase fw-bold small mb-2">{title}</div>
        <div className="display-6 fw-bold" style={{ color: dynamicPrimary }}>
          {count}
        </div>
        <div className="small text-muted mt-2">{subtitle}</div>
      </CCardBody>
    </CCard>
  )

  return (
    <div className="animated fadeIn">
      {/* 4 Stats Cards */}
      <CRow>
        <CCol xs={12} sm={6} lg={3}>
          <CountCard title="Customers" count={customers.length} subtitle="Total Registered" />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CountCard title="Products" count={products.length} subtitle="Items in Stock" />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CountCard title="Workforce" count={employees.length} subtitle="Active Employees" />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CountCard title="System Users" count={users.length} subtitle="Active Accounts" />
        </CCol>
      </CRow>

      {/* Recent Quotations Table */}
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4 shadow-sm border-0 overflow-hidden">
            <CCardHeader
              className="fw-bold text-white border-0 py-3"
              style={{ backgroundColor: dynamicPrimary }}
            >
              <h5 className="mb-0">Recent Quotations</h5>
            </CCardHeader>
            <CCardBody className="p-0">
              <CTable align="middle" className="mb-0" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell className="ps-3 border-0">ID</CTableHeaderCell>
                    <CTableHeaderCell className="border-0">Customer</CTableHeaderCell>
                    <CTableHeaderCell className="text-center border-0">
                      Grand Total
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center border-0">Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {quotations.length > 0 ? (
                    quotations.slice(0, 5).map((item, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell className="ps-3 fw-bold text-muted small">
                          #{item.quotationId || item.id}
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="fw-semibold" style={{ color: dynamicPrimary }}>
                            {item.customerName || 'Walking Customer'}
                          </div>
                          <div className="small text-muted">
                            {item.quotationDate
                              ? new Date(item.quotationDate).toLocaleDateString()
                              : 'N/A'}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell className="text-center fw-bold">
                          {item.grandTotal?.toLocaleString() || 0}
                        </CTableDataCell>
                        <CTableDataCell className="text-center pe-3">
                          <CBadge
                            style={{
                              backgroundColor:
                                item.status === 'Ordered' ? '#2eb85c' : dynamicPrimary,
                            }}
                            shape="rounded-pill"
                            className="px-3 py-2"
                          >
                            {item.status || 'Pending'}
                          </CBadge>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="4" className="text-center py-5 text-muted">
                        No transactions found.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default Dashboard
