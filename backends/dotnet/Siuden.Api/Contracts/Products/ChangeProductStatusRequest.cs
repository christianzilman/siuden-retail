using Siuden.Domain.Enums;

namespace Siuden.Api.Contracts.Products;

public record ChangeProductStatusRequest(
    ProductStatusEnum Status);
