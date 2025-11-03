#include "GenZSDK.h"
#include "HttpModule.h"
#include "Interfaces/IHttpRequest.h"
#include "Interfaces/IHttpResponse.h"

UGenZSDK* UGenZSDK::Create(const FGenZOptions& InOptions)
{
    UGenZSDK* Instance = NewObject<UGenZSDK>();
    Instance->Options = InOptions;
    return Instance;
}

void UGenZSDK::Initialize()
{
    RequestWithRetry(TEXT("GET"), TEXT("/v1/health"), TEXT(""), [](const FString&){}, [](const FString&){});
}

void UGenZSDK::Mint(const FString& PlayerId, int32 Amount)
{
    const FString Body = FString::Printf(TEXT("{\"playerId\":\"%s\",\"amount\":%d}"), *PlayerId, Amount);
    RequestWithRetry(TEXT("POST"), TEXT("/v1/tokens/mint"), Body, [](const FString&) {}, [](const FString&) {});
}

void UGenZSDK::Transfer(const FString& FromPlayerId, const FString& ToPlayerId, int32 Amount)
{
    const FString Body = FString::Printf(TEXT("{\"fromPlayerId\":\"%s\",\"toPlayerId\":\"%s\",\"amount\":%d}"), *FromPlayerId, *ToPlayerId, Amount);
    RequestWithRetry(TEXT("POST"), TEXT("/v1/tokens/transfer"), Body, [](const FString&) {}, [](const FString&) {});
}

void UGenZSDK::Balance(const FString& PlayerId)
{
    RequestWithRetry(TEXT("GET"), FString::Printf(TEXT("/v1/wallets/%s/balance"), *FGenericPlatformHttp::UrlEncode(PlayerId)), TEXT(""), [](const FString&) {}, [](const FString&) {});
}

void UGenZSDK::RequestWithRetry(const FString& Method, const FString& Path, const FString& BodyJson, TFunction<void(const FString&)> OnSuccess, TFunction<void(const FString&)> OnError, int32 Attempt)
{
    const FString Url = Options.BaseUrl.TrimEnd() + Path;
    TSharedRef<IHttpRequest, ESPMode::ThreadSafe> Request = FHttpModule::Get().CreateRequest();
    Request->SetURL(Url);
    Request->SetVerb(Method);
    Request->SetHeader(TEXT("Content-Type"), TEXT("application/json"));
    if (!Options.ApiKey.IsEmpty())
    {
        Request->SetHeader(TEXT("Authorization"), FString::Printf(TEXT("Bearer %s"), *Options.ApiKey));
    }
    if (!BodyJson.IsEmpty())
    {
        Request->SetContentAsString(BodyJson);
    }

    Request->OnProcessRequestComplete().BindLambda([this, Method, Path, BodyJson, OnSuccess, OnError, Attempt](FHttpRequestPtr Req, FHttpResponsePtr Res, bool bSucceeded)
    {
        if (!bSucceeded || !Res.IsValid())
        {
            if (Attempt < Options.MaxRetries)
            {
                RequestWithRetry(Method, Path, BodyJson, OnSuccess, OnError, Attempt + 1);
                return;
            }
            OnError(TEXT("Network error"));
            return;
        }

        const int32 Code = Res->GetResponseCode();
        if (Code >= 200 && Code < 300)
        {
            OnSuccess(Res->GetContentAsString());
            return;
        }

        if (Code >= 500 && Attempt < Options.MaxRetries)
        {
            RequestWithRetry(Method, Path, BodyJson, OnSuccess, OnError, Attempt + 1);
            return;
        }
        OnError(FString::Printf(TEXT("HTTP %d: %s"), Code, *Res->GetContentAsString()));
    });

    Request->ProcessRequest();
}


