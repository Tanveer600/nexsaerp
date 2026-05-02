using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Services
{
    using System.Security.Claims;
    using Microsoft.AspNetCore.Http;

    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        private ClaimsPrincipal User =>
            _httpContextAccessor.HttpContext?.User
            ?? throw new UnauthorizedAccessException("User context not available");

        public bool IsAuthenticated =>
            _httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated ?? false;

        public int UserId => GetIntClaim(ClaimTypes.NameIdentifier);

        public int TenantId => GetIntClaim("TenantId");
        public int CompanyId => GetIntClaim("CompanyId");
        public int BranchId => GetIntClaim("BranchId");
        public int RoleId => GetIntClaim("RoleId");

        private int GetIntClaim(string key)
        {
            var claimType = key == ClaimTypes.NameIdentifier ? "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier" : key;

            var value = User.FindFirst(key)?.Value ?? User.FindFirst(claimType)?.Value;

            if (string.IsNullOrEmpty(value))
            {
                return 0;
            }

            return int.Parse(value);
        }
    }
}
