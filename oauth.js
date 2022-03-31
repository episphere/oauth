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


window.onload=async function(){ // check for oauth dance
    if(location.hash.match('token_type=Bearer')){ // if this is the end of the oauth dance
        // red parms
        oauth.getParms(location.hash.slice(1))
        // clean hash
        location.hash=''
        // get the user profile
        let url="https://www.googleapis.com/oauth2/v1/userinfo?alt=json";
        let profile =await (await fetch(url,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${oauth.parms.access_token}`,
            }
        })).json()
        function listProfile(profile){
            let h = '<table style="max-width:100%;table-layout:fixed">'
            Object.keys(profile).sort().forEach(k=>{
                h+=`<tr><td align="right" style="vertical-align:top"><b style="color:maroon">${k}</b>:</td><td style="color:green">${profile[k]}</td></tr>`
            })
            h+="</table>"
            //debugger
            return h
        }
        oauthDiv.innerHTML=`<p>Your bearer token is now at <i>oauth.parms</i>;<br>I used it to get your profile information:</p>
        <img src="${profile.picture}">
        <br>[<span style="background-color:yellow;color:maroon">${profile.id}</span>]
        <p style="color:green">${listProfile(profile)}</p>`
    }
}
