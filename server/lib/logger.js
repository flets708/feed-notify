module.exports = (event, reqId, type) => {
  const date = new Date(Date.now() + (9 * 60) * 60 * 1000).toISOString()

  if(event.requestContext){
    const ipaddress = event.requestContext.identity.sourceIp ||
      "0.0.0.0"
    const method = event.httpMethod
    const url = event.requestContext.path
    const ua = event.requestContext.identity.userAgent

    console.log(`${ipaddress} [${date}] "${method} ${url}" reqId:${reqId} type:${type} - ${ua}`);
  }else{
    console.log(`Event Bridge Invoked [${date}] reqId:${reqId} type:${type}`);
  };
}