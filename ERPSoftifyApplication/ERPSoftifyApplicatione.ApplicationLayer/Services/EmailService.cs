using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Services
{
    public class EmailService:IEmailService
    {
        private readonly IEmailInterfcae _emailRepo;
        private readonly IConfiguration _config;

        public EmailService(IEmailInterfcae emailRepo, IConfiguration config)
        {
            _emailRepo = emailRepo;
            _config = config;
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            var email = new MimeMessage();
            email.From.Add(new MailboxAddress("ERP NEXA System Mail", _config["EmailSettings:User"]));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;
            email.Body = new TextPart("html") { Text = body };

            using var smtp = new MailKit.Net.Smtp.SmtpClient();
            var server = _config["EmailSettings:SmtpServer"];
            var port = int.Parse(_config["EmailSettings:Port"]);
            await smtp.ConnectAsync(server, port, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(_config["EmailSettings:User"], _config["EmailSettings:Password"]);

            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
        //public async Task SyncInboxAsync(string email, string password, int tenantId)
        //{
        //    using var client = new MailKit.Net.Imap.ImapClient();
        //    await client.ConnectAsync("imap.gmail.com", 993, true);
        //    await client.AuthenticateAsync(email, password);

        //    var inbox = client.Inbox;
        //    await inbox.OpenAsync(FolderAccess.ReadOnly);

        //    var results = await inbox.SearchAsync(SearchQuery.NotSeen);

        //    foreach (var uid in results)
        //    {
        //        var message = await inbox.GetMessageAsync(uid);

        //        // Database logic repository ke zariye
        //        bool exists = await _emailRepo.EmailExistsAsync(message.Subject, message.Date.DateTime, tenantId, default);

        //        if (!exists)
        //        {
        //            await _emailRepo.AddEmailAsync(new UserEmail
        //            {
        //                Subject = message.Subject,
        //                Body = message.HtmlBody ?? message.TextBody,
        //                FromEmail = message.From.ToString(),
        //                ToEmail = email,
        //                ReceivedDate = message.Date.DateTime,
        //                TenantId = tenantId,
        //                IsRead = false
        //            }, default);
        //        }
        //    }
        //    await _emailRepo.SaveChangesAsync(default);
        //    await client.DisconnectAsync(true);
        //}
        public async Task SyncInboxAsync(string email, int tenantId)
        {
            using var client = new MailKit.Net.Pop3.Pop3Client();
            try
            {
                var appPassword = _config["EmailSettings:Password"];

                await client.ConnectAsync("pop.gmail.com", 995, true);
                await client.AuthenticateAsync(email, appPassword);

                int count = client.Count;
                for (int i = count - 1; i >= Math.Max(0, count - 20); i--)
                {
                    var message = await client.GetMessageAsync(i);
                }
                await _emailRepo.SaveChangesAsync(default);
                await client.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                throw new Exception($"POP3 Sync Failed: {ex.Message}");
            }
        }

        public async Task<List<UserEmail>> GetInboxAsync(int tenantId)
        {
            return await _emailRepo.GetEmailsByTenantAsync(tenantId, default);
        }
    }
}
