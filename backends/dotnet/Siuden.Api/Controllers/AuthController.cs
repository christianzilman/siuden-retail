using MediatR;
using Microsoft.AspNetCore.Mvc;
using Siuden.Application.Features.Auth.Commands;
using Siuden.Application.Features.Auth.DTOs;
using System.Net;
using System.Threading.Tasks;

namespace Siuden.Api.Controllers;

public class AuthController : Controller
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("login")]
    [ProducesResponseType(typeof(LoginResultDto), (int)HttpStatusCode.OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<LoginResultDto>> Login([FromBody] LoginCommand command)
    {
        var result = await _mediator.Send(command);

        if (!result.Success)
        {
            return Unauthorized(result.ErrorMessage ?? "Credenciales inválidas");
        }

        return Ok(result);
    }
}
