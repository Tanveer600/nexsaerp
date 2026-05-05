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
  CFormSelect,
  CButton,
  CRow,
  CCol,
} from '@coreui/react'
import AppButton from '../components/common/AppButton'
import ValidationError from '../components/common/ValidationError'
import { useAppLanguage } from "../components/common/LanguageContext";

function UserAddEditModal({
  visible,
  setVisible,
  form,
  handleSave, 
  roles = [],
  branches = [],
  companies = [],
  tenants = [],
}) {
  const { l } = useAppLanguage(); 
  const validationSchema = Yup.object({
    name: Yup.string().min(3, l('min_3_chars')).required(l('required_field')),
    userName: Yup.string().required(l('username_required')),
    email: Yup.string().email(l('invalid_email')).required(l('email_required')),
    roleId: Yup.string().required(l('role_required')),
    tenantId: Yup.string().required(l('tenant_required')),
    password: Yup.string().when('id', {
      is: 0,
      then: (schema) => schema.min(6, l('min_6_chars')).required(l('password_required')),
    }),
  })

  const formik = useFormik({
    initialValues: {
      id: form.id || 0,
      name: form.name || '',
      userName: form.userName || '',
      email: form.email || '',
      phoneNumber: form.phoneNumber || '',
      roleId: form.roleId || '',
      branchId: form.branchId || '',
      companyId: form.companyId || '',
      tenantId: form.tenantId || '',
      status: form.status || 'Active',
      password: '',
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const updatePayload = {
        Id: Number(values.id),
        Name: values.name,
        UserName: values.userName,
        Email: values.email,
        PhoneNumber: values.phoneNumber || '',
        RoleId: Number(values.roleId),
        BranchId: Number(values.branchId),
        CompanyId: Number(values.companyId),
        TenantId: Number(values.tenantId),
        Status: values.status || 'Active',
      }
      if (values.id === 0) updatePayload.Password = values.password
      handleSave(updatePayload)
    },
  })

  const getFieldStyle = (name) => {
    const hasError = formik.touched[name] && formik.errors[name];
    return {
      borderColor: hasError ? '#7c3aed' : '#dee2e6', 
      boxShadow: hasError ? '0 0 0 0.2rem rgba(124, 58, 237, 0.15)' : 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      borderRadius: '6px'
    }
  }

  return (
    <CModal visible={visible} onClose={() => setVisible(false)} backdrop="static" size="lg" alignment="center">
      <style>
        {`
          .custom-input:focus {
            border-color: #7c3aed !important;
            box-shadow: 0 0 0 0.2rem rgba(124, 58, 237, 0.15) !important;
            outline: 0 none !important;
          }
          .custom-input:hover { border-color: #b5b5b5; }
        `}
      </style>

      <CModalHeader className="border-0 pb-0">
        <CModalTitle className="fw-bold px-2" style={{ fontSize: '1.2rem' }}>
          {form.id === 0 ? l('add_new_user') : l('edit_user')}
        </CModalTitle>
      </CModalHeader>

      <CModalBody className="py-4 px-4">
        <CForm onSubmit={formik.handleSubmit}>
          <CRow>
            {/* Full Name */}
            <CCol md={6} className="mb-4">
              <CFormInput
                label={l('full_name')}
                name="name"
                className="custom-input"
                style={getFieldStyle('name')}
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <ValidationError message={formik.touched.name && formik.errors.name} />
            </CCol>

            {/* Username */}
            <CCol md={6} className="mb-4">
              <CFormInput
                label={l('user_name')}
                name="userName"
                className="custom-input"
                style={getFieldStyle('userName')}
                value={formik.values.userName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <ValidationError message={formik.touched.userName && formik.errors.userName} />
            </CCol>

            {/* Email */}
            <CCol md={6} className="mb-4">
              <CFormInput
                label={l('email')}
                type="email"
                name="email"
                className="custom-input"
                style={getFieldStyle('email')}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <ValidationError message={formik.touched.email && formik.errors.email} />
            </CCol>

            {/* Phone */}
            <CCol md={6} className="mb-4">
              <CFormInput 
                label={l('phone')} 
                name="phoneNumber" 
                className="custom-input"
                style={getFieldStyle('phoneNumber')}
                value={formik.values.phoneNumber} 
                onChange={formik.handleChange} 
              />
            </CCol>

            {/* Role */}
            <CCol md={6} className="mb-4">
              <CFormSelect
                label={l('role')}
                name="roleId"
                className="custom-input"
                style={getFieldStyle('roleId')}
                value={formik.values.roleId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">{l('select_role')}</option>
                {roles.map((r) => <option key={r.id} value={r.id}>{r.roleName}</option>)}
              </CFormSelect>
              <ValidationError message={formik.touched.roleId && formik.errors.roleId} />
            </CCol>

            {/* Branch */}
            <CCol md={6} className="mb-4">
              <CFormSelect label={l('branch')} name="branchId" className="custom-input" style={getFieldStyle('branchId')} value={formik.values.branchId} onChange={formik.handleChange}>
                <option value="">{l('select_branch')}</option>
                {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </CFormSelect>
            </CCol>

            {/* Company */}
            <CCol md={6} className="mb-4">
              <CFormSelect label={l('company')} name="companyId" className="custom-input" style={getFieldStyle('companyId')} value={formik.values.companyId} onChange={formik.handleChange}>
                <option value="">{l('select_company')}</option>
                {companies.map((c) => <option key={c.id} value={c.id}>{c.companyName || c.name}</option>)}
              </CFormSelect>
            </CCol>

            {/* Tenant */}
            <CCol md={6} className="mb-4">
              <CFormSelect
                label={l('tenant_name')}
                name="tenantId"
                className="custom-input"
                style={getFieldStyle('tenantId')}
                value={formik.values.tenantId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">{l('select_tenant')}</option>
                {tenants.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </CFormSelect>
              <ValidationError message={formik.touched.tenantId && formik.errors.tenantId} />
            </CCol>

            {/* Status */}
            <CCol md={6} className="mb-4">
              <CFormSelect label={l('status')} name="status" className="custom-input" style={getFieldStyle('status')} value={formik.values.status} onChange={formik.handleChange}>
                <option value="Active">{l('active')}</option>
                <option value="Inactive">{l('inactive')}</option>
              </CFormSelect>
            </CCol>

            {/* Password */}
            {formik.values.id === 0 && (
              <CCol md={6} className="mb-4">
                <CFormInput
                  label={l('password')}
                  type="password"
                  name="password"
                  className="custom-input"
                  style={getFieldStyle('password')}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <ValidationError message={formik.touched.password && formik.errors.password} />
              </CCol>
            )}
          </CRow>
        </CForm>
      </CModalBody>

      <CModalFooter className="border-0 pt-0 px-4 pb-4">
        <CButton variant="ghost" color="secondary" onClick={() => setVisible(false)}>
          {l('cancel')}
        </CButton>
        <AppButton className="px-4" onClick={formik.handleSubmit}>
          {form.id === 0 ? l('add_new') : l('save')}
        </AppButton>
      </CModalFooter>
    </CModal>
  )
}

export default UserAddEditModal