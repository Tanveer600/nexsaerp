using ERPSoftifyApplication.DomainLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Interface
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body);
        Task SyncInboxAsync(string email, int tenantId);
        Task<List<UserEmail>> GetInboxAsync(int tenantId);
    }
}
