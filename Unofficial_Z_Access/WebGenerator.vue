<template>
    <center>
        <h2>Web Generator</h2>
        <p>关于这个页面见<a href="../AppsHelp/UZA#o" target="_blank">Unofficial_Z_Access帮助</a></p>
    </center>
    <div id="MAIN">
        <button @click="SaveConfig">Save config</button>
        <button @click="ReadConfig">Read config</button>
        <button @click="CopyInput">CopyInput</button>
        <button @click="CopyOutput">CopyOutput</button>
        <textarea id="DOMAINconfig" rows="10" placeholder="在这里输入你的配置">104.19.112.155
longlivemarxleninmaoism.online
annas-archive.se
zh.annas-archive.se

114.250.70.34
-www.recaptcha.net

104.19.112.156
odysee.com
api.na-backend.odysee.com
api.odysee.com

104.19.113.157
z-library.rs
zh.z-library.rs
reader.z-library.rs
dlz1.fcdn.sk
cdn.croxy.network
apkmirror.com
www.apkmirror.com

104.20.76.252
^www.matrix.org
^matrix.org
^matrix-client.matrix.org

143.244.204.138
^www.croxy.network

193.218.118.42
^libgen.rs

176.123.7.105
^zh.singlelogin.re
^singlelogin.re

20.205.243.166
^github.com</textarea>
        <textarea id="Output" rows="10" readonly placeholder="在左边输入你的配置，并点击下方按钮"></textarea>
        <button @click="CMDConfig">Command Line Switches</button>
        <button @click="AndroidConfig">Android ADB echo</button>
        <button @click="Bat4MSEDGE">Bat4MSEDGE(Win7)</button>
        <button @click="Bat4MSEDGE">Bat4MSEDGE(Win10+)</button>
    </div>
</template>
<script lang="ts" setup>
function CopyInput()
{
    let config = document.getElementById("DOMAINconfig").value;
    if(config==null)
    {
        alert("No input found. ");
        return;
    }
    navigator.clipboard.writeText(config);
    alert("Copied to clipboard.");
}
function CopyOutput()
{
    let output = document.getElementById("Output").value;
    if(output==null)
    {
        alert("No output found. ");
        return;
    }
    navigator.clipboard.writeText(output);
    alert("Copied to clipboard.");
}
function SaveConfig()
{
    let config = document.getElementById("DOMAINconfig").value;
    if(config==null)
    {
        alert("Please wait dom ready. ");
        return;
    }
    localStorage.setItem("UZA_DOMAIN_CONFIG", config);
    alert("Config saved.");
}
function ReadConfig()
{
    let config = localStorage.getItem("UZA_DOMAIN_CONFIG");
    if(config==null)
    {
        alert("Config not found.");
        return;
    }
    document.getElementById("DOMAINconfig").value = config;
}
let HostResolverLine="";
let QUICLine="";
let HostLine="";
let CMDLine="";
function ProcessConfig()
{
    let config:string = document.getElementById("DOMAINconfig").value;
    if(config==null)
    {
        alert("Please wait dom ready. ");
        return "Error";
    }

    HostResolverLine="";
    QUICLine="";
    HostLine="";
    
    let cfg=config.split("\n");
    let cfglen=cfg.length;
    let i=0;

    while(1)
	{
		var IP=cfg[i];
        i++;
        if(IP=="") continue;
		var d=IP;
        var flag=false;
		while(1)
		{
			d=cfg[i];
            i++;
			if(d=="") break;
			else if(!d)
            {
                flag=true;
                break;
            }
			
			if(d[0]=="^")
			{
				d=d.slice(1);
				HostLine=HostLine+"MAP "+d+" "+IP+",";
			}
            else if(d[0]=="-")
			{
				d=d.slice(1);
				HostResolverLine=HostResolverLine+"MAP "+d+" "+IP+":443,";
			}
			else
			{
				HostResolverLine=HostResolverLine+"MAP "+d+" "+IP+":443,";
				QUICLine=QUICLine+d+":443,";
			}
		}
        if(flag) break;	
	}
	
	if(HostResolverLine!="") HostResolverLine=HostResolverLine.slice(0,-1);
	if(QUICLine!="") QUICLine=QUICLine.slice(0,-1);
	if(HostLine!="") HostLine=HostLine.slice(0,-1);

	
	CMDLine="";
	if(HostResolverLine!="") CMDLine=CMDLine+'--host-resolver-rules="'+HostResolverLine+'" ';
	if(QUICLine!="") CMDLine=CMDLine+'-origin-to-force-quic-on='+QUICLine+' ';
	if(HostLine!="") CMDLine=CMDLine+'--host-rules="'+HostLine+'" --ignore-certificate-errors ';
	
	if(CMDLine!="") CMDLine=CMDLine.slice(0,-1);
    return CMDLine;
}
function CMDConfig()
{
    ProcessConfig();
    document.getElementById("Output").value = CMDLine;
}
var AndroidLine="";
function AndroidConfig()
{
    ProcessConfig();
    AndroidLine=CMDLine;
	AndroidLine=AndroidLine.replaceAll('"','\\"');
	AndroidLine='echo "_'+" "+AndroidLine+'" > chrome-command-line';
    document.getElementById("Output").value = AndroidLine;
}
function Bat4MSEDGE()
{
    ProcessConfig();
    let batfile='@echo off\ntaskkill /f /t /im msedge.exe\nstart "" "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe" '+CMDLine+'\n';
    //download as bat file
    let blob = new Blob([batfile], {type: 'text/plain'});
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'UZA_MSEDGE.bat';
    a.click();
}
</script>
<style scoped>
#DOMAINconfig {
    resize: none;
    width: 49%;
    margin-right: 2%;
}

#Output {
    resize: none;
    width: 49%;
}
#MAIN button {
    width: 50%;
    background-color: #39c5bb;
    border: 1px dashed #114514;
    color: #000000;
    cursor: pointer;
    bottom: 0;
}

</style>