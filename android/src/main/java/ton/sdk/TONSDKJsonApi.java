package ton.sdk;

public class TONSDKJsonApi {
    static {
        System.loadLibrary("tonsdk");
    }

    public interface IResultHandler {
        void invoke(String resultJson, String errorJson, int flags);
    }

    public static native int tc_create_context();
    public static native void tc_destroy_context(int context);
    public static native void tc_json_request_async(int context, String method, String paramsJson, IResultHandler onResult);

    // Obsolete. For backward compatibility only.
    public static native void request(String method, String paramsJson, IResultHandler onResult);

}
