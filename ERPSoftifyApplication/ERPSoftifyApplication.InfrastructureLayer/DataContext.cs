using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace ERPSoftifyApplication.InfrastructureLayer
{
    public class DataContext : DbContext
    {
        private readonly ICurrentUserService _currentUserService;

        public DataContext(DbContextOptions<DataContext> options, ICurrentUserService currentUserService)
            : base(options)
        {
            _currentUserService = currentUserService;
        }

        public int CurrentTenantId => _currentUserService.TenantId;
        public int CurrentBranchId => _currentUserService.BranchId;
        public int CurrentCompanyId => _currentUserService.CompanyId;
        public int CurrentUserId => _currentUserService.UserId;

        public int CurrentRoleId => _currentUserService.RoleId;

        #region DbSets
        public DbSet<Product> Products { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<StockTransaction> StockTransactions { get; set; }
        public DbSet<Quotation> Quotations { get; set; }
        public DbSet<QuotationItem> QuotationItems { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<RoleMenu> RoleMenus { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }
        public DbSet<Leave> Leaves { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Lead> Leads { get; set; }
        public DbSet<PurchaseOrder> PurchaseOrders { get; set; }
        public DbSet<PurchaseOrderItem> PurchaseOrderItems { get; set; }
        public DbSet<JobAssignment> JobAssignments { get; set; }
        public DbSet<Job> Jobs { get; set; }
        public DbSet<Invoice> invoices { get; set; }
        public DbSet<InvoiceItems> invoiceitems { get; set; }
        public DbSet<FollowUp> FollowUps { get; set; }
        public DbSet<GoodsReceived> GoodsReceiveds { get; set; }
        public DbSet<Expense> Expenses { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Attendance> Attendances { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<SalesOrder> SalesOrders { get; set; }
        public DbSet<SalesOrderItem> SalesOrderItems { get; set; }
        public DbSet<ServiceReport> ServiceReports { get; set; }
        public DbSet<TenantSetting> TenantSettings { get; set; }
        public DbSet<Menu> Menus { get; set; }
        public DbSet<Branch> Branches { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<CompanySetting> CompanySettings { get; set; }
        public DbSet<Vendor> Vendors { get; set; }
        public DbSet<UserEmail> UserEmails { get; set; }
        public DbSet<Category> Categorys { get; set; }
        public DbSet<DeliveryNote> DeliveryNotes { get; set; }
        public DbSet<DeliveryNoteItem> DeliveryNoteItems { get; set; }
        public DbSet<VendorQuotation> VendorQuotations { get; set; }
        public DbSet<VendorQuotationItem> VendorQuotationItems { get; set; }
        public DbSet<GoodsReceived> GoodsReceivedes { get; set; }
        public DbSet<GoodsReceivedItem> GoodsReceivedItems { get; set; }
        public DbSet<Warehouse> Warehouses { get; set; }



        #endregion

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Invoice>().ToTable("invoice");
            modelBuilder.Entity<InvoiceItems>().ToTable("invoiceitems");
            modelBuilder.Entity<RoleMenu>(entity =>
            {
                entity.HasKey(x => x.ID);
                entity.Property(x => x.ID).ValueGeneratedOnAdd();
                entity.HasOne(x => x.Role).WithMany().HasForeignKey(x => x.RoleId);
                entity.HasOne(x => x.Menu).WithMany().HasForeignKey(x => x.MenuId);
                entity.HasOne(x => x.Permission).WithMany().HasForeignKey(x => x.PermissionId);
            });
     
            modelBuilder.Entity<PurchaseOrderItem>()
                .HasOne(i => i.PurchaseOrder)
                .WithMany(o => o.Items)
                .HasForeignKey(i => i.POId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<QuotationItem>()
               .HasOne(i => i.Quotation)
               .WithMany(o => o.QuotationItems)
               .HasForeignKey(i => i.QuotationId)
               .OnDelete(DeleteBehavior.Cascade);

         
            modelBuilder.Entity<SalesOrderItem>()
               .HasOne(i => i.SalesOrder)
               .WithMany(o => o.Items)
               .HasForeignKey(i => i.SOId)
               .OnDelete(DeleteBehavior.Cascade);

            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                if (typeof(IMustHaveTenant).IsAssignableFrom(entityType.ClrType))
                {
                    var parameter = Expression.Parameter(entityType.ClrType, "e");
                    var filter = Expression.Lambda(
                        Expression.Equal(
                            Expression.Property(parameter, nameof(IMustHaveTenant.TenantId)),
                            Expression.Property(Expression.Constant(this), nameof(CurrentTenantId))
                        ),
                        parameter
                    );
                    modelBuilder.Entity(entityType.ClrType).HasQueryFilter(filter);
                }

                if (typeof(IMustHaveBranch).IsAssignableFrom(entityType.ClrType))
                {
                    var parameter = Expression.Parameter(entityType.ClrType, "e");
                    var filter = Expression.Lambda(
                        Expression.Equal(
                            Expression.Property(parameter, nameof(IMustHaveBranch.BranchId)),
                            Expression.Property(Expression.Constant(this), nameof(CurrentBranchId))
                        ),
                        parameter
                    );
                    modelBuilder.Entity(entityType.ClrType).HasQueryFilter(filter);
                }
                if (typeof(IMustHaveRole).IsAssignableFrom(entityType.ClrType))
                {
                    var parameter = Expression.Parameter(entityType.ClrType, "e");
                    var filter = Expression.Lambda(
                        Expression.Equal(
                            Expression.Property(parameter, nameof(IMustHaveRole.RoleId)),
                            Expression.Property(Expression.Constant(this), nameof(CurrentRoleId))
                        ),
                        parameter
                    );
                    modelBuilder.Entity(entityType.ClrType).HasQueryFilter(filter);
                }
            }
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            foreach (var entry in ChangeTracker.Entries())
            {
                if (entry.Entity is IMustHaveTenant tenantEntity)
                {
                    if (entry.State == EntityState.Added && tenantEntity.TenantId == 0)
                    {
                        tenantEntity.TenantId = CurrentTenantId;
                    }
                    else if (entry.State == EntityState.Modified)
                    {
                        entry.Property("TenantId").IsModified = false;
                    }
                }

                if (entry.Entity is IMustHaveBranch branchEntity)
                {
                    if (entry.State == EntityState.Added && branchEntity.BranchId == 0)
                    {
                        branchEntity.BranchId = CurrentBranchId;
                    }
                    else if (entry.State == EntityState.Modified)
                    {
                        entry.Property("BranchId").IsModified = false;
                    }
                }

                /*
                if (entry.Entity is IMustHaveCompany companyEntity)
                {
                    if (entry.State == EntityState.Added && companyEntity.CompanyId == 0)
                    {
                        companyEntity.CompanyId = CurrentCompanyId;
                    }
                }
                */
            }

            return base.SaveChangesAsync(cancellationToken);
        }
    }
}