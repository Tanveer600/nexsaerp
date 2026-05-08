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
  CFormSwitch,
} from '@coreui/react'
import AppButton from '../../components/common/AppButton'

const ProductAddEditModelForm = ({ visible, setVisible, form, setForm, handleSave }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value,
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
          <CCol md={6}>
            <CFormLabel className="fw-semibold small">Product Name</CFormLabel>
            <CFormInput
              name="Name"
              value={form.Name || ''}
              onChange={handleChange}
              placeholder="Enter product name"
            />
          </CCol>
          <CCol md={6}>
            <CFormLabel className="fw-semibold small">SKU</CFormLabel>
            <CFormInput
              name="SKU"
              value={form.SKU || ''}
              onChange={handleChange}
              placeholder="e.g. PROD-001"
            />
          </CCol>

          <CCol md={6}>
            <CFormLabel className="fw-semibold small">Category ID</CFormLabel>
            <CFormInput
              type="number"
              name="CategoryId"
              value={form.CategoryId || 0}
              onChange={handleChange}
            />
          </CCol>
          <CCol md={6}>
            <CFormLabel className="fw-semibold small">Barcode</CFormLabel>
            <CFormInput name="Barcode" value={form.Barcode || ''} onChange={handleChange} />
          </CCol>

          <CCol md={6}>
            <CFormLabel className="fw-semibold small">Unit Price</CFormLabel>
            <CFormInput
              type="number"
              name="UnitPrice"
              value={form.UnitPrice || 0}
              onChange={handleChange}
            />
          </CCol>
          <CCol md={6}>
            <CFormLabel className="fw-semibold small">VAT (%)</CFormLabel>
            <CFormInput
              type="number"
              name="VatPercentage"
              value={form.VatPercentage || 0}
              onChange={handleChange}
            />
          </CCol>

          <CCol md={4}>
            <CFormLabel className="fw-semibold small">UOM</CFormLabel>
            <CFormInput name="UOM" value={form.UOM || ''} onChange={handleChange} />
          </CCol>
          <CCol md={4}>
            <CFormLabel className="fw-semibold small">Reorder Level</CFormLabel>
            <CFormInput
              type="number"
              name="ReorderLevel"
              value={form.ReorderLevel || 0}
              onChange={handleChange}
            />
          </CCol>
          <CCol md={4} className="d-flex align-items-end pb-2">
            <CFormSwitch
              label="Manage Stock"
              name="ManageStock"
              checked={form.ManageStock}
              onChange={handleChange}
            />
          </CCol>

          <CCol md={12}>
            <CFormLabel className="fw-semibold small">Description</CFormLabel>
            <CFormInput name="Description" value={form.Description || ''} onChange={handleChange} />
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
