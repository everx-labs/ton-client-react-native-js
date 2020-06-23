
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
    return dispatch_queue_create("js.react-native.client.ton", DISPATCH_QUEUE_SERIAL);
}
RCT_EXPORT_MODULE()

static dispatch_once_t coreContextsToken = 0;
static NSMutableDictionary<NSNumber*, NSNumber*>* coreContexts = NULL;

static int nextRequestId = 1;
static dispatch_once_t activeRequestsToken = 0;
static NSMutableDictionary<NSNumber*, Request*>* activeRequests = NULL;

static int ensureCoreContext(int context) {
    dispatch_once(&coreContextsToken, ^{
        coreContexts = [NSMutableDictionary new];
    });
    NSNumber* coreContext = coreContexts[@(context)];
    if (!coreContext) {
        coreContext = @(tc_create_context());
        coreContexts[@(context)] = coreContext;
    }
    return coreContext.intValue;
};

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

static Request* requestById(int requestId) {
    dispatch_once(&activeRequestsToken, ^{
        activeRequests = [NSMutableDictionary new];
    });
    return activeRequests[@(requestId)];
};

static void releaseRequest(int requestId) {
    dispatch_once(&activeRequestsToken, ^{
        activeRequests = [NSMutableDictionary new];
    });
    [activeRequests removeObjectForKey:@(requestId)];
};

static NSString* stringFromTon(InteropString tonString) {
    if (tonString.len == 0 || tonString.content == NULL || *tonString.content == 0) {
        return @"";
    }
    return [[NSString alloc] initWithBytes:tonString.content length:tonString.len encoding:NSUTF8StringEncoding];
}

static void handleRequest(int32_t requestId, InteropString tonResultJson, InteropString tonErrorJson, int32_t flags) {
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


RCT_EXPORT_METHOD(coreRequest: (int)context
                  method:(nonnull NSString *)method
                  paramsJson:(nonnull NSString *)paramsJson
                  onResult:(RCTResponseSenderBlock)onResult) {
    int requestId = createRequest(onResult);
    InteropString tonMethod = {(char*)method.UTF8String, method.length};
    InteropString tonParamsJson = {(char*)paramsJson.UTF8String, paramsJson.length};
    tc_json_request_async(ensureCoreContext(context), tonMethod, tonParamsJson, requestId, handleRequest);
}

RCT_EXPORT_METHOD(coreDestroyContext: (int)context) {
    dispatch_once(&coreContextsToken, ^{
        coreContexts = [NSMutableDictionary new];
    });
    NSNumber* coreContext = coreContexts[@(context)];
    if (coreContext) {
        [coreContexts removeObjectForKey:@(context)];
        tc_destroy_context(coreContext.intValue);
    }
}

RCT_EXPORT_METHOD(request:(nonnull NSString *)method
                  paramsJson:(nonnull NSString *)paramsJson
                  onResult:(RCTResponseSenderBlock)onResult) {
    int requestId = createRequest(onResult);
    InteropString tonMethod = {(char*)method.UTF8String, method.length};
    InteropString tonParamsJson = {(char*)paramsJson.UTF8String, paramsJson.length};
    tc_json_request_async(ensureCoreContext(1), tonMethod, tonParamsJson, requestId, handleRequest);
}

@end

