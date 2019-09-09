package ton.sdk;

public class TONSDKJsonApi {
    static {
        System.loadLibrary("tonsdk");
    }

    public interface IResultHandler {
        void invoke(String resultJson, String errorJson, int flags);
    }

    public static native void request(String method, String paramsJson, IResultHandler onResult);
}
