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
import { getSaleList } from '../../redux/slice/saleSlice'
import {
  getAllDeliveryNotes,
  createDeliveryNote,
  deleteDeliveryNote,
} from '../../redux/slice/deliveryNotesSlice'
import DeliveryNoteAddModal from './DeliveryNoteAddModal'

function DeliveryNotes() {
  const dispatch = useDispatch()
  const { addToast } = useToast()
  const { l } = useAppLanguage()

  const deliveryData = useSelector((state) => state.deliveryNotes?.result || [])
  const isLoading = useSelector((state) => state.deliveryNotes?.isLoading)

  const [visible, setVisible] = useState(false)
  const [activeColumn, setActiveColumn] = useState('Delivery Date')
  const [form, setForm] = useState({ id: 0, saleOrderId: '', remarks: '', items: [] })

  useEffect(() => {
    dispatch(getAllDeliveryNotes({ page: 1, size: 10 }))
  }, [dispatch])

  const handleSave = async (payload) => {
    try {
      dispatch(createDeliveryNote(payload))
      setTimeout(() => {
        dispatch(getSaleList())
        dispatch(getAllDeliveryNotes({ page: 1, size: 10 }))
        addToast('Success', 'Delivery Note Processed!', 'success')
      }, 500)

      setVisible(false)
    } catch (error) {
      console.error('Save Error:', error)
    }
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
                <h6 className="text-muted mb-0">{l('total_deliveries')}</h6>
                <h3 className="fw-bold mb-0">{deliveryData.length}</h3>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12}>
          <CCard className="border-0 shadow-sm rounded-4 overflow-hidden">
            <CCardBody className="p-4 position-relative">
              {/* Toolbar */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold mb-1" style={{ color: 'var(--cui-primary)' }}>
                    {l('Delivery Note Management')}
                  </h4>
                  <span className="text-muted small">Manage all warehouse dispatches</span>
                </div>
                <div className="d-flex gap-2">
                  <AppButton
                    variant="golden"
                    data={deliveryData}
                    fileName="Delivery_Note_Report"
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
                      setForm({ id: 0, items: [] })
                      setVisible(true)
                    }}
                  >
                    <Plus size={18} className="me-1" /> {l('add_new_delivery')}
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
                        col={l('so_number')}
                        activeColumn={activeColumn}
                        setActiveColumn={setActiveColumn}
                      />
                      <TableHeader
                        col={l('delivery_date')}
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
                    {deliveryData.length > 0
                      ? deliveryData.map((item) => (
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
                                  SO-{item.saleOrderId}
                                </span>
                              </div>
                            </CTableDataCell>
                            <CTableDataCell className="text-muted fw-medium">
                              {new Date(item.deliveryDate).toLocaleDateString()}
                            </CTableDataCell>
                            <CTableDataCell>
                              <span className="text-muted small">{item.remarks || '-'}</span>
                            </CTableDataCell>
                            <CTableDataCell className="text-end pe-4">
                              <button
                                className="btn btn-link text-danger p-0"
                                onClick={() => dispatch(deleteDeliveryNote(item.id))}
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

      <DeliveryNoteAddModal
        visible={visible}
        setVisible={setVisible}
        handleSave={handleSave}
        form={form}
      />
    </div>
  )
}

export default DeliveryNotes
