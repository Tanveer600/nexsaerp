import React from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormFloating,
  CFormLabel,
  CButton,
} from '@coreui/react'

import AppButton from '../../components/common/AppButton'

function RoleAddEditModel({ visible, setVisible, form, setForm, handleSave }) {
  return (
    <CModal
      visible={visible}
      onClose={() => setVisible(false)}
      alignment="center"
      backdrop="static" // Bahar click karne se band nahi hoga (Dubai apps standard)
    >
      <CModalHeader className="border-0 pb-0">
        <CModalTitle className="fw-bold px-2" style={{ fontSize: '1.2rem' }}>
          {form.id === 0 ? 'Add New Role' : 'Edit Role Info'}
        </CModalTitle>
      </CModalHeader>

      <CModalBody className="py-4 px-4">
        <CForm>
          {/* Floating Label: Role Name */}
          <CFormFloating className="mb-4">
            <CFormInput
              type="text"
              id="roleNameInput"
              placeholder="Role Name"
              className="custom-modern-input"
              value={form.roleName}
              onChange={(e) => setForm({ ...form, roleName: e.target.value })}
            />
            <CFormLabel htmlFor="roleNameInput" className="text-muted">
              Role Name
            </CFormLabel>
          </CFormFloating>

          {/* Floating Label: Description */}
          <CFormFloating>
            <CFormInput
              type="text"
              id="descInput"
              placeholder="Description"
              className="custom-modern-input"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <CFormLabel htmlFor="descInput" className="text-muted">
              Description
            </CFormLabel>
          </CFormFloating>
        </CForm>
      </CModalBody>

      <CModalFooter className="border-0 pt-0 px-4 pb-4">
        <CButton
          variant="ghost"
          color="secondary"
          className="fw-medium"
          onClick={() => setVisible(false)}
        >
          Cancel
        </CButton>
        <AppButton className="px-4" onClick={handleSave}>
          {form.id === 0 ? 'Create Role' : 'Update Role'}
        </AppButton>
      </CModalFooter>
    </CModal>
  )
}

export default RoleAddEditModel
