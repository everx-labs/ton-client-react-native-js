
Pod::Spec.new do |s|
  s.name         = "TONSDKForReactNative"
  s.version      = "0.9.0"
  s.summary      = "TON SDK for React Native"
  s.description  = <<-DESC
                  TON SDK for React Native
                   DESC
  s.homepage     = "https://github.com/tonlabs/ton-sdk-react-native"
  s.license      = "MIT"
  s.author             = { "author" => "sdk@tonlabs.io" }
  s.platform     = :ios, "7.0"
  s.source       = { :git => "https://github.com/tonlabs/ton-sdk-react-native.git", :tag => "master" }
  s.source_files  = "sdk/*.h", "ios/**/*.{h,m}"
  s.ios.vendored_library = "ios/libtonsdk.a"

  s.requires_arc = true
  s.dependency "React"
end


