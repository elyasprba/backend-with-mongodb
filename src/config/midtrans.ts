import midtransClient from 'midtrans-client';

const midtrans = new midtransClient.Snap({
  isProduction: false, // change to true when go live
  serverKey: process.env.YOUR_MIDTRANS_SERVER_KEY as string,
  clientKey: process.env.YOUR_MIDTRANS_CLIENT_KEY as string,
});

export default midtrans;
