import React, { useEffect, useRef, useMemo } from 'react'
import {
  CCard,
  CCardBody,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CRow,
  CCol,
  CForm,
  CFormInput,
  CContainer,
  CSpinner,
  CAvatar,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import { getProfile, getCompany, saveCompany, saveProfile } from '../../redux/slice/companySlice'
import AppButton from '../../components/common/AppButton'

const CompanySetting = () => {
  const dispatch = useDispatch()
  const { company, profile, isLoading } = useSelector((state) => state.companies)
  const fileInputRef = useRef(null)
  const [activeKey, setActiveKey] = React.useState(1)
  const BASE_URL = 'https://localhost:7016'

  // Fetch Data on Load
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user?.userId || user?.id) dispatch(getProfile(user.userId || user.id))
    if (user?.companyId) dispatch(getCompany(user.companyId))
  }, [dispatch])

  // --- PROFILE FORM (FORMIK) ---
  const profileForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: profile?.id || profile?.userId || 0,
      name: profile?.name || '',
      email: profile?.email || '',
      phoneNumber: profile?.phoneNumber || '',
      profilePictureUrl: profile?.profilePictureUrl || '',
      companyId: profile?.companyId || 0,
      imageFile: null, // For new upload
    },
    onSubmit: (values) => {
      const formData = new FormData()
      Object.keys(values).forEach((key) => {
        if (key === 'imageFile' && values[key]) {
          formData.append('ProfileImage', values[key])
        } else if (values[key] !== null) {
          formData.append(key.charAt(0).toUpperCase() + key.slice(1), values[key])
        }
      })
      dispatch(saveProfile(formData))
    },
  })

  // --- COMPANY FORM (FORMIK) ---
  const companyForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: company?.id || 0,
      tenantId: company?.tenantId || 0,
      companyName: company?.companyName || '',
      address: company?.address || '',
      phone: company?.phone || '',
    },
    onSubmit: (values) => {
      dispatch(
        saveCompany({
          Id: values.id,
          CompanyName: values.companyName,
          Address: values.address,
          TenantId: values.tenantId,
          Phone: values.phone,
        }),
      )
    },
  })

  // Memoized Avatar Logic
  const avatarImage = useMemo(() => {
    if (profileForm.values.imageFile) return URL.createObjectURL(profileForm.values.imageFile)
    if (profileForm.values.profilePictureUrl) {
      const path = profileForm.values.profilePictureUrl.startsWith('/')
        ? profileForm.values.profilePictureUrl
        : `/${profileForm.values.profilePictureUrl}`
      return `${BASE_URL}${path}`
    }
    return 'https://via.placeholder.com/150'
  }, [profileForm.values.imageFile, profileForm.values.profilePictureUrl])

  return (
    <CContainer fluid className="px-4 mt-2">
      <h4 className="fw-bold mb-4">Settings</h4>
      <CCard className="border-0 shadow-sm">
        <CCardBody className="p-0">
          <CRow className="g-0" style={{ minHeight: '500px' }}>
            {/* Sidebar */}
            <CCol md={3} className="border-end bg-light p-4 text-center">
              <CAvatar
                src={avatarImage}
                size="xl"
                className="mb-3"
                style={{ width: '120px', height: '120px', cursor: 'pointer' }}
                onClick={() => fileInputRef.current.click()}
              />
              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept="image/*"
                onChange={(e) => profileForm.setFieldValue('imageFile', e.target.files[0])}
              />
              <h6 className="fw-bold">{profileForm.values.name || 'User'}</h6>
              <CNav variant="pills" className="flex-column gap-2 mt-4 text-start">
                <CNavItem>
                  <CNavLink active={activeKey === 1} onClick={() => setActiveKey(1)}>
                    Profile
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink active={activeKey === 2} onClick={() => setActiveKey(2)}>
                    Company
                  </CNavLink>
                </CNavItem>
              </CNav>
            </CCol>

            {/* Form Content */}
            <CCol md={9} className="p-4">
              {isLoading ? (
                <div className="text-center py-5">
                  <CSpinner />
                </div>
              ) : (
                <CTabContent>
                  {/* Profile Tab */}
                  <CTabPane visible={activeKey === 1}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5>Profile</h5>
                      <AppButton onClick={profileForm.handleSubmit}>Update Profile</AppButton>
                    </div>
                    <CForm>
                      <CFormInput
                        label="Name"
                        name="name"
                        value={profileForm.values.name}
                        onChange={profileForm.handleChange}
                      />
                      <CFormInput
                        label="Email"
                        name="email"
                        value={profileForm.values.email}
                        onChange={profileForm.handleChange}
                      />
                    </CForm>
                  </CTabPane>

                  {/* Company Tab */}
                  <CTabPane visible={activeKey === 2}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5>Company Details</h5>
                      <AppButton onClick={companyForm.handleSubmit}>Save Company</AppButton>
                    </div>
                    <CForm>
                      <CFormInput
                        label="Company Name"
                        name="companyName"
                        value={companyForm.values.companyName}
                        onChange={companyForm.handleChange}
                      />
                      <CFormInput
                        label="Address"
                        name="address"
                        value={companyForm.values.address}
                        onChange={companyForm.handleChange}
                      />
                      <CFormInput
                        label="Phone"
                        name="phone"
                        value={companyForm.values.phone}
                        onChange={companyForm.handleChange}
                      />
                    </CForm>
                  </CTabPane>
                </CTabContent>
              )}
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default CompanySetting
