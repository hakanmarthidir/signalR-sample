using System;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Channels;
using Microsoft.AspNetCore.SignalR;

namespace signalR_server.Hubs
{
    public class StatisticHub : Hub
    {

        public static List<string> _countries = new List<string>()
        {
            "Country 1","Country 2","Country 3","Country 4","Country 5","Country 6","Country 7"
        };

        public string GetConnectionId()
        {
            return Context.ConnectionId;
        }

        public async Task Welcome(string connectionId)
        {
            var client = Clients.Client(connectionId);
            await client.SendAsync("welcome", $"hellooo {connectionId}");
        }

        public async Task WelcomeAll(string connectionId)
        {
            await Clients.All.SendAsync("welcomeall", $"helloo all");
        }

        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            return base.OnDisconnectedAsync(exception);
        }


        //Streaming with IAsyncEnumerable
        public async IAsyncEnumerable<string> GetCountriesStream1([EnumeratorCancellation]
        CancellationToken cancellationToken)
        {
            foreach (var country in _countries)
            {
                await Task.Delay(1000); //testing purpose
                yield return country;
            }

            cancellationToken.ThrowIfCancellationRequested();
        }


        //Streaming Other Way

        public ChannelReader<string> GetCountriesStream2(int delay, CancellationToken cancellationToken)
        {
            var channel = Channel.CreateUnbounded<string>();
            _ = WriteItemsAsync(channel.Writer, _countries, delay, cancellationToken);
            return channel.Reader;
        }

        private async Task WriteItemsAsync(ChannelWriter<string> writer, List<string> countries, int delay, CancellationToken cancellationToken)
        {
            Exception localException = null;
            try
            {
                foreach (var country in countries)
                {
                    await writer.WriteAsync(country, cancellationToken);
                    await Task.Delay(delay, cancellationToken);
                }
            }
            catch (Exception ex)
            {
                localException = ex;
            }
            finally
            {
                writer.Complete(localException);
            }
        }
    }
}

