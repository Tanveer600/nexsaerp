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

const AddEditEmployeeModal = ({ visible, setVisible, form, setForm, handleSave }) => {
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
          {form.id === 0 ? 'Create New Employee' : 'Edit Employee Profile'}
        </CModalTitle>
      </CModalHeader>

      <CModalBody className="py-4">
        <CRow className="g-3">
          {/* Row 1: Name and Salary */}
          <CCol md={6}>
            <CFormLabel className="fw-semibold small">Full Name / Company Name</CFormLabel>
            <CFormInput
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter employee name"
            />
          </CCol>
          <CCol md={6}>
            <CFormLabel className="fw-semibold small">Salary</CFormLabel>
            <CFormInput
              name="salary"
              value={form.salary}
              onChange={handleChange}
              placeholder="employee salary"
            />
          </CCol>

          {/* Row 2: Documents */}

          <CCol md={12}>
            <CFormLabel className="fw-semibold small">Documents</CFormLabel>
            <CFormInput
              type="file"
    name="documents"
    onChange={(e) => {
      const file = e.target.files[0]
      setForm({
        ...form,
        documents: file ? file.name : '',
     })
    }}
            />
          </CCol>        
        </CRow>
      </CModalBody>

      <CModalFooter className="border-0 pt-0">
        <AppButton variant="secondary" onClick={() => setVisible(false)} className="px-4">
          Close
        </AppButton>
        <AppButton variant="purple" onClick={handleSave} className="px-4">
          {form.id === 0 ? 'Save Employee' : 'Update Changes'}
        </AppButton>
      </CModalFooter>
    </CModal>
  )
}

export default AddEditEmployeeModal
