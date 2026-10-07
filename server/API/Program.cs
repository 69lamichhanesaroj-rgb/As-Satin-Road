

using API;
using Infra;
using Infra.Entities;
using LinqToDB;
using LinqToDB.Mapping;
using LinqToDB.Data;
using Service;
using Service.Security;

var builder = WebApplication.CreateBuilder(args);

var options = new DataOptions().UseSQLite(builder.Configuration["DB"] ?? "Data Source=dev.db");

var dbOptions = new DataOptions<MyDatabaseConnection>(options);

builder.Services.AddScoped<MyDatabaseConnection>(_ => new MyDatabaseConnection(dbOptions));
builder.Services.AddScoped<ListingService>();
builder.Services.AddScoped<OrderService>();
builder.Services.AddScoped<CategoryService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<IPasswordHasher, Argon2PasswordHasher>();
builder.Services.AddSingleton<IRandomNumberGenerator, RealRandomNumberGenerator>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument();
builder.Services.AddControllers();
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

var app = builder.Build();
app.UseExceptionHandler();


using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<MyDatabaseConnection>();
    db.CreateTable<Category>(new CreateTableOptions
    {
        TableOptions = TableOptions.CreateIfNotExists
    });
    
    db.CreateTable<User>(new CreateTableOptions
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
