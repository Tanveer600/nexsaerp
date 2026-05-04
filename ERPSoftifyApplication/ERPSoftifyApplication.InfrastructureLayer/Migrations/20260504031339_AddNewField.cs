using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ERPSoftifyApplication.InfrastructureLayer.Migrations
{
    /// <inheritdoc />
    public partial class AddNewField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SalesOrderId",
                table: "SalesOrderItems",
                newName: "SOId");

            migrationBuilder.AddColumn<int>(
                name: "BranchId",
                table: "QuotationItems",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_SalesOrderItems_SOId",
                table: "SalesOrderItems",
                column: "SOId");

            migrationBuilder.AddForeignKey(
                name: "FK_SalesOrderItems_SalesOrders_SOId",
                table: "SalesOrderItems",
                column: "SOId",
                principalTable: "SalesOrders",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SalesOrderItems_SalesOrders_SOId",
                table: "SalesOrderItems");

            migrationBuilder.DropIndex(
                name: "IX_SalesOrderItems_SOId",
                table: "SalesOrderItems");

            migrationBuilder.DropColumn(
                name: "BranchId",
                table: "QuotationItems");

            migrationBuilder.RenameColumn(
                name: "SOId",
                table: "SalesOrderItems",
                newName: "SalesOrderId");
        }
    }
}
