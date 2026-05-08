import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CButton, CFormInput, CSpinner } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilHome, cilChevronBottom, cilArrowLeft } from '@coreui/icons'
import { useToast } from '../../../components/common/ToastContext'
import { getAllTenants } from '../../../redux/slice/tenantSlice'
import {
  resetError,
  forgotPasswordRequest,
  clearPasswordStatus,
  resetPasswordRequest,
  resetPasswordFailure,
  resetPasswordSuccess,
} from '../../../redux/slice/userSlice'
import '../../../scss/Login.scss'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { addToast } = useToast()

  // Dynamic Theme Variable
  const dynamicPrimary = 'var(--cui-primary)'

  const tenants = useSelector((state) => state.tenants?.result || [])
  const { isLoading, currentUser, error, passwordResetStatus } = useSelector((state) => state.users)

  const [isForgotMode, setIsForgotMode] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState({ id: 0, name: 'Select Tenant / Company' })
  const [loginData, setLoginData] = useState({ email: '', password: '', tenantId: 0 })

  useEffect(() => {
    dispatch(getAllTenants())
  }, [dispatch])

  useEffect(() => {
    if (currentUser) {
      addToast('Success', 'Welcome to NexaErp!', 'success')
      navigate('/dashboard')
    }
  }, [currentUser, navigate, addToast])

  useEffect(() => {
    if (error) {
      addToast('Error', error, 'error')
      dispatch(resetError())
    }
  }, [error, dispatch, addToast])

  useEffect(() => {
    if (passwordResetStatus?.forgotEmailSent) {
      addToast('Sent', 'Password reset link has been sent to your email.', 'success')
      dispatch(clearPasswordStatus())
      setIsForgotMode(false)
    }
  }, [passwordResetStatus?.forgotEmailSent, dispatch, addToast])

  const handleLogin = () => {
    if (loginData.tenantId === 0) {
      addToast('Required', 'Please select a company first', 'warning')
      return
    }
    if (!loginData.email || !loginData.password) {
      addToast('Required', 'Please enter email and password', 'warning')
      return
    }
    dispatch({ type: 'users/loginUser', payload: loginData })
  }

  const handleForgotSubmit = () => {
    if (loginData.tenantId === 0) {
      addToast('Required', 'Please select a company first', 'warning')
      return
    }
    if (!loginData.email) {
      addToast('Required', 'Please enter your email address', 'warning')
      return
    }
    dispatch(forgotPasswordRequest({ email: loginData.email, tenantId: loginData.tenantId }))
  }

  return (
    <div className="login-container">
      <div className="login-card-group">
        <div className="form-section">
          {!isForgotMode ? (
            <>
              {/* Heading Color Link */}
              <h1 style={{ color: dynamicPrimary }}>Welcome to Nexa</h1>
              <p className="text-muted small mb-4">Enter credentials to access account</p>

              <div className="custom-select-wrapper">
                <div className="input-group-custom" onClick={() => setIsOpen(!isOpen)}>
                  <div className="input-group-text" style={{ color: dynamicPrimary }}>
                    <CIcon icon={cilHome} />
                  </div>
                  <div className="selected-value">
                    {selectedTenant.name}
                    <CIcon icon={cilChevronBottom} size="sm" />
                  </div>
                </div>
                {isOpen && (
                  <ul className="custom-options-list">
                    {tenants.map((t) => (
                      <li
                        key={t.id}
                        onClick={() => {
                          setSelectedTenant({ id: t.id, name: t.name })
                          setLoginData({ ...loginData, tenantId: t.id })
                          setIsOpen(false)
                        }}
                      >
                        {t.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="standard-input-group">
                <div className="input-group-text" style={{ color: dynamicPrimary }}>
                  <CIcon icon={cilUser} />
                </div>
                <CFormInput
                  placeholder="Email Address"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>

              <div className="standard-input-group">
                <div className="input-group-text" style={{ color: dynamicPrimary }}>
                  <CIcon icon={cilLockLocked} />
                </div>
                <CFormInput
                  type="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>

              <div className="text-end mb-3">
                <button
                  className="btn btn-link p-0 text-decoration-none small"
                  onClick={() => setIsForgotMode(true)}
                  style={{ color: '#6c757d' }}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Button Background Link */}
              <CButton
                className="btn-access w-100"
                onClick={handleLogin}
                disabled={isLoading}
                style={{ backgroundColor: dynamicPrimary, borderColor: dynamicPrimary }}
              >
                {isLoading ? <CSpinner size="sm" /> : 'ACCESS ACCOUNT'}
              </CButton>
            </>
          ) : (
            <>
              <div className="d-flex align-items-center mb-3">
                <button className="btn btn-link p-0 me-2" onClick={() => setIsForgotMode(false)}>
                  <CIcon icon={cilArrowLeft} style={{ color: dynamicPrimary }} />
                </button>
                <h2 className="mb-0 h4" style={{ color: dynamicPrimary }}>
                  Reset Password
                </h2>
              </div>
              <p className="text-muted small mb-4">We'll send a reset link to your email</p>

              <div className="custom-select-wrapper">
                <div className="input-group-custom" onClick={() => setIsOpen(!isOpen)}>
                  <div className="input-group-text" style={{ color: dynamicPrimary }}>
                    <CIcon icon={cilHome} />
                  </div>
                  <div className="selected-value">
                    {selectedTenant.name}
                    <CIcon icon={cilChevronBottom} size="sm" />
                  </div>
                </div>
                {isOpen && (
                  <ul className="custom-options-list">
                    {tenants.map((t) => (
                      <li
                        key={t.id}
                        onClick={() => {
                          setSelectedTenant({ id: t.id, name: t.name })
                          setLoginData({ ...loginData, tenantId: t.id })
                          setIsOpen(false)
                        }}
                      >
                        {t.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="standard-input-group">
                <div className="input-group-text" style={{ color: dynamicPrimary }}>
                  <CIcon icon={cilUser} />
                </div>
                <CFormInput
                  placeholder="Enter Registered Email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                />
              </div>

              <CButton
                className="btn-access w-100 mt-3"
                onClick={handleForgotSubmit}
                disabled={isLoading}
                style={{ backgroundColor: dynamicPrimary, borderColor: dynamicPrimary }}
              >
                {isLoading ? <CSpinner size="sm" /> : 'SEND RESET LINK'}
              </CButton>
            </>
          )}
        </div>

        {/* Banner Section Background Link */}
        <div className="banner-section" style={{ backgroundColor: dynamicPrimary }}>
          <div className="icon-circle" style={{ color: dynamicPrimary }}>
            <CIcon icon={cilHome} size="xl" />
          </div>
          <h2 className="fw-bold">NexaErp</h2>
          <p className="small opacity-75 px-4">Professional Cloud ERP Management.</p>
          <div className="footer-credits">
            <p className="mb-0 opacity-50">Product by Rana Tanveer & Sidra Tahir</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
