import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { CButton, CFormInput, CSpinner } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilHome } from '@coreui/icons'
import { useToast } from '../../../components/common/ToastContext'
import {
  resetError,
  resetPasswordRequest,
  clearPasswordStatus,
} from '../../../redux/slice/userSlice'
import '../../../scss/Login.scss' // Same styling use hogi

const ResetPassword = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { addToast } = useToast()

  const { isLoading, error, passwordResetStatus } = useSelector((state) => state.users)

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  })

  // URL se token aur email nikalne ke liye
  const queryParams = new URLSearchParams(location.search)
  const token = queryParams.get('token')
  const email = queryParams.get('email')

  useEffect(() => {
    if (error) {
      addToast('Error', error, 'error')
      dispatch(resetError())
    }
  }, [error, dispatch, addToast])

  // Password successfully reset hone par
  useEffect(() => {
    if (passwordResetStatus?.resetSuccessful) {
      addToast('Success', 'Password has been reset successfully. Please login.', 'success')
      dispatch(clearPasswordStatus())
      navigate('/login')
    }
  }, [passwordResetStatus?.resetSuccessful, navigate, dispatch, addToast])

  const handleResetSubmit = () => {
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      addToast('Required', 'Please fill all fields', 'warning')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast('Mismatch', 'Passwords do not match', 'error')
      return
    }

    if (!token || !email) {
      addToast('Invalid Link', 'Reset token or email is missing.', 'error')
      return
    }

    // Backend payload ke mutabiq dispatch
    dispatch(
      resetPasswordRequest({
        email: email,
        token: token,
        newPassword: passwordData.newPassword,
      }),
    )
  }

  return (
    <div className="login-container">
      <div className="login-card-group">
        <div className="form-section">
          <h1>New Password</h1>
          <p className="text-muted small mb-4">Set a strong password for your account</p>

          <div className="standard-input-group">
            <div className="input-group-text">
              <CIcon icon={cilLockLocked} />
            </div>
            <CFormInput
              type="password"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            />
          </div>

          <div className="standard-input-group">
            <div className="input-group-text">
              <CIcon icon={cilLockLocked} />
            </div>
            <CFormInput
              type="password"
              placeholder="Confirm New Password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, confirmPassword: e.target.value })
              }
              onKeyDown={(e) => e.key === 'Enter' && handleResetSubmit()}
            />
          </div>

          <CButton
            className="btn-access w-100 mt-3"
            onClick={handleResetSubmit}
            disabled={isLoading}
          >
            {isLoading ? <CSpinner size="sm" /> : 'UPDATE PASSWORD'}
          </CButton>
        </div>

        {/* Right Side Banner (Same as Login) */}
        <div className="banner-section">
          <div className="icon-circle">
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

export default ResetPasswords
