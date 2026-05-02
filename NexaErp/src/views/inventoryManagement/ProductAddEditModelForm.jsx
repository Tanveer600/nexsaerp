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

const ProductAddEditModelForm = ({ visible, setVisible, form, setForm, handleSave }) => {
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
          {form.id === 0 ? 'Create New Product' : 'Edit Product Details'}
        </CModalTitle>
      </CModalHeader>

      <CModalBody className="py-4">
        <CRow className="g-3">
          {/* Row 1: Name and Phone */}
          <CCol md={6}>
            <CFormLabel className="fw-semibold small"> Product Name</CFormLabel>
            <CFormInput
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter product name"
            />
          </CCol>
          <CCol md={6}>
            <CFormLabel className="fw-semibold small">Description</CFormLabel>
            <CFormInput
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter product description"
            />
          </CCol>

          {/* Row 2: Contact Person */}

          <CCol md={12}>
            <CFormLabel className="fw-semibold small">Unit Price</CFormLabel>
            <CFormInput
              name="unitPrice"
              value={form.unitPrice}
              onChange={handleChange}
              placeholder="e.g. 100.00"
            />
          </CCol>
        </CRow>
      </CModalBody>

      <CModalFooter className="border-0 pt-0">
        <AppButton variant="secondary" onClick={() => setVisible(false)} className="px-4">
          Close
        </AppButton>
        <AppButton variant="purple" onClick={handleSave} className="px-4">
          {form.id === 0 ? 'Save Product' : 'Update Changes'}
        </AppButton>
      </CModalFooter>
    </CModal>
  )
}

export default ProductAddEditModelForm
