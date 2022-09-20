using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using signalR_server.Application;
using signalR_server.Hubs;

namespace signalR_server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectDrawingController : ControllerBase
{
    private readonly IProjectDrawingService _projectDrawingService;

    public ProjectDrawingController(IProjectDrawingService projectDrawingService)
    {
        _projectDrawingService = projectDrawingService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAsync([FromQuery] string connectionId)
    {
        await this._projectDrawingService.UpdateOperation(connectionId);
        return Ok(new { Test = "Operation Completed" });
    }

}

