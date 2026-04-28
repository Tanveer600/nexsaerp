import React from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CButton,
} from '@coreui/react'

import AppButton from '../../components/common/AppButton'

function TenantAddEditModal({ visible, setVisible, form, setForm, handleSave }) {
  return (
    <CModal visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader>
        <CModalTitle>Add / Edit User</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CFormInput
            className="mb-3"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </CForm>
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Cancel
        </CButton>

        <AppButton onClick={handleSave}>Save</AppButton>
      </CModalFooter>
    </CModal>
  )
}

export default TenantAddEditModal