export const API_ENDPOINTS = {
  USERS: {
    LOGIN: '/api/Users/login',
    CREATE: '/api/Users/create',
    GET_ALL: '/api/Users/all',
    BY_ID: (id) => `/api/Users/${id}`,
    UPDATE: (id) => `/api/Users/${id}`,
    DELETE: (id) => `/api/Users/${id}`,
    CHANGE_PASSWORD: '/api/Users/change-password',
    FORGOT_PASSWORD: '/api/Users/forgot-password',
    RESET_PASSWORD: '/api/Users/reset-password',
    UPDATE_EMAIL: '/api/Users/update-email',
    ACTIVATE: (id, isActive) => `/api/Users/${id}/activate?isActive=${isActive}`,
    GET_ROLES: '/api/Users/roles',
  },

  ROLES: {
    CREATE: '/api/Role/createrole',
    GET_ALL: '/api/Role/getrole',
    BY_ID: (id) => `/api/Role/${id}`,
    UPDATE: (id) => `/api/Role/${id}`,
    DELETE: (id) => `/api/Role/${id}`,
  },

  BRANCHES: {
    CREATE: '/api/Branch/createBranch',
    GET_ALL: '/api/Branch/getBranch',
    BY_ID: (id) => `/api/Branch/${id}`,
    UPDATE: (id) => `/api/Branch/${id}`,
    DELETE: (id) => `/api/Branch/${id}`,
  },

  TENANTS: {
    CREATE: '/api/Tenant/createTenantSetting',
    GET_ALL: '/api/Tenant/getTenantSetting',
    BY_ID: (id) => `/api/Tenant/${id}`,
    UPDATE: (id) => `/api/Tenant/${id}`,
    DELETE: (id) => `/api/Tenant/${id}`,
  },

  SETTINGS: {
    PROFILE: {
      GET_BY_USER_ID: (userId) => `/api/CompanySetting/profile/${userId}`,
      SAVE_OR_UPDATE: '/api/CompanySetting/profile',
    },
    COMPANY: {
      GET_BY_COMPANY_ID: (companyId) => `/api/CompanySetting/company/${companyId}`,
      SAVE_OR_UPDATE: '/api/CompanySetting/company',
      GET_ALL: '/api/CompanySetting/getallcompanydata',
    },
  },

  PERMISSIONS: {
    CREATE: '/api/Permission/create',
    GET_ALL: '/api/Permission/getpermission',
    BY_ID: (id) => `/api/Permission/${id}`,
    UPDATE: (id) => `/api/Permission/${id}`,
    DELETE: (id) => `/api/Permission/${id}`,
  },
  MENU: {
    CREATE: '/api/Menu/create',
    GET_ALL: '/api/Menu/getall',
    Get_BY_ID: (id) => `/api/Menu/GetById/${id}`,
    UPDATE: '/api/Menu/Update',
    DELETE: (id) => `/api/Menu/Delete/${id}`,
  },
  ROLE_MENU_PERMISSION: {
    ASSIGN_PERMISSIONS: '/api/RoleMenu/assign-permissions',
    GET_BY_ROLE: (roleId) => `/api/RoleMenu/by-role/${roleId}`,
    GET_ALL: '/api/RoleMenu/all-assignments',
    DELETE: (id) => `/api/RoleMenu/remove-permission/${id}`,
  },
  CUSTOMER: {
    CREATE: '/api/Customer/createCustomer',
    GET_ALL: (page = 1, size = 10) =>
      `/api/Customer/getCustomer?pageNumber=${page}&pageSize=${size}`,
    GET_LIST: '/api/Customer/customerList',
    BY_ID: (id) => `/api/Customer/${id}`,
    UPDATE: (id) => `/api/Customer/updateCustomer/${id}`,
    DELETE: (Id) => `/api/Customer/deleteCustomer/${Id}`,
  },
  PRODUCT: {
    CREATE: '/api/Product/createProduct',
    GET_ALL: (page = 1, size = 10) => `/api/Product/getProduct?pageNumber=${page}&pageSize=${size}`,
    GET_LIST: '/api/Product/productList',
    BY_ID: (id) => `/api/Product/${id}`,
    UPDATE: (id) => `/api/Product/updateProduct/${id}`,
    DELETE: (Id) => `/api/Product/deleteProduct/${Id}`,
  },
  VENDOR: {
    CREATE: '/api/Vendor/createVendor',
    GET_LIST: '/api/Vendor/getVendorList',
    GET_ALL: (page = 1, size = 10) => `/api/Vendor/getVendor?pageNumber=${page}&pageSize=${size}`,
    BY_ID: (id) => `/api/Vendor/${id}`,
    UPDATE: (id) => `/api/Vendor/updateVendor/${id}`,
    DELETE: (Id) => `/api/Vendor/deleteVendor/${Id}`,
  },
  PURCHASE_ORDER: {
    CREATE: '/api/PurchaseOrder',
    GET_ALL: (page = 1, size = 10) => `/api/PurchaseOrder?pageNumber=${page}&pageSize=${size}`,
    BY_ID: (id) => `/api/PurchaseOrder/${id}`,
    UPDATE: (id) => `/api/PurchaseOrder/${id}`,
    DELETE: (id) => `/api/PurchaseOrder/${id}`,
  },
  QUOTATION: {
    CREATE: '/api/Quotation',
    GET_ALL: (page = 1, size = 10) => `/api/Quotation?pageNumber=${page}&pageSize=${size}`,
    BY_ID: (id) => `/api/Quotation/${id}`,
    UPDATE: (id) => `/api/Quotation/${id}`,
    DELETE: (id) => `/api/Quotation/${id}`,
  },
  SALE: {
    CREATE: '/api/Sale',
    GET_ALL: (page = 1, size = 10) => `/api/Sale?pageNumber=${page}&pageSize=${size}`,
    BY_ID: (id) => `/api/Sale/${id}`,
    UPDATE: (id) => `/api/Sale/${id}`,
    DELETE: (id) => `/api/Sale/${id}`,
    APPROVE_QUOTATION: (id) => `/api/Sale/convert-to-sale/${id}`,
  },
  EMPLOYEE: {
    CREATE: '/api/Employee/createEmployee',
    GET_ALL: (page = 1, size = 10) =>
      `/api/Employee/getEmployee?pageNumber=${page}&pageSize=${size}`,
    BY_ID: (id) => `/api/Employee/${id}`,
    UPDATE: (id) => `/api/Employee/updateEmployee/${id}`,
    DELETE: (Id) => `/api/Employee/deleteEmployee/${Id}`,
  },
  EMAIL: {
    SEND: '/api/Email',
    SYNC: '/api/Email/inbox',
    GET_INBOX: '/api/Email',
  },
}
