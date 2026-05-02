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
        public int CurrentBranchId  => _currentUserService.BranchId;

        public int CurrentRoleId=> _currentUserService.RoleId;

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
        public DbSet<Invoice> invoice { get; set; }
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
        public DbSet<ServiceReport> ServiceReports { get; set; }
        public DbSet<TenantSetting> TenantSettings { get; set; }
        public DbSet<Menu> Menus { get; set; }
        public DbSet<Branch> Branches { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<CompanySetting> CompanySettings { get; set; }
        #endregion

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<RoleMenu>(entity =>
            {
                entity.HasKey(x => x.ID);

                entity.Property(x => x.ID)
                    .ValueGeneratedOnAdd();

                entity.HasOne(x => x.Role)
                    .WithMany()
                    .HasForeignKey(x => x.RoleId);

                entity.HasOne(x => x.Menu)
                    .WithMany()
                    .HasForeignKey(x => x.MenuId);

                entity.HasOne(x => x.Permission)
                    .WithMany()
                    .HasForeignKey(x => x.PermissionId);
            });

            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {

                if (typeof(IMustHaveTenant).IsAssignableFrom(entityType.ClrType))
                {
                    var parameter = Expression.Parameter(entityType.ClrType, "e");
                    var property = Expression.Property(parameter, nameof(IMustHaveTenant.TenantId));

                    var filter = Expression.Lambda(
                        Expression.Equal(
                            property,
                            Expression.Property(Expression.Constant(this), nameof(DataContext.CurrentTenantId))
                        ),
                        parameter
                    );

                    modelBuilder.Entity(entityType.ClrType).HasQueryFilter(filter);
                }
                if (typeof(IMustHaveBranch).IsAssignableFrom(entityType.ClrType))
                {
                    var parameter = Expression.Parameter(entityType.ClrType, "e");
                    var property = Expression.Property(parameter, nameof(IMustHaveBranch.BranchId));

                    var filter = Expression.Lambda(
                        Expression.Equal(
                            property,
                            Expression.Property(Expression.Constant(this), nameof(DataContext.CurrentTenantId))
                        ),
                        parameter
                    );

                    modelBuilder.Entity(entityType.ClrType).HasQueryFilter(filter);
                }
                if (typeof(IMustHaveRole).IsAssignableFrom(entityType.ClrType))
                {
                    var parameter = Expression.Parameter(entityType.ClrType, "e");
                    var property = Expression.Property(parameter, nameof(IMustHaveRole.RoleId));

                    var filter = Expression.Lambda(
                        Expression.Equal(
                            property,
                            Expression.Property(Expression.Constant(this), nameof(DataContext.CurrentRoleId))
                        ),
                        parameter
                    );

                    modelBuilder.Entity(entityType.ClrType).HasQueryFilter(filter);
                }
            }

        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker.Entries<IMustHaveTenant>();

            foreach (var entry in entries)
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        if (entry.Entity.TenantId == 0)
                        {
                            entry.Entity.TenantId = CurrentTenantId;
                        }
                        break;

                    case EntityState.Modified:
                        entry.Property(x => x.TenantId).IsModified = false;
                        break;
                }
            }
            var branchEntries = ChangeTracker.Entries<IMustHaveBranch>();
            foreach (var entry in branchEntries)
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        if (entry.Entity.BranchId == 0)
                        {
                            entry.Entity.BranchId = CurrentTenantId;
                        }
                        break;

                    case EntityState.Modified:
                        entry.Property(x => x.BranchId).IsModified = false;
                        break;
                }
            }
            return base.SaveChangesAsync(cancellationToken);
        }
    }
}