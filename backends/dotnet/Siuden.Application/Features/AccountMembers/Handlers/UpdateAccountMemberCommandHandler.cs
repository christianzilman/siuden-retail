using MediatR;
using Siuden.Application.Features.AccountMembers.Commands;
using Siuden.Application.Features.AccountMembers.DTOs;
using Siuden.Application.Interfaces;

namespace Siuden.Application.Features.AccountMembers.Handlers;

public sealed class UpdateAccountMemberCommandHandler(IAccountMemberService accountMemberService)
    : IRequestHandler<UpdateAccountMemberCommand, AccountMemberDto>
{
    public Task<AccountMemberDto> Handle(
        UpdateAccountMemberCommand request,
        CancellationToken cancellationToken)
    {
        return accountMemberService.UpdateAsync(request, cancellationToken);
    }
}
