package ton.sdk;

public class TONSDKJsonApi {
    static {
        System.loadLibrary("tonclient");
    }

    public interface IResultHandler {
        void invoke(String resultJson, String errorJson, int flags);
    }

    public static native int createContext();
    public static native void destroyContext(int context);
    public static native void jsonRequestAsync(int context, String method, String paramsJson, IResultHandler onResult);

    // Obsolete. For backward compatibility only.
    public static native void request(String method, String paramsJson, IResultHandler onResult);

}
