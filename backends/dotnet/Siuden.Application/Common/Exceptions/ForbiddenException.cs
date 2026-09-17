namespace Siuden.Application.Common.Exceptions;

public sealed class ForbiddenException(string message) : Exception(message);
