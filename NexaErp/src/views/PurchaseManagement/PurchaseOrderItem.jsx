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

  // Delete Handler
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
      <CCol xs={12}>
        <CCard className="shadow-sm border-0">
          <CCardBody>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold" style={{ color: '#4c1d95' }}>
                Purchase Orders
              </h4>
              <AppButton
                variant="purple" // Using your professional purple gradient
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
                  <TableHeader col="ID" />
                  <TableHeader col="Vendor" />
                  <TableHeader col="Date" />
                  <TableHeader col="Status" />
                  <TableHeader col="Action" />
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {Array.isArray(orders) &&
                  orders.map((order) => {
                    const id = order.ID || order.id
                    const status = order.status || order.Status || 'Pending'

                    return (
                      <CTableRow key={id} className="align-middle">
                        <CTableDataCell className="fw-bold text-muted">
                          #{toNumber(id, 0)}
                        </CTableDataCell>
                        <CTableDataCell className="fw-semibold">
                          {order.vendorName || order.VendorName || 'N/A'}
                        </CTableDataCell>
                        <CTableDataCell>
                          {formatDate(order.orderDate || order.OrderDate)}
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
                                transition: '0.3s',
                                cursor: 'pointer',
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = '#dc2626'
                                e.currentTarget.style.color = '#fff'
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)'
                                e.currentTarget.style.color = '#dc2626'
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
