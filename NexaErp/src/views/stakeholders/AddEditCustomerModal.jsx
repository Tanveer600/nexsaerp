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

const AddEditCustomerModal = ({ visible, setVisible, form, setForm, handleSave }) => {
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
      backdrop="static" // User galti se bahar click karke modal band na kar de
    >
      <CModalHeader className="border-0 pb-0">
        <CModalTitle style={{ color: '#4c1d95', fontWeight: 'bold' }}>
          {form.id === 0 ? 'Create New Customer' : 'Edit Customer Profile'}
        </CModalTitle>
      </CModalHeader>

      <CModalBody className="py-4">
        <CRow className="g-3">
          {/* Row 1: Name and Phone */}
          <CCol md={6}>
            <CFormLabel className="fw-semibold small">Full Name / Company Name</CFormLabel>
            <CFormInput
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter customer name"
            />
          </CCol>
          <CCol md={6}>
            <CFormLabel className="fw-semibold small">Phone / Mobile</CFormLabel>
            <CFormInput
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+92 3XX XXXXXXX"
            />
          </CCol>

          {/* Row 2: Contact Person */}
          <CCol md={12}>
            <CFormLabel className="fw-semibold small">Contact Person / Department</CFormLabel>
            <CFormInput
              name="contact"
              value={form.contact}
              onChange={handleChange}
              placeholder="e.g. Finance Manager or Dept Name"
            />
          </CCol>
          <CCol md={12}>
            <CFormLabel className="fw-semibold small">Email</CFormLabel>
            <CFormInput
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="e.g. Finance Manager or Dept Name"
            />
          </CCol>
          {/* Row 3: Address */}
          <CCol md={12}>
            <CFormLabel className="fw-semibold small">Business Address</CFormLabel>
            <CFormInput
              component="textarea" // CoreUI auto textarea handles row expansion
              name="address"
              rows={3}
              value={form.address}
              onChange={handleChange}
              placeholder="Enter complete office/billing address"
              className="bg-light"
            />
          </CCol>
        </CRow>
      </CModalBody>

      <CModalFooter className="border-0 pt-0">
        <AppButton variant="secondary" onClick={() => setVisible(false)} className="px-4">
          Close
        </AppButton>
        <AppButton variant="purple" onClick={handleSave} className="px-4">
          {form.id === 0 ? 'Save Customer' : 'Update Changes'}
        </AppButton>
      </CModalFooter>
    </CModal>
  )
}

export default AddEditCustomerModal
