

using Infra;
using Infra.Entities;
using LinqToDB;
using LinqToDB.Mapping;
using LinqToDB.Data;

var builder = WebApplication.CreateBuilder(args);

var options = new DataOptions().UseSQLite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=satinroad.db");

var dbOptions = new DataOptions<MyDatabaseConnection>(options);

builder.Services.AddScoped<MyDatabaseConnection>(_ => new MyDatabaseConnection(dbOptions));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument();

var app = builder.Build();


using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<MyDatabaseConnection>();
    db.CreateTable<Category>(new CreateTableOptions
    {
        TableOptions = TableOptions.CreateIfNotExists
    });
    
    db.CreateTable<Vendor>(new CreateTableOptions
    {
        TableOptions = TableOptions.CreateIfNotExists
    });
    
    db.CreateTable<Listing>(new CreateTableOptions
    {
        TableOptions = TableOptions.CreateIfNotExists
    });
    
    db.CreateTable<Order>(new CreateTableOptions
    {
        TableOptions = TableOptions.CreateIfNotExists
    });
    
}

app.UseCors(config => config.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin().SetIsOriginAllowed(_ => true));

app.UseOpenApi();
app.UseSwaggerUi();

app.UseAuthorization();
app.MapControllers();


app.Run();
