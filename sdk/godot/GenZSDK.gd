extends Node

class_name GenZSDK

var base_url: String
var api_key: String
var timeout_sec: int = 10
var max_retries: int = 2

func _init(_base_url: String, _api_key: String = "", _timeout_sec: int = 10, _max_retries: int = 2):
    base_url = _base_url.rstrip("/")
    api_key = _api_key
    timeout_sec = _timeout_sec
    max_retries = _max_retries

func initialize() -> void:
    await _request_with_retry("GET", "/v1/health", null)

func mint(player_id: String, amount: int, reason: String = "") -> Dictionary:
    var body = {"playerId": player_id, "amount": amount}
    if reason != "":
        body["reason"] = reason
    return await _request_with_retry("POST", "/v1/tokens/mint", body)

func transfer(from_player_id: String, to_player_id: String, amount: int) -> Dictionary:
    var body = {"fromPlayerId": from_player_id, "toPlayerId": to_player_id, "amount": amount}
    return await _request_with_retry("POST", "/v1/tokens/transfer", body)

func balance(player_id: String) -> Dictionary:
    var path = "/v1/wallets/%s/balance" % [Uri.encode_www_form(player_id)]
    return await _request_with_retry("GET", path, null)

func _request_with_retry(method: String, path: String, body: Variant) -> Dictionary:
    var url = base_url + path
    var headers = ["Content-Type: application/json"]
    if api_key != "":
        headers.append("Authorization: Bearer %s" % api_key)

    var last_err := {}
    for attempt in range(max_retries + 1):
        var http := HTTPRequest.new()
        add_child(http)
        http.timeout = timeout_sec
        var req_body := body == null ? "" : JSON.stringify(body)
        var err = http.request(url, headers, HTTPClient.METHOD_GET if method == "GET" else HTTPClient.METHOD_POST, req_body)
        if err != OK:
            last_err = {"error": "request_failed", "code": err}
            http.queue_free()
            await get_tree().create_timer(_backoff_sec(attempt)).timeout
            continue

        var result = await http.request_completed
        http.queue_free()
        var response_code = result[1]
        var response_body = result[3]
        var text = response_body.get_string_from_utf8()
        var parsed = {}
        if text != "":
            parsed = JSON.parse_string(text)
        if response_code >= 200 and response_code < 300:
            return parsed
        if response_code >= 500 and attempt < max_retries:
            await get_tree().create_timer(_backoff_sec(attempt)).timeout
            continue
        return {"error": "http_error", "status": response_code, "body": parsed}

    return last_err

func _backoff_sec(attempt: int) -> float:
    var base = 0.3 * pow(2.0, attempt)
    var jitter = randf() * 0.2
    return min(3.0, base + jitter)


