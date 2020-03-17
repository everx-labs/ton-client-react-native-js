
#import "TONSDKForReactNative.h"
#import "ton_client.h"

@interface Request: NSObject
@property RCTResponseSenderBlock onResult;
@end

@implementation Request
@end

@implementation TONSDKForReactNative

- (dispatch_queue_t)methodQueue
{
   return dispatch_queue_create("js.react-native.client.ton", DISPATCH_QUEUE_CONCURRENT);
}
RCT_EXPORT_MODULE()

static int nextRequestId = 1;
static dispatch_once_t activeRequestsToken = 0;
static NSMutableDictionary<NSNumber*, Request*>* activeRequests = NULL;

static int createRequest(RCTResponseSenderBlock onResult) {
    dispatch_once(&activeRequestsToken, ^{
        activeRequests = [NSMutableDictionary new];
    });
    Request* request = [[Request alloc] init];
    request.onResult = onResult;
    int requestId = nextRequestId++;
    activeRequests[@(requestId)] = request;
    return requestId;
};

static void releaseRequest(int requestId) {
    dispatch_once(&activeRequestsToken, ^{
        activeRequests = [NSMutableDictionary new];
    });
    [activeRequests removeObjectForKey:@(requestId)];
};

static Request* requestById(int requestId) {
    dispatch_once(&activeRequestsToken, ^{
        activeRequests = [NSMutableDictionary new];
    });
    return activeRequests[@(requestId)];
};

static NSString* stringFromTon(TONSDKUtf8String tonString) {
    if (tonString.len == 0 || tonString.ptr == NULL || *tonString.ptr == 0) {
        return @"";
    }
    return [[NSString alloc] initWithBytes:tonString.ptr length:tonString.len encoding:NSUTF8StringEncoding];
}

static void handleRequest(int32_t requestId, TONSDKUtf8String tonResultJson, TONSDKUtf8String tonErrorJson, int32_t flags) {
    Request* request = requestById(requestId);
    if (request == nil) {
        return;
    }
    NSString* resultJson = stringFromTon(tonResultJson);
    NSString* errorJson = stringFromTon(tonErrorJson);
    request.onResult(@[resultJson, errorJson]);
    if (flags & 1) { // finished
        releaseRequest(requestId);
    }
}


RCT_EXPORT_METHOD(request:(nonnull NSString *)method
                  paramsJson:(nonnull NSString *)paramsJson
                  onResult:(RCTResponseSenderBlock)onResult) {
    int requestId = createRequest(onResult);
    TONSDKUtf8String tonMethod = {(char*)method.UTF8String, method.length};
    TONSDKUtf8String tonParamsJson = {(char*)paramsJson.UTF8String, paramsJson.length};
    ton_sdk_json_rpc_request(&tonMethod, &tonParamsJson, requestId, handleRequest);
}

@end

