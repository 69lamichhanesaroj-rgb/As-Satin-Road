namespace Service;

public interface IRandomNumberGenerator
{
    int Next(int min, int max);
}

public class RandomNumberGenerator : IRandomNumberGenerator
{
    private readonly Random _random = new();
    public int Next(int min, int max) => _random.Next(min, max);
}