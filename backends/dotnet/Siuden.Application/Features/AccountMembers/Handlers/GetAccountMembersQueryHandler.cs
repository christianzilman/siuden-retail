using MediatR;
using Siuden.Application.Features.AccountMembers.DTOs;
using Siuden.Application.Features.AccountMembers.Queries;
using Siuden.Application.Interfaces;

namespace Siuden.Application.Features.AccountMembers.Handlers;

public sealed class GetAccountMembersQueryHandler(IAccountMemberService accountMemberService)
    : IRequestHandler<GetAccountMembersQuery, IReadOnlyCollection<AccountMemberDto>>
{
    public Task<IReadOnlyCollection<AccountMemberDto>> Handle(
        GetAccountMembersQuery request,
        CancellationToken cancellationToken)
    {
        return accountMemberService.GetAllAsync(
            request.RequesterUserId,
            request.AccountId,
            cancellationToken);
    }
}
