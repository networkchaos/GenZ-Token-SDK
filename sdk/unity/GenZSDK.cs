using System;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using UnityEngine;

namespace GenZ
{
    public class GenZOptions
    {
        public string BaseUrl { get; set; }
        public string ApiKey { get; set; }
        public int TimeoutMs { get; set; } = 10000;
        public int MaxRetries { get; set; } = 2;
    }

    public class GenZSDK : IDisposable
    {
        private readonly HttpClient http;
        private readonly GenZOptions options;

        public TokensApi Tokens { get; }
        public EconomyApi Economy { get; }

        public GenZSDK(GenZOptions options)
        {
            if (string.IsNullOrEmpty(options?.BaseUrl)) throw new ArgumentException("BaseUrl is required");
            this.options = options;
            var handler = new HttpClientHandler();
            http = new HttpClient(handler)
            {
                Timeout = TimeSpan.FromMilliseconds(options.TimeoutMs)
            };
            Tokens = new TokensApi(http, options);
            Economy = new EconomyApi(http, options);
        }

        public async Task Initialize(CancellationToken ct = default)
        {
            await RequestWithRetry(HttpMethod.Get, "/v1/health", null, ct);
        }

        internal async Task<string> RequestWithRetry(HttpMethod method, string path, string jsonBody, CancellationToken ct)
        {
            var url = options.BaseUrl.TrimEnd('/') + path;
            for (int attempt = 0; attempt <= options.MaxRetries; attempt++)
            {
                try
                {
                    using (var req = new HttpRequestMessage(method, url))
                    {
                        req.Headers.Add("Accept", "application/json");
                        if (!string.IsNullOrEmpty(options.ApiKey))
                        {
                            req.Headers.Add("Authorization", $"Bearer {options.ApiKey}");
                        }
                        if (jsonBody != null)
                        {
                            req.Content = new StringContent(jsonBody, Encoding.UTF8, "application/json");
                        }
                        using (var res = await http.SendAsync(req, ct))
                        {
                            var text = await res.Content.ReadAsStringAsync();
                            if (!res.IsSuccessStatusCode)
                            {
                                if ((int)res.StatusCode >= 500 && attempt < options.MaxRetries)
                                {
                                    await Task.Delay(BackoffMs(attempt), ct);
                                    continue;
                                }
                                throw new HttpRequestException($"HTTP {(int)res.StatusCode}: {text}");
                            }
                            return text;
                        }
                    }
                }
                catch (TaskCanceledException)
                {
                    if (attempt < options.MaxRetries)
                    {
                        await Task.Delay(BackoffMs(attempt), ct);
                        continue;
                    }
                    throw;
                }
                catch (HttpRequestException ex)
                {
                    if (attempt < options.MaxRetries)
                    {
                        await Task.Delay(BackoffMs(attempt), ct);
                        continue;
                    }
                    throw new Exception($"GenZ request failed: {ex.Message}");
                }
            }
            throw new Exception("GenZ request failed after retries");
        }

        private int BackoffMs(int attempt)
        {
            var baseMs = 300 * (int)Math.Pow(2, attempt);
            var jitter = UnityEngine.Random.Range(0, 200);
            return Math.Min(3000, baseMs + jitter);
        }

        public void Dispose()
        {
            http?.Dispose();
        }
    }

    public class TokensApi
    {
        private readonly HttpClient http;
        private readonly GenZOptions options;

        public TokensApi(HttpClient http, GenZOptions options)
        {
            this.http = http;
            this.options = options;
        }

        public async Task<string> Mint(string playerId, int amount, string reason = null, CancellationToken ct = default)
        {
            if (string.IsNullOrEmpty(playerId)) throw new ArgumentException("playerId is required");
            if (amount <= 0) throw new ArgumentException("amount must be positive");
            var body = $"{\"playerId\":\"{playerId}\",\"amount\":{amount}{(reason != null ? ",\"reason\":\"" + reason + "\"" : "")}}";
            var sdk = new GenZSDK(options);
            return await sdk.RequestWithRetry(HttpMethod.Post, "/v1/tokens/mint", body, ct);
        }

        public async Task<string> Transfer(string fromPlayerId, string toPlayerId, int amount, CancellationToken ct = default)
        {
            if (string.IsNullOrEmpty(fromPlayerId) || string.IsNullOrEmpty(toPlayerId)) throw new ArgumentException("player ids required");
            if (amount <= 0) throw new ArgumentException("amount must be positive");
            var body = $"{\"fromPlayerId\":\"{fromPlayerId}\",\"toPlayerId\":\"{toPlayerId}\",\"amount\":{amount}}";
            var sdk = new GenZSDK(options);
            return await sdk.RequestWithRetry(HttpMethod.Post, "/v1/tokens/transfer", body, ct);
        }

        public async Task<string> Balance(string playerId, CancellationToken ct = default)
        {
            if (string.IsNullOrEmpty(playerId)) throw new ArgumentException("playerId is required");
            var sdk = new GenZSDK(options);
            return await sdk.RequestWithRetry(HttpMethod.Get, $"/v1/wallets/{Uri.EscapeDataString(playerId)}/balance", null, ct);
        }
    }

    public class EconomyApi
    {
        private readonly HttpClient http;
        private readonly GenZOptions options;
        public EconomyApi(HttpClient http, GenZOptions options)
        {
            this.http = http;
            this.options = options;
        }

        public async Task<string> Info(CancellationToken ct = default)
        {
            var sdk = new GenZSDK(options);
            return await sdk.RequestWithRetry(HttpMethod.Get, "/v1/economy", null, ct);
        }
    }
}


