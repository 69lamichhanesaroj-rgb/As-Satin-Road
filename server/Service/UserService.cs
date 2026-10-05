using Infra;
using Infra.Entities;
using LinqToDB;
using Service.Security;

namespace Service;

    public record RegisterRequest(string Username, string Password);
    public record LoginRequest(string Username, string Password);
    public record UserDto(string Id, string Username, string Role);

    public class UserService
    {
        private readonly MyDatabaseConnection _db;
        private readonly IPasswordHasher _passwordHasher;

        public UserService(MyDatabaseConnection db, IPasswordHasher passwordHasher)
        {
            _db = db;
            _passwordHasher = passwordHasher;
        }

        // more than 100 orders = featured on the home page (#18)
        public bool IsFeatured(int totalSales)
        {
            return totalSales > 100;
        }

        // "> 100" is written again here, linq2db can't turn IsFeatured() into SQL
        public List<UserDto> GetTopVendors()
        {
            return _db.Users
                .Where(u => u.TotalSales > 100 && !u.IsShutDown)
                .OrderByDescending(u => u.TotalSales)
                .Select(u => new UserDto(u.Id, u.UserName, u.Role))
                .ToList();
        }

        public UserDto Register(RegisterRequest dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Username))
                throw new Exception("Username cannot be empty");
            if (string.IsNullOrWhiteSpace(dto.Password))
                throw new Exception("Password cannot be empty");
            if (_db.Users.Any(u => u.UserName == dto.Username))
                throw new Exception("Username already exists");

            var user = new User
            {
                UserName = dto.Username,
                PasswordHash = _passwordHasher.HashAndSaltPassword(dto.Password),
                Role = "user"
            };
            _db.Insert(user);
            return new UserDto(user.Id, user.UserName, user.Role);
        }

        public UserDto Login(LoginRequest dto)
        {
            var user = _db.Users.FirstOrDefault(u => u.UserName == dto.Username);
            if (user == null || !_passwordHasher.VerifyHashedPassword(dto.Password, user.PasswordHash))
                throw new Exception("Wrong username or password");
            return new UserDto(user.Id, user.UserName, user.Role);
        }
    }
    