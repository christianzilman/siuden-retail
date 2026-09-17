using MediatR;
using Siuden.Application.Features.AccountMembers.DTOs;

namespace Siuden.Application.Features.AccountMembers.Queries;

public sealed record GetAccountMembersQuery(
    Guid RequesterUserId,
    Guid AccountId) : IRequest<IReadOnlyCollection<AccountMemberDto>>;
