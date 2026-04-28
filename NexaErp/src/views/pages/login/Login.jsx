import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CButton, CFormInput, CSpinner } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilHome, cilChevronBottom } from '@coreui/icons'
import { useToast } from '../../../components/common/ToastContext'
import { getAllTenants } from '../../../redux/slice/tenantSlice'
import { resetError } from '../../../redux/slice/userSlice' //
import '../../../scss/Login.scss'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { addToast } = useToast()

  const tenants = useSelector((state) => state.tenants?.result || [])
  const { isLoading, currentUser, error } = useSelector((state) => state.users) //

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
      addToast('Login Failed', error, 'error')
      dispatch(resetError())
    }
  }, [error, dispatch, addToast])

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

  return (
    <div className="login-container">
      <div className="login-card-group">
        <div className="form-section">
          <h1>Welcome to Nexa</h1>
          <p className="text-muted small mb-4">Enter credentials to access account</p>

          {/* Custom Dropdown */}
          <div className="custom-select-wrapper">
            <div className="input-group-custom" onClick={() => setIsOpen(!isOpen)}>
              <div className="input-group-text">
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
            <div className="input-group-text">
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
            <div className="input-group-text">
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

          <CButton
            className="btn-access w-100"
            onClick={handleLogin}
            disabled={isLoading}
            style={{ position: 'relative', zIndex: 5 }}
          >
            {isLoading ? <CSpinner size="sm" /> : 'ACCESS ACCOUNT'}
          </CButton>
        </div>

        <div className="banner-section">
          <div className="icon-circle">
            <CIcon icon={cilHome} size="xl" />
          </div>
          <h2 className="fw-bold">NexaErp</h2>
          <p className="small opacity-75 px-4">Professional Cloud ERP Management.</p>
          <div className="footer-credits">
            <p className="mb-0 opacity-50">Product by</p>
            <p className="mb-0 opacity-50">Rana Tanveer & Sidra Tahir</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
