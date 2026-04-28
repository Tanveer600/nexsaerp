import React from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormSelect,
  CButton,
} from '@coreui/react'
import AppButton from '../../components/common/AppButton'

function MenuAddEditModal({ visible, setVisible, form, setForm, handleSave, parentMenus }) {
  return (
    <CModal visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader>
        <CModalTitle>{form.id ? 'Edit Menu' : 'Add New Menu'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CFormInput
            className="mb-3"
            label="Menu Title"
            placeholder="e.g. Dashboard"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <CFormInput
            className="mb-3"
            label="URL Path"
            placeholder="e.g. /dashboard"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
          />
          <CFormInput
            className="mb-3"
            label="Icon (CoreUI/FontAwesome)"
            placeholder="e.g. cil-home"
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
          />
          <CFormSelect
            className="mb-3"
            label="Parent Menu"
            value={form.parentId || ''}
            onChange={(e) => setForm({ ...form, parentId: e.target.value || null })}
          >
            <option value="">No Parent (Top Level)</option>
            {parentMenus?.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </CFormSelect>
        </CForm>
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Cancel
        </CButton>
        <AppButton onClick={handleSave}>Save Changes</AppButton>
      </CModalFooter>
    </CModal>
  )
}

export default MenuAddEditModal
