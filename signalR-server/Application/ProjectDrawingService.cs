﻿using System;
using Microsoft.AspNetCore.SignalR;
using signalR_server.Hubs;

namespace signalR_server.Application
{

    public interface IProjectDrawingService
    {
        Task UpdateOperation(string connectionId);
    }

    public class ProjectDrawingService : IProjectDrawingService
    {
        private readonly IHubContext<StatisticHub> _hubContext;
        public ProjectDrawingService(IHubContext<StatisticHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task UpdateOperation(string connectionId)
        {
            await this._hubContext.Clients.Client(connectionId).SendAsync("updateStatistic", "Update Operation Started");
            for (int i = 0; i < 100; i++)
            {
                await Task.Delay(1000);
                await this._hubContext.Clients.Client(connectionId).SendAsync("updateStatistic", i);
            }
            await this._hubContext.Clients.Client(connectionId).SendAsync("updateStatistic", "100 Items Updated");
        }
    }
}

