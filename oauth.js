console.log('oauth.js loaded')

oauth={
    href:location.href,
    clientId:'1061219778575-61rsuqnukha35jgbt2hkl8de17sehf4c.apps.googleusercontent.com',
    proxy:'FHItcw9P8OKx4OtFHpK-F_aQ',
    authURL: 'https://accounts.google.com/o/oauth2/auth'
}

oauth.start=function(){
    oauthDiv.innerHTML=''
    location.href=`${oauth.authURL}?response_type=token&scope=profile&client_id=${oauth.clientId}&redirect_uri=${oauth.href}`
    //location.href="https://accounts.google.com/o/oauth2/auth/oauthchooseaccount?response_type=token&client_id=972537320227-dipecl4g8mftumf2edelamfrf76tolok.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fapi.firecloud.org%2Foauth2-redirect.html&scope=profile&state=V2VkIE9jdCAyMSAyMDIwIDIzOjExOjAxIEdNVC0wNDAwIChFYXN0ZXJuIERheWxpZ2h0IFRpbWUp&realm=broad-dsde-prod&flowName=GeneralOAuthFlow"
}

oauth.getParms=txt=>{
    oauth.parms={}
    txt.split('&').forEach(av=>{
        av=av.split('=')
        oauth.parms[av[0]]=av[1]
    })
}


window.onload=async function(){
    if(location.hash.match('token_type=Bearer')){
        oauth.getParms(location.hash.slice(1))
        // get the user profile
        let url="https://www.googleapis.com/oauth2/v1/userinfo?alt=json";
        let profile =await (await fetch(url,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${oauth.parms.access_token}`,
            }
        })).json()
        oauthDiv.innerHTML=`<p>Your bearer token is now available at <i>oauth.parms</i>. Your profile information:</p>
        <p style="color:green">${JSON.stringify(profile,null,3)}</p>`
    }
}
