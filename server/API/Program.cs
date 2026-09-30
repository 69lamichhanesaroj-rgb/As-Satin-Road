

using Infra;
using Infra.Entities;
using LinqToDB;
using LinqToDB.Mapping;
using LinqToDB.Data;
using Service;

var builder = WebApplication.CreateBuilder(args);

var options = new DataOptions().UseSQLite(builder.Configuration["DB"] ?? "Data Source=dev.db");

var dbOptions = new DataOptions<MyDatabaseConnection>(options);

builder.Services.AddScoped<MyDatabaseConnection>(_ => new MyDatabaseConnection(dbOptions));
builder.Services.AddScoped<ListingService>();
builder.Services.AddScoped<VendorService>();

builder.Services.AddScoped<OrderService>();
builder.Services.AddScoped<CategoryService>();

/*
 * TODO #13 (Saroj)
 * When Vendor becomes User: register UserService here instead of VendorService (line above).
 */


/*
 * TODO #24 (Saroj)
 * Register the random number interface here (1 line):
 * IRandomNumberGenerator -> the real class that uses Random.
 * Why: OrderService gets it through its constructor. The real app gets the real one,
 * the tests give it a stub that returns whatever number the test wants.
 */


/*
 * TODO #10 (Saroj)
 * Global exception handler, 2 lines here:
 * one that turns on ProblemDetails, one that registers your exception handler class.
 * Make the class in a new file API/GlobalExceptionHandler.cs:
 *   it catches every exception thrown in a controller or service
 *   and sends back JSON with status 400 and the exception message (ProblemDetails).
 * Also add app.UseExceptionHandler() further down (see the TODO above MapControllers).
 *
 * Why: right now when a service throws (like "Listing not found") the client
 * only gets an empty 500 error. With this the frontend can show the real message.
 */




builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument();
builder.Services.AddControllers();

var app = builder.Build();


using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<MyDatabaseConnection>();
    db.CreateTable<Category>(new CreateTableOptions
    {
        TableOptions = TableOptions.CreateIfNotExists
    });
    
    /*
     * TODO #13 (Saroj)
     * When Vendor becomes User: create the User table here instead of Vendor.
     * Delete your dev.db after that, so the table is made again with the new columns.
     */
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

/*
 * TODO #10 (Saroj)
 * Add app.UseExceptionHandler() here (1 line), so the handler from above is actually used.
 */


app.UseAuthorization();
app.MapControllers();


app.Run();
