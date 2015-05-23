com.darkoverlordofdata.asteroids.MainActivity

keytool -list -printcert -jarfile ./CustomCocoonJSLauncher_2015_05_20-21_34_27_GooglePlaystoreV3_debug_signed.apk | grep -Po "(?<=SHA1:) .*" |  xxd -r -p | openssl base64
