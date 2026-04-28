using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.InfrastructureLayer.Repositories
{
    public class BranchRepository:IBranchInterface
    {
        private readonly DataContext _context;

        public BranchRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<Branch> CreateAsync(Branch Branch, CancellationToken cancellationToken)
        {
            await _context.Branches.AddAsync(Branch, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return Branch;
        }

        public async Task<Branch?> GetByIdAsync(int id, CancellationToken cancellationToken)
        {
            return await _context.Branches
                .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        }

        public async Task<List<Branch>> GetAllAsync(CancellationToken cancellationToken)
        {
            var branchlist= await _context.Branches
    .Include(b => b.ParentBranch) // <- important
    .AsNoTracking()
    .ToListAsync(cancellationToken);
            return branchlist;
        }

        public async Task<Branch> UpdateAsync(Branch Branch, CancellationToken cancellationToken)
        {
            _context.Branches.Update(Branch);
            await _context.SaveChangesAsync(cancellationToken);

            return Branch;
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken)
        {
            var entity = await _context.Branches
                .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

            if (entity == null)
                return false;

            _context.Branches.Remove(entity);
            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}

