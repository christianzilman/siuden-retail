using MediatR;
using Siuden.Application.Features.AccountMembers.Commands;
using Siuden.Application.Features.AccountMembers.DTOs;
using Siuden.Application.Interfaces;

namespace Siuden.Application.Features.AccountMembers.Handlers;

public sealed class CreateAccountMemberCommandHandler(IAccountMemberService accountMemberService)
    : IRequestHandler<CreateAccountMemberCommand, AccountMemberDto>
{
    public Task<AccountMemberDto> Handle(CreateAccountMemberCommand request, CancellationToken cancellationToken)
    {
        return accountMemberService.CreateAsync(request, cancellationToken);
    }
}
