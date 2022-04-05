console.log('oauth.js loaded')

oauth={
    href:location.href,
    clientId:'1061219778575-61rsuqnukha35jgbt2hkl8de17sehf4c.apps.googleusercontent.com',
    //proxy:'FHItcw9P8OKx4OtFHpK-F_aQ', // not mandatory
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
        function tabulateParms(profile){
            let h = '<table style="font-family:arial">'
            Object.keys(profile).sort().forEach(k=>{
                if(k!="access_token"){
                    h+=`<tr><td align="right" style="vertical-align:top"><b style="color:maroon">${k}</b>:</td><td style="color:green">${profile[k]}</td></tr>`
                }else{
                    h+=`<tr><td align="right" style="vertical-align:top"><b style="color:maroon">${k}</b>:</td><td><textarea rows=6>${profile[k]}</textarea></td></tr>`
                }
                
            })
            h+="</table>"
            //debugger
            return h
        }
        oauth.parms.clientId=oauth.clientId
        oauth.parms.authURL=oauth.authURL
        oauthDiv.innerHTML=`<p>Your bearer token is now at <i>oauth.parms</i>;<br>It was used below to get your profile information.<br> Your unique Google identifier is highlighted in yellow.</p>
        <img src="${profile.picture}">
        <br>ID: [<span style="background-color:yellow;color:maroon">${profile.id}</span>]
        <br>Bearer Tk: [<span style="color:red">${oauth.parms.access_token.slice(0,20)}...</span>]
        <p style="color:green">${tabulateParms(profile)}</p>
        <p><button onclick="showHideOauth(this)">Show OAuth</button></p>
        <div id="oauthTable" hidden=true>
        ${tabulateParms(oauth.parms)}
        </div>
        `
    }
}
function showHideOauth(that){
    if(oauthTable.hidden){
        oauthTable.hidden=false
        that.textContent="Hide OAuth"
    }else{
        oauthTable.hidden=true
        that.textContent="Show OAuth"
    }
}