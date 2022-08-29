const https = require('https')
var $ = require('jquery');
const paypal = require('paypal-rest-sdk');

function sortObject(obj) {
	var sorted = {};
	var str = [];
	var key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

//MOMO
exports.MOMO = async (req,res,next)=>{
    var partnerCode = process.env.MOMOpartnerCode;
    var accessKey = process.env.MOMOaccessKey;
    var secretkey = process.env.MOMOsecretkey;
    var requestId = partnerCode + new Date().getTime();
    var orderId = requestId;
    var orderInfo = "Thanh toán đơn hàng";
    var redirectUrl = "https://momo.vn/return";
    var ipnUrl = "https://callback.url/notify";
    var amount = req.body.amount;
    var requestType = "captureWallet"
    var extraData = ""; 
    var rawSignature = "accessKey="+accessKey+"&amount=" + amount+"&extraData=" + extraData+"&ipnUrl=" + ipnUrl+"&orderId=" + orderId+"&orderInfo=" + orderInfo+"&partnerCode=" + partnerCode +"&redirectUrl=" + redirectUrl+"&requestId=" + requestId+"&requestType=" + requestType
    const crypto = require('crypto');
    var signature = crypto.createHmac('sha256', secretkey).update(rawSignature).digest('hex');
  
  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode : partnerCode,
    accessKey : accessKey,
    requestId : requestId,
    amount : amount,
    orderId : orderId,
    orderInfo : orderInfo,
    redirectUrl : redirectUrl,
    ipnUrl : ipnUrl,
    extraData : extraData,
    requestType : requestType,
    signature : signature,
    lang: 'en'
});
//Create the HTTPS objects
const options = {
    hostname: 'test-payment.momo.vn',
    port: 443,
    path: '/v2/gateway/api/create',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody)
    }
}
req = https.request(options, data => {
    data.setEncoding('utf8');
    data.on('data', (body) => {
        console.log('Body: ');
        console.log(JSON.parse(body).payUrl);
        res.redirect(JSON.parse(body).payUrl);
    });
    res.on('end', () => {
        console.log('No more data in response.');
    });
  })
  req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
  });
  // write data to request body
  console.log("Sending....")
  req.write(requestBody);
  req.end();
  }


//VNPAY
exports.VNPAY = async (req,res,next) => {
    var ipAddr = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

var tmnCode = process.env.vnp_TmnCode;
var secretKey = process.env.vnp_HashSecret;
var vnpUrl = process.env.vnp_Url;
var returnUrl = process.env.vnp_ReturnUrl;

var date = new Date();

var createDate = date;
var orderId = tmnCode + new Date().getTime();
var amount = req.body.amount;
var bankCode = req.body.bankCode;

var orderInfo = "Thanh toán đơn hàng";
var orderType = "Thanh toán hóa đơn";
var locale = 'vn';
var currCode = 'VND';
var vnp_Params = {};
vnp_Params['vnp_Version'] = '2.1.0';
vnp_Params['vnp_Command'] = 'pay';
vnp_Params['vnp_TmnCode'] = tmnCode;
// vnp_Params['vnp_Merchant'] = ''
vnp_Params['vnp_Locale'] = locale;
vnp_Params['vnp_CurrCode'] = currCode;
vnp_Params['vnp_TxnRef'] = orderId;
vnp_Params['vnp_OrderInfo'] = orderInfo;
vnp_Params['vnp_OrderType'] = orderType;
vnp_Params['vnp_Amount'] = amount * 100;
vnp_Params['vnp_ReturnUrl'] = returnUrl;
vnp_Params['vnp_IpAddr'] = ipAddr;
vnp_Params['vnp_CreateDate'] = createDate;
if(bankCode !== null && bankCode !== ''){
    vnp_Params['vnp_BankCode'] = bankCode;
}

vnp_Params = sortObject(vnp_Params);

var querystring = require('qs');
var signData = querystring.stringify(vnp_Params, { encode: false });
var crypto = require("crypto");     
var hmac = crypto.createHmac("sha512", secretKey);
var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
vnp_Params['vnp_SecureHash'] = signed;
vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
console.log(vnpUrl)
res.redirect(vnpUrl)
}


