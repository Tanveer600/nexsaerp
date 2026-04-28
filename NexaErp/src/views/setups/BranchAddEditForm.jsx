import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CRow,
  CCol,
  CFormCheck,
  CFormSelect,
} from '@coreui/react'
import AppButton from '../../components/common/AppButton'
import ValidationError from '../../components/common/ValidationError'
import { useDispatch } from 'react-redux'
import { createBranch, updateBranch } from '../../redux/slice/branchSlice'

function BranchAddEditForm({ visible, setVisible, form, branches }) {
  const dispatch = useDispatch()

  const validationSchema = Yup.object({
    name: Yup.string().required('Branch name is required'),
    code: Yup.string().required('Code is required'),
    city: Yup.string().required('City is required'),
  })

  const formik = useFormik({
    initialValues: {
      id: form.id || 0,
      name: form.name || '',
      code: form.code || '',
      street: form.street || '',
      city: form.city || '',
      emirate: form.emirate || '',
      contactPerson: form.contactPerson || '',
      phone: form.phone || '',
      address: form.address || '',
      employeeCount: form.employeeCount || 0,
      parentBranchId: form.parentBranchId || '',
      isDefault: form.isDefault || false,
      isActive: form.isActive ?? true,
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // Yahan logic change ki hai:
      // Agar parentBranchId khali ("") hai, to usay null set kar rahe hain
      const finalValues = {
        ...values,
        parentBranchId: values.parentBranchId === '' ? null : parseInt(values.parentBranchId),
      }

      if (finalValues.id === 0) {
        dispatch(createBranch(finalValues))
      } else {
        dispatch(updateBranch(finalValues))
      }
      setVisible(false)
    },
  })

  const getFieldStyle = (name) => ({
    borderColor: formik.touched[name] && formik.errors[name] ? '#7c3aed' : '#dee2e6',
    borderRadius: '8px',
  })

  return (
    <CModal
      visible={visible}
      onClose={() => setVisible(false)}
      size="lg"
      alignment="center"
      backdrop="static"
    >
      <CModalHeader className="border-0 pb-0">
        <CModalTitle className="fw-bold">
          {form.id === 0 ? 'Add New Branch' : 'Edit Branch'}
        </CModalTitle>
      </CModalHeader>
      <CModalBody className="py-4">
        <CForm onSubmit={formik.handleSubmit}>
          <CRow>
            <CCol md={6} className="mb-3">
              <CFormInput
                label="Branch Code"
                name="code"
                style={getFieldStyle('code')}
                value={formik.values.code}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <ValidationError message={formik.touched.code && formik.errors.code} />
            </CCol>
            <CCol md={6} className="mb-3">
              <CFormInput
                label="Branch Name"
                name="name"
                style={getFieldStyle('name')}
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <ValidationError message={formik.touched.name && formik.errors.name} />
            </CCol>
            <CCol md={6} className="mb-3">
              <CFormInput
                label="City"
                name="city"
                style={getFieldStyle('city')}
                value={formik.values.city}
                onChange={formik.handleChange}
              />
            </CCol>
            <CCol md={6} className="mb-3">
              <CFormInput
                label="Phone"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
              />
            </CCol>
            <CCol md={12} className="mb-3">
              <CFormInput
                label="Full Address"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
              />
            </CCol>
            <CCol md={6} className="mb-3">
              <CFormSelect
                label="Parent Branch"
                name="parentBranchId"
                value={formik.values.parentBranchId}
                onChange={formik.handleChange}
              >
                <option value="">None</option>
                {branches
                  .filter((b) => b.id !== form.id)
                  .map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
              </CFormSelect>
            </CCol>
            <CCol md={3} className="d-flex align-items-end mb-4">
              <CFormCheck
                label="Default"
                name="isDefault"
                checked={formik.values.isDefault}
                onChange={formik.handleChange}
              />
            </CCol>
            <CCol md={3} className="d-flex align-items-end mb-4">
              <CFormCheck
                label="Active"
                name="isActive"
                checked={formik.values.isActive}
                onChange={formik.handleChange}
              />
            </CCol>
          </CRow>
        </CForm>
      </CModalBody>
      <CModalFooter className="border-0 pt-0">
        <AppButton variant="ghost" color="secondary" onClick={() => setVisible(false)}>
          Cancel
        </AppButton>
        <AppButton className="px-4" onClick={formik.handleSubmit}>
          {form.id === 0 ? 'Create' : 'Save Changes'}
        </AppButton>
      </CModalFooter>
    </CModal>
  )
}

export default BranchAddEditForm
