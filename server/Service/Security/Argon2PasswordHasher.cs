using System.Security.Cryptography;
using System.Text;
using Konscious.Security.Cryptography;

namespace Service.Security;

public class Argon2PasswordHasher : IPasswordHasher
{
    public string HashPassword(string password, string salt)
    {
        Argon2id argon2 = new Argon2id(
            Encoding.UTF8.GetBytes(password));
        argon2.Salt = Convert.FromBase64String(salt);
        argon2.MemorySize = 64 * 1024;
        argon2.Iterations = 3;
        argon2.DegreeOfParallelism = 4;
        
        string hash = Convert.ToBase64String(argon2.GetBytes(32));
        return $"{hash}.{salt}";
        
        
    }

    public string HashAndSaltPassword(string password)
    {
        var salt = RandomNumberGenerator.GetBytes(16);
        return HashPassword(password, Convert.ToBase64String(salt));
    }

    public bool VerifyHashedPassword(string password, string hashedPassword)
    {
        var parts = hashedPassword.Split(".");
        if (parts.Length != 2)
        {
            return false;
        }

        var storedHash = parts[0];
        var salt = parts[1];

        var newHashedPassword = HashPassword(password, salt);
        return newHashedPassword == $"{storedHash}.{salt}";;
    }
}