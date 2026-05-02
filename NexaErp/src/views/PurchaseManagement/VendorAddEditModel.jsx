import React from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CRow,
  CCol,
  CFormLabel,
  CFormTextarea,
} from '@coreui/react'
import AppButton from '../../components/common/AppButton'

const VendorAddEditModel = ({ visible, setVisible, form, setForm, handleSave }) => {
  // Handlers (Consistent with Permission Modal)
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: value,
    })
  }

  return (
    <CModal
      visible={visible}
      onClose={() => setVisible(false)}
      size="lg"
      alignment="center"
      backdrop="static"
    >
      <CModalHeader className="border-0 pb-0">
        <CModalTitle style={{ color: '#4c1d95', fontWeight: 'bold' }}>
          {form.id === 0 ? 'Create New Vendor' : 'Edit Vendor Details'}
        </CModalTitle>
      </CModalHeader>

      <CModalBody className="py-4">
        <CRow className="g-3">
          {/* Row 1: Name and Phone */}
          <CCol md={6}>
            <CFormLabel className="fw-semibold small"> Vendor Name</CFormLabel>
            <CFormInput
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter vendor name"
            />
          </CCol>
          <CCol md={6}>
            <CFormLabel className="fw-semibold small">Contact Person</CFormLabel>
            <CFormInput
              name="contact"
              value={form.contact}
              onChange={handleChange}
              placeholder="Enter contact person name"
            />
          </CCol>

          {/* Row 2: Address */}

          <CCol md={12}>
            <CFormLabel className="fw-semibold small">Address</CFormLabel>
            <CFormTextarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter vendor address"
            />
          </CCol>
        </CRow>
      </CModalBody>

      <CModalFooter className="border-0 pt-0">
        <AppButton variant="secondary" onClick={() => setVisible(false)} className="px-4">
          Close
        </AppButton>
        <AppButton variant="purple" onClick={handleSave} className="px-4">
          {form.id === 0 ? 'Save Vendor' : 'Update Changes'}
        </AppButton>
      </CModalFooter>
    </CModal>
  )
}

export default VendorAddEditModel
