import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CBadge } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilCloudDownload } from '@coreui/icons'
import { useToast } from '../../components/common/ToastContext'
import { useAppLanguage } from '../../components/common/LanguageContext'
import TableHeader from '../../components/common/TableHeader'
import AppButton from '../../components/common/AppButton'
import AppPagination from '../../components/common/AppPagination'
import PaymentAddEditModel from './PaymentAddEditModel'

import '../../scss/permissingSetting.scss'
import '../../scss/pagination.scss'

import {
  getAllPayments,
  updatePayment,
  deletePayment,
  createPayment,
} from '../../redux/slice/paymentSlice'

function Payment() {
  const dispatch = useDispatch()
  const { addToast } = useToast()
  const { l } = useAppLanguage()

  const paymentsData = useSelector((state) => state.payment?.result) || []
  const totalCount = useSelector((state) => state.payment?.totalCount) || 0

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [activeColumn, setActiveColumn] = useState(l('Date'))
  const [visible, setVisible] = useState(false)

  const [form, setForm] = useState({
    id: 0,
    Amount: '',
    Mode: 0,
    Date: '',
    Status: '',
    InvoiceId: '',
  })

  const gridLayout = {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1.2fr 1fr 1fr 1.2fr 0.5fr',
    alignItems: 'center',
    gap: '15px',
  }

  useEffect(() => {
    dispatch(getAllPayments({ page: currentPage, size: pageSize }))
  }, [dispatch, currentPage, pageSize])

  const totalPages = Math.ceil(totalCount / pageSize)

  const handleSave = (formattedValues) => {
    if (!formattedValues.Amount) {
      addToast(l('error'), 'Amount is required', 'danger')
      return
    }

    if (formattedValues.id === 0) {
      dispatch(createPayment(formattedValues))
      addToast(l('success'), l('payment_created'), 'success')
    } else {
      dispatch(updatePayment(formattedValues))
      addToast(l('success'), l('payment_updated'), 'success')
    }
    setVisible(false)
    resetForm()
  }

  const handleDelete = (id) => {
    if (window.confirm(l('are you sure you want to delete?'))) {
      dispatch(deletePayment(id))
      addToast(l('deleted'), l('payment deleted'), 'error')
    }
  }

  const resetForm = () =>
    setForm({
      id: 0,
      Amount: '',
      Mode: 0,
      Date: '',
      Status: '',
      InvoiceId: '',
    })

  const getStatusBadgeColor = (status) => {
    const s = status?.toLowerCase()
    if (s === 'paid' || s === 'success' || s === 'completed')
      return { bg: '#e8f5e9', text: '#2eb85c', border: 'rgba(46, 184, 92, 0.25)' }
    if (s === 'pending' || s === 'processing')
      return { bg: '#fff8e1', text: '#f9b115', border: 'rgba(249, 177, 21, 0.25)' }
    return { bg: '#ffebee', text: '#e55353', border: 'rgba(229, 83, 83, 0.25)' }
  }

  return (
    <div className="product-page-container px-3 py-2">
      <div className="d-flex justify-content-between align-items-end mb-4 bg-white p-3 rounded shadow-sm border-top border-warning border-4">
        <div>
          <h4 className="mb-1 text-dark fw-bold" style={{ letterSpacing: '-0.5px' }}>
            {l('Payment Management')}
          </h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb small mb-2">
              <li className="breadcrumb-item text-muted">{l('Home')}</li>
              <li className="breadcrumb-item active text-warning fw-semibold">{l('Payments')}</li>
            </ol>
          </nav>

          <AppButton
            variant="outline-dark"
            data={paymentsData}
            fileName="Payment_Report"
            size="sm"
            className="me-2 shadow-sm d-inline-flex align-items-center gap-2"
          >
            <CIcon icon={cilCloudDownload} size="sm" />
            <span className="small">{l('download_xls')}</span>
          </AppButton>
        </div>
        <AppButton
          className="shadow-sm px-4 py-2 fw-bold"
          style={{ backgroundColor: '#802060', border: 'none' }}
          onClick={() => {
            resetForm()
            setVisible(true)
          }}
        >
          + {l('add_new')}
        </AppButton>
      </div>

      <div
        className="table-header px-4 py-2 d-none d-md-grid text-uppercase fw-bold text-secondary border-bottom mb-2 bg-light rounded"
        style={gridLayout}
      >
        <TableHeader
          col={l('Date')}
          activeColumn={activeColumn}
          setActiveColumn={setActiveColumn}
        />
        <TableHeader
          col={l('Amount')}
          activeColumn={activeColumn}
          setActiveColumn={setActiveColumn}
        />
        <TableHeader
          col={l('Mode')}
          activeColumn={activeColumn}
          setActiveColumn={setActiveColumn}
        />
        <TableHeader
          col={l('Status')}
          activeColumn={activeColumn}
          setActiveColumn={setActiveColumn}
        />
        <TableHeader
          col={l('Invoice Reference')}
          activeColumn={activeColumn}
          setActiveColumn={setActiveColumn}
        />
        <TableHeader
          col={l('action')}
          activeColumn={activeColumn}
          setActiveColumn={setActiveColumn}
          className="text-end"
        />
      </div>

      {/* Rows Grid */}
      <div className="product-list">
        {paymentsData.length > 0 ? (
          paymentsData.map((p) => {
            const badgeStyle = getStatusBadgeColor(p.Status || p.status)
            return (
              <div
                key={p.id}
                className="product-row px-4 py-3 mb-2 bg-white border rounded shadow-sm align-items-center"
                style={{ ...gridLayout, transition: '0.3s ease-in-out' }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'white')}
              >
                <div>
                  <span className="text-dark fw-bold d-block">
                    {p.Date || p.date ? new Date(p.Date || p.date).toLocaleDateString() : '---'}
                  </span>
                </div>

                <div>
                  <span className="text-dark fw-bold" style={{ color: '#802060' }}>
                    AED{' '}
                    {Number(p.Amount || p.amount || 0).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <div>
                  <span className="badge bg-secondary-opacity text-secondary fw-semibold px-2 py-1 bg-light border rounded small">
                    {p.Mode || p.mode || 'Cash'}
                  </span>
                </div>

                <div>
                  <CBadge
                    className="p-2 px-3 border"
                    style={{
                      backgroundColor: badgeStyle.bg,
                      color: badgeStyle.text,
                      borderColor: badgeStyle.border,
                    }}
                  >
                    {p.Status || p.status || 'Pending'}
                  </CBadge>
                </div>

                <div>
                  <span className="fw-semibold text-muted small">
                    #{p.InvoiceId || p.invoiceId || 'N/A'}
                  </span>
                </div>

                <div className="text-end">
                  <CDropdown variant="btn-group">
                    <CDropdownToggle
                      color="light"
                      className="p-1 border-0 shadow-none"
                      caret={false}
                    >
                      <div style={{ cursor: 'pointer', fontSize: '18px', color: '#999' }}>⋮</div>
                    </CDropdownToggle>
                    <CDropdownMenu className="border-0 shadow">
                      <CDropdownItem
                        className="py-2 d-flex align-items-center gap-2"
                        onClick={() => {
                          setForm({
                            ...p,
                            Date: p.date || p.Date,
                            Amount: p.amount || p.Amount,
                            Mode: p.mode || p.Mode,
                            Status: p.status || p.Status,
                            InvoiceId: p.invoiceId || p.InvoiceId,
                          })
                          setVisible(true)
                        }}
                      >
                        <CIcon icon={cilPencil} size="sm" />
                        <span>{l('edit')}</span>
                      </CDropdownItem>
                      <CDropdownItem
                        className="text-danger py-2 border-top d-flex align-items-center gap-2"
                        onClick={() => handleDelete(p.id)}
                      >
                        <CIcon icon={cilTrash} size="sm" className="text-danger" />
                        <span>{l('delete')}</span>
                      </CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center p-5 bg-white border rounded shadow-sm">
            <h5 className="text-muted">{l('no_records_found')}</h5>
          </div>
        )}
      </div>

      <div className="mt-1">
        <AppPagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      <PaymentAddEditModel
        visible={visible}
        setVisible={setVisible}
        form={form}
        handleSave={handleSave}
      />
    </div>
  )
}

export default Payment
