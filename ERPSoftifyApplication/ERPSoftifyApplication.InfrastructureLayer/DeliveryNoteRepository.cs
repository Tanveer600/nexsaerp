using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.InfrastructureLayer
{
    public class DeliveryNoteRepository:IDeliveryNoteInterface
    {
        private readonly DataContext _dbcontext;
        public DeliveryNoteRepository(DataContext context) => _dbcontext = context;

        public async Task AddAsync(DeliveryNote entity, CancellationToken ct)
        {
            await _dbcontext.DeliveryNotes.AddAsync(entity, ct);
            await _dbcontext.SaveChangesAsync();
        }

        public async Task<DeliveryNote> GetByIdAsync(int id, CancellationToken ct)
        {
            return await _dbcontext.DeliveryNotes.Include(x => x.DeliveryNoteItems)
                                             .FirstOrDefaultAsync(x => x.ID == id, ct);
        }
        public async Task<DeliveryNote> CreateDeliveryNote(DeliveryNote model, CancellationToken can)
        {
            await _dbcontext.DeliveryNotes.AddAsync(model);
            await _dbcontext.SaveChangesAsync();
            return model;
        }

        public async Task<bool> DeleteDeliveryNote(int Id, CancellationToken can)
        {
            var list = await _dbcontext.DeliveryNotes.FirstOrDefaultAsync(c => c.ID == Id);
            if (list == null)
                return false;
            _dbcontext.DeliveryNotes.Remove(list);
            await _dbcontext.SaveChangesAsync(can);
            return true;

        }

        public async Task<List<DeliveryNote>> GetAll(CancellationToken can)
        {
            var list = await _dbcontext.DeliveryNotes.AsNoTracking().ToListAsync(can);
            return list;
        }

        public async Task<DeliveryNote> UpDateDeliveryNote(DeliveryNote model, CancellationToken cancellationToken)
        {
            try
            {
                var list = await _dbcontext.DeliveryNotes.Where(c => c.ID == model.ID).FirstOrDefaultAsync();
                if (list != null)

                    _dbcontext.DeliveryNotes.Update(model);
                await _dbcontext.SaveChangesAsync();
                return model;
            }
            catch (Exception ex)
            {

                throw;
            }
        }
        public async Task SaveChangesAsync(CancellationToken ct)
        {
            await _dbcontext.SaveChangesAsync(ct);
        }
    }
}
