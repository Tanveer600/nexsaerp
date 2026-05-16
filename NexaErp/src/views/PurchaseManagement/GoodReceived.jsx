import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CTable,
  CSpinner,
  CTableHead,
  CTableRow,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import { Truck, Plus, FileText, Trash2 } from 'lucide-react'
import { useToast } from '../../components/common/ToastContext'
import { useAppLanguage } from '../../components/common/LanguageContext'
import TableHeader from '../../components/common/TableHeader'
import AppButton from '../../components/common/AppButton'
import { getPurchaseList } from '../../redux/slice/purchaseOrdertemSlice'
import {
  getAllGoodReceiveds,
  createGoodReceived,
  deleteGoodReceived,
} from '../../redux/slice/goodReceivedSlice'
import GoodReceivedAddEditModel from './GoodReceivedAddEditModel'

function GoodReceived() {
  const dispatch = useDispatch()
  const { addToast } = useToast()
  const { l } = useAppLanguage()

  const goodReceivesData = useSelector((state) => state.goodReceives?.result || [])
  const isLoading = useSelector((state) => state.goodReceives?.isLoading)

  const [visible, setVisible] = useState(false)
  const [activeColumn, setActiveColumn] = useState('receivedDate')
  const [form, setForm] = useState({ id: 0, purchaseOrderId: '', remarks: '', items: [] })

  useEffect(() => {
    dispatch(getAllGoodReceiveds({ page: 1, size: 10 }))
  }, [dispatch])

  const handleSave = async (payload) => {
    try {
      dispatch(createGoodReceived(payload))

      setTimeout(() => {
        dispatch(getPurchaseList())
        dispatch(getAllGoodReceiveds({ page: 1, size: 10 }))
        addToast('Success', 'Good Received Processed!', 'success')
      }, 500)
      setVisible(false)
    } catch (error) {
      console.error('Save Error:', error)
    }
  }

  // Safe date rendering helper function
  const renderDate = (dateString) => {
    if (!dateString) return '-'
    const parsedDate = new Date(dateString)
    return isNaN(parsedDate.getTime()) ? dateString : parsedDate.toLocaleDateString()
  }

  return (
    <div className="delivery-page">
      <CRow className="mb-4">
        <CCol md={4}>
          <CCard className="border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="p-1" style={{ backgroundColor: 'var(--cui-primary)' }}></div>
            <CCardBody className="d-flex align-items-center p-4">
              <div
                className="rounded-3 p-3 me-3"
                style={{
                  backgroundColor: 'rgba(var(--cui-primary-rgb), 0.1)',
                  color: 'var(--cui-primary)',
                }}
              >
                <Truck size={28} />
              </div>
              <div>
                <h6 className="text-muted mb-0">{l('total_good_received')}</h6>
                <h3 className="fw-bold mb-0">{goodReceivesData.length}</h3>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12}>
          <CCard className="border-0 shadow-sm rounded-4 overflow-hidden">
            <CCardBody className="p-4 position-relative">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold mb-1" style={{ color: 'var(--cui-primary)' }}>
                    {l('Good Received Management')}
                  </h4>
                  <span className="text-muted small">Manage all warehouse stock receipts</span>
                </div>
                <div className="d-flex gap-2">
                  <AppButton
                    variant="golden"
                    data={goodReceivesData}
                    fileName="GRN_Report"
                    size="sm"
                  >
                    {l('download_xls')}
                  </AppButton>

                  <AppButton
                    style={{
                      backgroundColor: 'var(--cui-primary)',
                      borderColor: 'var(--cui-primary)',
                    }}
                    className="shadow-sm px-3 fw-bold text-white"
                    onClick={() => {
                      setForm({ id: 0, purchaseOrderId: '', remarks: '', items: [] })
                      setVisible(true)
                    }}
                  >
                    <Plus size={18} className="me-1" /> {l('add_new_receipt')}
                  </AppButton>
                </div>
              </div>

              <div className="table-responsive" style={{ minHeight: '150px' }}>
                {isLoading && (
                  <div
                    className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center bg-white opacity-75"
                    style={{ zIndex: 10, top: 0, left: 0 }}
                  >
                    <CSpinner color="primary" />
                  </div>
                )}

                <CTable hover align="middle" className="mb-0 border-top">
                  <CTableHead style={{ backgroundColor: 'var(--cui-light)' }}>
                    <CTableRow>
                      <TableHeader
                        col={l('po_number')}
                        activeColumn={activeColumn}
                        setActiveColumn={setActiveColumn}
                      />
                      <TableHeader
                        col={l('received_date')}
                        activeColumn={activeColumn}
                        setActiveColumn={setActiveColumn}
                      />
                      <TableHeader
                        col={l('remarks')}
                        activeColumn={activeColumn}
                        setActiveColumn={setActiveColumn}
                      />
                      <th className="text-end pe-4 text-muted small uppercase fw-bold border-0">
                        {l('action')}
                      </th>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {goodReceivesData.length > 0
                      ? goodReceivesData.map((item) => (
                          <CTableRow key={item.id} className="border-bottom">
                            <CTableDataCell>
                              <div className="d-flex align-items-center">
                                <div
                                  className="p-2 rounded-circle me-3"
                                  style={{ backgroundColor: 'var(--cui-light)' }}
                                >
                                  <FileText size={14} className="text-muted" />
                                </div>
                                <span className="fw-bold" style={{ color: 'var(--cui-primary)' }}>
                                  {/* DTO/Model properties binding fix for PO Number */}
                                  PO-{item.poId || item.purchaseOrderId || item.po?.id || item.id}
                                </span>
                              </div>
                            </CTableDataCell>
                            <CTableDataCell className="text-muted fw-medium">
                              {/* DTO/Model properties binding fix for Date */}
                              {renderDate(item.date || item.receivedDate)}
                            </CTableDataCell>
                            <CTableDataCell>
                              <span className="text-muted small">{item.remarks || '-'}</span>
                            </CTableDataCell>
                            <CTableDataCell className="text-end pe-4">
                              <button
                                className="btn btn-link text-danger p-0"
                                onClick={() => dispatch(deleteGoodReceived(item.id))}
                              >
                                <Trash2 size={18} />
                              </button>
                            </CTableDataCell>
                          </CTableRow>
                        ))
                      : !isLoading && (
                          <CTableRow>
                            <CTableDataCell colSpan={4} className="text-center py-4 text-muted">
                              {l('no_data_found')}
                            </CTableDataCell>
                          </CTableRow>
                        )}
                  </CTableBody>
                </CTable>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <GoodReceivedAddEditModel visible={visible} setVisible={setVisible} handleSave={handleSave} />
    </div>
  )
}

export default GoodReceived
