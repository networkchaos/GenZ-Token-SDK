#pragma once

#include "CoreMinimal.h"
#include "GenZSDK.generated.h"

USTRUCT(BlueprintType)
struct FGenZOptions
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="GenZ")
    FString BaseUrl;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="GenZ")
    FString ApiKey;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="GenZ")
    int32 TimeoutMs = 10000;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="GenZ")
    int32 MaxRetries = 2;
};

UCLASS(BlueprintType)
class UGenZSDK : public UObject
{
    GENERATED_BODY()

public:
    UFUNCTION(BlueprintCallable, Category="GenZ")
    static UGenZSDK* Create(const FGenZOptions& Options);

    UFUNCTION(BlueprintCallable, Category="GenZ")
    void Initialize();

    UFUNCTION(BlueprintCallable, Category="GenZ|Tokens")
    void Mint(const FString& PlayerId, int32 Amount);

    UFUNCTION(BlueprintCallable, Category="GenZ|Tokens")
    void Transfer(const FString& FromPlayerId, const FString& ToPlayerId, int32 Amount);

    UFUNCTION(BlueprintCallable, Category="GenZ|Wallets")
    void Balance(const FString& PlayerId);

private:
    FGenZOptions Options;
    void RequestWithRetry(const FString& Method, const FString& Path, const FString& BodyJson, TFunction<void(const FString&)> OnSuccess, TFunction<void(const FString&)> OnError, int32 Attempt = 0);
};


