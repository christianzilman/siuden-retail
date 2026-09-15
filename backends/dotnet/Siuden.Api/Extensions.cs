namespace Siuden.Api;

public static class Extensions
{
    public static TModel GetOptions<TModel>(
    this IConfiguration configuration,
    string sectionName)
    where TModel : new()
    {
        TModel val = new TModel();

        configuration.GetSection(sectionName).Bind(val);

        return val;
    }
}
