import React from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CFormCheck,
  CRow,
  CCol,
} from '@coreui/react'
import AppButton from '../../components/common/AppButton'

const AddEditPermissionModal = ({ visible, setVisible, form, setForm, handleSave }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  return (
    <CModal visible={visible} onClose={() => setVisible(false)} size="lg" alignment="center">
      <CModalHeader>
        <CModalTitle style={{ color: '#4c1d95', fontWeight: 'bold' }}>
          {form.id === 0 ? 'Add Permission' : 'Update Permission'}
        </CModalTitle>
      </CModalHeader>

      <CModalBody>
        <CRow className="g-3">
          <CCol md={6}>
            <label className="fw-semibold small">Permission Name</label>
            <CFormInput
              name="permissionName"
              value={form.permissionName}
              onChange={handleChange}
              placeholder="e.g. Sales_View"
            />
          </CCol>
          <CCol md={6}>
            <label className="fw-semibold small">Description</label>
            <CFormInput
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter details"
            />
          </CCol>

          <CCol xs={12} className="mt-4">
            <div className="p-3 bg-light rounded border d-flex gap-4">
              <CFormCheck
                name="canView"
                label="View"
                checked={form.canView}
                onChange={handleChange}
              />
              <CFormCheck name="canAdd" label="Add" checked={form.canAdd} onChange={handleChange} />
              <CFormCheck
                name="canUpdate"
                label="Update"
                checked={form.canUpdate}
                onChange={handleChange}
              />
              <CFormCheck
                name="canDelete"
                label="Delete"
                checked={form.canDelete}
                onChange={handleChange}
              />
            </div>
          </CCol>
        </CRow>
      </CModalBody>

      <CModalFooter>
        <AppButton variant="golden" onClick={() => setVisible(false)}>
          Cancel
        </AppButton>
        <AppButton variant="purple" onClick={handleSave}>
          {form.id === 0 ? 'Save' : 'Update'}
        </AppButton>
      </CModalFooter>
    </CModal>
  )
}

export default AddEditPermissionModal
