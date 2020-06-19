
package ton.sdk;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

public class TONSDKForReactNativeModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public TONSDKForReactNativeModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "TONSDKForReactNative";
    }

    @ReactMethod
    public void request(String method, String paramsJson, Callback onResult) {
        TONSDKJsonApi.IResultHandler resultHandler = new TONSDKJsonApi.IResultHandler() {
            private Callback callback;

            TONSDKJsonApi.IResultHandler init(Callback callback) {
                this.callback = callback;
                return this;
            }

            @Override
            public void invoke(String resultJson, String errorJson, int flags) {
                this.callback.invoke(resultJson, errorJson);
            }
        }.init(onResult);
        TONSDKJsonApi.request(method, paramsJson, resultHandler);
    }

    @ReactMethod
    public int coreCreateContext() {
        return TONSDKJsonApi.tc_create_context();
    }

    @ReactMethod
    public void coreDestroyContext(int context) {
        return TONSDKJsonApi.tc_destroy_context(context);
    }

    @ReactMethod
    public void coreRequest(int context, String method, String paramsJson, Callback onResult) {
        TONSDKJsonApi.IResultHandler resultHandler = new TONSDKJsonApi.IResultHandler() {
            private Callback callback;

            TONSDKJsonApi.IResultHandler init(Callback callback) {
                this.callback = callback;
                return this;
            }

            @Override
            public void invoke(String resultJson, String errorJson, int flags) {
                this.callback.invoke(resultJson, errorJson);
            }
        }.init(onResult);
        TONSDKJsonApi.tc_json_request_async(context, method, paramsJson, resultHandler);
    }
}
