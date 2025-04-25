var OTP_ENCRYPT_PAYLOAD_WT = {
    generateUniqueToken: function () {
        const timestamp = new Date().getTime();
        const randomNumber = Math.floor(Math.random() * 1000000);
        const uniqueToken = `${timestamp}${randomNumber}`;
        return uniqueToken;
    },

    generateSessionToken: function () {
        const token = OTP_ENCRYPT_PAYLOAD_WT.generateUniqueToken();
        const expirationTime = new Date().getTime() + 30 * 60 * 1000; // Token expires in 15 minutes
        return { token, expirationTime };
    },

    isTokenValid: function (tokenInfo) {
        return tokenInfo && tokenInfo.expirationTime > new Date().getTime();
    },

    encryptDataMethod: function (payloadData) {
        const data = CryptoJS.AES.encrypt(
            JSON.stringify(payloadData),
            WT_OTP_ENCRYPTED_DATA_AUTH_TOKEN_VAL
        ).toString();
        return data
    },

    getToken: function () {
        return JSON.parse(localStorage.getItem('sessionToken') || "")
    },

    sendEncryptedData: function (payloadData) {
        var tokenObj = OTP_ENCRYPT_PAYLOAD_WT.getToken();
        var payload = {
            ...JSON.parse(payloadData),
            key : WT_OTP_ENCRYPTED_DATA_KEY_VAL,
            expirationTime : tokenObj.expirationTime,
            extraToken : tokenObj.token
        };
        var apiCallData = OTP_ENCRYPT_PAYLOAD_WT.encryptDataMethod(payload);
        var encrpytion_enabled = "true";

        return JSON.stringify({ data : apiCallData, dataFlag : encrpytion_enabled});
    }
};

var sessionTokenInfo = OTP_ENCRYPT_PAYLOAD_WT.generateSessionToken();
localStorage.setItem('sessionToken', JSON.stringify(sessionTokenInfo));