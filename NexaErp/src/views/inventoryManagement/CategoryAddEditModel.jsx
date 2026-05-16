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

const CategoryAddEditModel = ({ visible, setVisible, form, setForm, handleSave }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  return (
    <CModal
      visible={visible}
      onClose={() => setVisible(false)}
      size="md"
      alignment="center"
      backdrop="static"
    >
      <CModalHeader className="border-0 pb-0">
        <CModalTitle className="text-primary fw-bold">
          {form.id === 0 ? 'Create New Category' : 'Edit Category Details'}
        </CModalTitle>
      </CModalHeader>

      <CModalBody className="py-4">
        <CRow className="g-3">
          <CCol md={12}>
            <CFormLabel className="fw-semibold small">Category Name</CFormLabel>
            <CFormInput
              name="Name"
              value={form.Name || ''}
              onChange={handleChange}
              placeholder="Enter category name"
            />
          </CCol>

          <CCol md={12}>
            <CFormLabel className="fw-semibold small">Category Code</CFormLabel>
            <CFormInput
              name="Code"
              value={form.Code || ''}
              onChange={handleChange}
              placeholder="e.g. CAT-001"
            />
          </CCol>

          <CCol md={12} className="pt-2">
            <CFormSwitch
              label="Is Active"
              name="IsActive"
              checked={form.IsActive}
              onChange={handleChange}
              id="categoryActiveSwitch"
            />
          </CCol>
        </CRow>
      </CModalBody>

      <CModalFooter className="border-0 pt-0">
        <AppButton variant="secondary" onClick={() => setVisible(false)} className="px-4">
          Close
        </AppButton>
        <AppButton className="btn btn-primary px-4 text-white" onClick={handleSave}>
          {form.id === 0 ? 'Save Category' : 'Update Changes'}
        </AppButton>
      </CModalFooter>
    </CModal>
  )
}

export default CategoryAddEditModel
