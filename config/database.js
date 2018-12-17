if(process.env.NODE_ENV==='production'){

    module.exports={mongoURI:'mongodb://brad:Yahoo123@@ds031203.mlab.com:31203/vidjot-prod'}
}
else{
    module.exports={mongoURI:'mongodb://localhost/vidjot-dev'}
}