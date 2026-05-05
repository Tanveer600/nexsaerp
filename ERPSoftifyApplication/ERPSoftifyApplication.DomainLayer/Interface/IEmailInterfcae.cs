using ERPSoftifyApplication.DomainLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Interface
{
    public interface IEmailInterfcae
    {
        Task AddEmailAsync(UserEmail email, CancellationToken ct);
        Task<bool> EmailExistsAsync(string subject, DateTime receivedDate, int tenantId, CancellationToken ct);
        Task<List<UserEmail>> GetEmailsByTenantAsync(int tenantId, CancellationToken ct);
        Task SaveChangesAsync(CancellationToken ct);
    }
}
