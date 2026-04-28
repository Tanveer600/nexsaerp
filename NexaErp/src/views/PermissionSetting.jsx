import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CFormCheck,
  CButton,
  CRow,
  CCol,
  CFormInput,
  CFormLabel,
} from '@coreui/react'
import '../scss/permissingSetting.scss'
const PermissionSetting = () => {
  const [activeTab, setActiveTab] = useState(1)

  return (
    <CCard className="mb-4 modern-settings-card">
      <CCardHeader className="bg-white py-3">
        <strong className="fs-5">Add Role</strong>
      </CCardHeader>
      <CCardBody>
        {/* Tab Navigation */}
        <CNav variant="tabs" className="custom-settings-nav mb-4">
          <CNavItem>
            <CNavLink
              style={{ cursor: 'pointer' }}
              active={activeTab === 1}
              onClick={() => setActiveTab(1)}
            >
              Details
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              style={{ cursor: 'pointer' }}
              active={activeTab === 2}
              onClick={() => setActiveTab(2)}
            >
              Permissions
            </CNavLink>
          </CNavItem>
        </CNav>

        <CTabContent>
          {/* Tab 1: Role Details */}
          <CTabPane visible={activeTab === 1} className="py-3">
            <CRow className="g-3">
              <CCol md={6}>
                <CFormLabel>Role Name</CFormLabel>
                <CFormInput placeholder="e.g. Administrator" />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Display Name</CFormLabel>
                <CFormInput placeholder="Admin" />
              </CCol>
              <CCol md={12}>
                <CFormCheck label="System Role" id="systemRole" />
              </CCol>
            </CRow>
          </CTabPane>

          {/* Tab 2: Permissions Grid */}
          <CTabPane visible={activeTab === 2} className="py-3">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <CFormCheck label="Select All" id="selectAll" className="fw-bold custom-checkbox" />
              <CButton className="btn-save-purple px-5">Save Changes</CButton>
            </div>

            {/* Scrollable container to prevent page overflow */}
            <div className="permissions-scroll-area">
              <CRow className="row-cols-1 row-cols-md-3 g-2">
                {/* Example Items - Aap inko backend data se map() kar sakte hain */}
                <CCol>
                  <CFormCheck className="custom-checkbox" label="[Create account screens]" />
                </CCol>
                <CCol>
                  <CCol>
                    <CFormCheck className="custom-checkbox" label="[Dashboard]" />
                  </CCol>
                </CCol>
                <CCol>
                  <CFormCheck className="custom-checkbox" label="[Delete account screens]" />
                </CCol>
                <CCol>
                  <CFormCheck className="custom-checkbox" label="Account Ledger Report" />
                </CCol>
                <CCol>
                  <CFormCheck className="custom-checkbox" label="Account Management" />
                </CCol>
                <CCol>
                  <CFormCheck className="custom-checkbox" label="Account Closings" />
                </CCol>
                <CCol>
                  <CFormCheck className="custom-checkbox" label="Account Payments" />
                </CCol>
                <CCol>
                  <CFormCheck className="custom-checkbox" label="Account Screens" />
                </CCol>
                <CCol>
                  <CFormCheck className="custom-checkbox" label="Advance Payments" />
                </CCol>
                {/* Add more as needed */}
              </CRow>
            </div>
          </CTabPane>
        </CTabContent>
      </CCardBody>
    </CCard>
  )
}

export default PermissionSetting
