using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.InfrastructureLayer.Repositories
{
    public class InvoiceRepository : IInvoiceInterface
    {
        private readonly DataContext _dbcontext;

        public InvoiceRepository(DataContext dataContext)
        {
            _dbcontext = dataContext;
        }

        public async Task<Invoice> CreateInvoice(Invoice model, CancellationToken can)
        {
            await _dbcontext.Set<Invoice>().AddAsync(model, can);
            await _dbcontext.SaveChangesAsync(can);
            return model;
        }

        public async Task<bool> DeleteInvoice(int Id, CancellationToken can)
        {
            var invoice = await _dbcontext.invoices
                .Include(x => x.Items)
                .FirstOrDefaultAsync(c => c.ID == Id, can);

            if (invoice == null)
                return false;

            _dbcontext.invoices.Remove(invoice);
            await _dbcontext.SaveChangesAsync(can);
            return true;
        }

        public async Task<List<Invoice>> GetAll(CancellationToken can)
        {
            return await _dbcontext.invoices
                .Include(x => x.Items)
                .AsNoTracking()
                .ToListAsync(can);
        }

        public async Task<Invoice> GetById(int Id, CancellationToken can)
        {
            return await _dbcontext.invoices
                .Include(x => x.Items)
                .FirstOrDefaultAsync(c => c.ID == Id, can);
        }

        public async Task<Invoice> UpDateInvoice(Invoice model, CancellationToken cancellationToken)
        {
            var existingInvoice = await _dbcontext.invoices
                .Include(x => x.Items)
                .FirstOrDefaultAsync(c => c.ID == model.ID, cancellationToken);

            if (existingInvoice != null)
            {
                _dbcontext.Entry(existingInvoice).CurrentValues.SetValues(model);
                if (existingInvoice.Items != null && existingInvoice.Items.Any())
                {
                    _dbcontext.RemoveRange(existingInvoice.Items);
                }

                if (model.Items != null && model.Items.Any())
                {
                    foreach (var newItem in model.Items)
                    {
                        newItem.InvoiceId = existingInvoice.ID;
                        existingInvoice.Items.Add(newItem);
                    }
                }

                await _dbcontext.SaveChangesAsync(cancellationToken);
                return existingInvoice;
            }

            return null;
        }
    }
}