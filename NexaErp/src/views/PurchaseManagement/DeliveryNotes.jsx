import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import { Truck, Plus, FileText, Trash2, Download } from 'lucide-react'
import { useToast } from '../../components/common/ToastContext'
import { useAppLanguage } from '../../components/common/LanguageContext'
import TableHeader from '../../components/common/TableHeader'
import AppButton from '../../components/common/AppButton'
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

  const deliveryData = useSelector((state) => state.DeliveryNotes?.result || [])
  const [visible, setVisible] = useState(false)
  const [activeColumn, setActiveColumn] = useState('Delivery Date')
  const [form, setForm] = useState({ id: 0, saleOrderId: '', remarks: '', items: [] })

  useEffect(() => {
    dispatch(getAllDeliveryNotes({ page: 1, size: 10 }))
  }, [dispatch])

  const handleSave = (payload) => {
    console.info('deliverdata', payload)
    dispatch(createDeliveryNote(payload))
    addToast('Success', 'Delivery Note Processed!', 'success')
    setVisible(false)
  }

  return (
    <div className="delivery-page">
      {/* Top Stat Bar */}
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
            <CCardBody className="p-4">
              {/* Toolbar */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold mb-1" style={{ color: 'var(--cui-primary)' }}>
                    {l('Delivery Note Management')}
                  </h4>
                  <span className="text-muted small">Manage all warehouse dispatches</span>
                </div>
                <div className="d-flex gap-2">
                  <AppButton variant="ghost" className="border">
                    <Download size={16} className="me-2" /> {l('export')}
                  </AppButton>
                  <AppButton
                    color="primary"
                    className="shadow-sm px-3 fw-bold"
                    onClick={() => {
                      setForm({ id: 0, items: [] })
                      setVisible(true)
                    }}
                  >
                    <Plus size={18} className="me-1" /> {l('add_new_delivery')}
                  </AppButton>
                </div>
              </div>

              {/* Data Table */}
              <div className="table-responsive">
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
                    {deliveryData.map((item) => (
                      <CTableRow key={item.id} className="border-bottom">
                        <CTableDataCell>
                          <div className="d-flex align-items-center">
                            <div
                              className="p-2 rounded-circle me-3"
                              style={{ backgroundColor: 'var(--cui-light)' }}
                            >
                              <FileText size={14} className="text-muted" />
                            </div>
                            <span className="fw-bold">SO-{item.saleOrderId}</span>
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
                    ))}
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
