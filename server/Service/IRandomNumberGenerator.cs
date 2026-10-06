namespace Service;

public interface IRandomNumberGenerator
{
    int Next(int min, int max);
}

// not called "RandomNumberGenerator", .NET already has a class with that name
public class RealRandomNumberGenerator : IRandomNumberGenerator
{
    private readonly Random _random = new();
    public int Next(int min, int max) => _random.Next(min, max);
}