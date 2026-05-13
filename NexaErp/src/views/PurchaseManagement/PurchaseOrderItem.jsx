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
  CWidgetStatsC,
} from '@coreui/react'
import TableHeader from '../../components/common/TableHeader'
import AppButton from '../../components/common/AppButton'
import { useToast } from '../../components/common/ToastContext'
import PurchaseOrderModal from './PurchaseOrderModal'
import {
  getAllPurchaseOrderItems,
  deletePurchaseOrderItem,
} from '../../redux/slice/purchaseOrdertemSlice'
import { toNumber, formatDate } from '../../components/common/formatter'

const EditIcon = () => <span style={{ marginRight: '5px' }}>✎</span>
const DeleteIcon = () => <span style={{ marginRight: '5px' }}>🗑</span>

function PurchaseOrderItem() {
  const dispatch = useDispatch()
  const { result: orders } = useSelector((state) => state.purchaseOrderItems)
  const [visible, setVisible] = useState(false)
  const [editData, setEditData] = useState(null)
  const { addToast } = useToast()

  useEffect(() => {
    dispatch(getAllPurchaseOrderItems({ page: 1, size: 10 }))
  }, [dispatch])

  const totals = Array.isArray(orders)
    ? orders.reduce(
        (acc, curr) => ({
          amount: acc.amount + (curr.totalAmount || 0),
          tax: acc.tax + (curr.totalTax || 0),
          discount: acc.discount + (curr.totalDiscount || 0),
        }),
        { amount: 0, tax: 0, discount: 0 },
      )
    : { amount: 0, tax: 0, discount: 0 }

  const handleDelete = (id) => {
    if (
      addToast('Are you sure you want to delete this order?', 'warning', { yes: 'Yes', no: 'No' })
    ) {
      dispatch(deletePurchaseOrderItem(id)).then(() => {
        addToast('Success', 'Order deleted successfully', 'success')
        dispatch(getAllPurchaseOrderItems({ page: 1, size: 10 }))
      })
    }
  }

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'ordered':
        return 'success'
      case 'pending':
        return 'warning'
      case 'cancelled':
        return 'danger'
      default:
        return 'secondary'
    }
  }

  return (
    <CRow>
      <CCol sm={6} lg={4}>
        <CWidgetStatsC
          className="mb-3 border-0 shadow-sm"
          icon={<span style={{ fontSize: '20px' }}>💰</span>}
          color="primary"
          inverse
          padding={false}
          title="Gross Amount"
          value={`${toNumber(totals.amount)} PKR`}
          style={{ background: 'linear-gradient(45deg, #4c1d95 0%, #7c3aed 100%)' }}
        />
      </CCol>
      <CCol sm={6} lg={4}>
        <CWidgetStatsC
          className="mb-3 border-0 shadow-sm text-white"
          icon={<span style={{ fontSize: '20px' }}>📑</span>}
          color="danger"
          inverse
          padding={false}
          title="Total Tax"
          value={`${toNumber(totals.tax)} PKR`}
          style={{ background: 'linear-gradient(45deg, #dc2626 0%, #f87171 100%)' }}
        />
      </CCol>
      <CCol sm={6} lg={4}>
        <CWidgetStatsC
          className="mb-3 border-0 shadow-sm text-white"
          icon={<span style={{ fontSize: '20px' }}>📉</span>}
          color="success"
          inverse
          padding={false}
          title="Total Discount"
          value={`${toNumber(totals.discount)} PKR`}
          style={{ background: 'linear-gradient(45deg, #059669 0%, #34d399 100%)' }}
        />
      </CCol>

      <CCol xs={12}>
        <CCard className="shadow-sm border-0">
          <CCardBody>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold" style={{ color: '#4c1d95' }}>
                Purchase Orders
              </h4>
              <AppButton
                variant="purple"
                onClick={() => {
                  setEditData(null)
                  setVisible(true)
                }}
              >
                + Create Order
              </AppButton>
            </div>

            <CTable responsive hover align="middle" className="border-top">
              <CTableHead color="light">
                <CTableRow>
                  <TableHeader col="PO Number" />
                  <TableHeader col="Vendor" />
                  <TableHeader col="Date" />
                  <TableHeader col="Amount" />
                  <TableHeader col="Status" />
                  <TableHeader col="Action" />
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {Array.isArray(orders) &&
                  orders.map((order) => {
                    const id = order.id || order.ID
                    const status = order.status || 'Pending'

                    return (
                      <CTableRow key={id}>
                        <CTableDataCell className="fw-bold text-muted">
                          {order.poNumber}
                        </CTableDataCell>
                        <CTableDataCell className="fw-semibold">{order.vendorName}</CTableDataCell>
                        <CTableDataCell>{formatDate(order.orderDate)}</CTableDataCell>
                        <CTableDataCell className="fw-bold">
                          {toNumber(order.totalAmount)} {order.currencyCode}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge
                            color={getStatusBadge(status)}
                            shape="rounded-pill"
                            className="px-3 py-2"
                          >
                            {status}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex gap-2">
                            <AppButton
                              size="sm"
                              variant="golden"
                              onClick={() => {
                                setEditData(order)
                                setVisible(true)
                              }}
                            >
                              <EditIcon /> Edit
                            </AppButton>

                            <button
                              onClick={() => handleDelete(id)}
                              style={{
                                background: 'rgba(220, 38, 38, 0.1)',
                                color: '#dc2626',
                                border: '1px solid #dc2626',
                                borderRadius: '8px',
                                padding: '4px 12px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                              }}
                            >
                              <DeleteIcon /> Delete
                            </button>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    )
                  })}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
      <PurchaseOrderModal visible={visible} setVisible={setVisible} editData={editData} />
    </CRow>
  )
}

export default PurchaseOrderItem
