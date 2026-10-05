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

        /*
         * TODO #23 (Rafal)
         * The brief says MORE than 100 orders, so it must be > 100, not >= 100.
         * Put the rule in its own small method IsFeatured(int totalSales) that returns a bool,
         * and use it here. Then a test can check 100 -> false and 101 -> true.
         * Home page (#18) shows these vendors at the top.
         */
        public List<User> GetTopVendors()
        {
            return _db.Users
                .Where(v => v.TotalSales >= 100 && !v.IsShutDown)
                .OrderByDescending(v => v.TotalSales)
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
    