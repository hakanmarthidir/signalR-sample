using System;
using Microsoft.AspNetCore.SignalR;

namespace signalR_server.Hubs
{
    public class StatisticHub : Hub
    {
        public string GetConnectionId()
        {
            return Context.ConnectionId;
        }

        public async Task Welcome(string connectionId)
        {
            var client = Clients.Client(connectionId);
            await client.SendAsync("welcome", $"hellooo {connectionId}");
            //await Clients.All.SendAsync("welcome", $"helloo all");
        }

    }
}

