import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilUser,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilAccountLogout,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { AppSidebarNav } from './AppSidebarNav'
import { logo } from 'src/assets/brand/logo'
import { sygnet } from 'src/assets/brand/sygnet'
import navigation from '../_nav'
import { useNavigate } from 'react-router-dom'
import { getPermissionsByRole } from '../redux/slice/roleMenuPermissionSlice'
import { setSidebarShow } from 'src/redux/slice/sidebarSlice'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const userMenus = useSelector((state) => state.roleMenuPermissions.rolePermissions)
  console.log('>>> AppSidebar: Fetched role Menus from Redux:', userMenus)
  const menus = Array.isArray(userMenus)
    ? userMenus
    : Array.isArray(userMenus?.data)
      ? userMenus.data
      : []
  //console.log('>>> AppSidebar Rendered with rolemenu:', menus)
  const sidebarShow = useSelector((state) => state.ui.sidebarShow)
  const unfoldable = useSelector((state) => state.ui.sidebarUnfoldable)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    const roleId = user?.roleId

    if (roleId) {
      dispatch(getPermissionsByRole(roleId))
    }
  }, [dispatch])
  return (
    <CSidebar
      className="border-end"
      colorScheme="light"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch(setSidebarShow(visible)) // ✅ FIXED
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} />
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />
        </CSidebarBrand>

        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch(setSidebarShow(false))} // ✅ FIXED
        />
      </CSidebarHeader>

      <AppSidebarNav items={navigation} />

      <CSidebarFooter className="border-top d-flex justify-content-center p-2">
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => {
            dispatch({ type: 'users/logout' })
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            navigate('/login', { replace: true })
          }}
          className="d-flex align-items-center gap-2 text-dark"
        >
          <CIcon icon={cilAccountLogout} />
          <span>Logout</span>
        </div>
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
