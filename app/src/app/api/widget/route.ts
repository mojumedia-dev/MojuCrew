import { NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabaseServer";

function generateWidget(
  key: string,
  apiBase: string,
  bizName: string,
  greeting: string,
  captureLeads: boolean,
  brandColor: string
): string {
  const c = brandColor || "#111111";
  return `(function(){
  if(document.getElementById('_mc_w'))return;
  var KEY="${key}",API="${apiBase}",BIZ=${JSON.stringify(bizName)},GREETING=${JSON.stringify(greeting)},CAPTURE=${captureLeads};
  var msgs=[],leadInfo=null,open=false;

  /* ── Styles ── */
  var s=document.createElement('style');
  s.textContent='#_mc_w{position:fixed;bottom:24px;right:24px;z-index:2147483647;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}'
  +'#_mc_btn{width:56px;height:56px;border-radius:50%;background:${c};border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(0,0,0,.3);transition:transform .2s,box-shadow .2s}'
  +'#_mc_btn:hover{transform:scale(1.08);box-shadow:0 6px 24px rgba(0,0,0,.35)}'
  +'#_mc_btn svg{width:24px;height:24px;fill:white}'
  +'#_mc_panel{position:absolute;bottom:72px;right:0;width:360px;max-width:calc(100vw - 32px);background:#fff;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.2);display:none;flex-direction:column;overflow:hidden;border:1px solid rgba(0,0,0,.08)}'
  +'#_mc_hdr{background:${c};color:#fff;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;gap:8px}'
  +'#_mc_hdr_info{display:flex;align-items:center;gap:10px}'
  +'#_mc_avatar{width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.25);display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}'
  +'#_mc_hdr_text{display:flex;flex-direction:column}'
  +'#_mc_hdr_name{font-size:14px;font-weight:600;line-height:1.2}'
  +'#_mc_hdr_status{font-size:11px;opacity:.8}'
  +'#_mc_close{background:none;border:none;color:rgba(255,255,255,.8);font-size:22px;cursor:pointer;line-height:1;padding:0;flex-shrink:0}'
  +'#_mc_close:hover{color:#fff}'
  +'#_mc_msgs{flex:1;overflow-y:auto;padding:16px;min-height:240px;max-height:300px;display:flex;flex-direction:column;gap:10px;background:#fafafa}'
  +'.mc_msg{max-width:80%;padding:10px 13px;border-radius:14px;font-size:13px;line-height:1.5;word-wrap:break-word}'
  +'.mc_bot{background:#fff;color:#1a1a1a;align-self:flex-start;border-bottom-left-radius:4px;box-shadow:0 1px 4px rgba(0,0,0,.08)}'
  +'.mc_usr{background:${c};color:#fff;align-self:flex-end;border-bottom-right-radius:4px}'
  +'.mc_typing{color:#aaa;font-size:12px;padding:2px 0;align-self:flex-start}'
  +'#_mc_lead{padding:14px 16px;border-top:1px solid #f0f0f0;background:#fff;display:none;flex-direction:column;gap:8px}'
  +'#_mc_lead p{font-size:12px;color:#666;margin:0}'
  +'#_mc_lead input{border:1px solid #e5e5e5;border-radius:8px;padding:9px 12px;font-size:13px;width:100%;box-sizing:border-box;outline:none;transition:border-color .2s}'
  +'#_mc_lead input:focus{border-color:${c}}'
  +'#_mc_lead button{background:${c};color:#fff;border:none;border-radius:8px;padding:10px;font-size:13px;font-weight:600;cursor:pointer}'
  +'#_mc_inp_row{padding:10px 12px;border-top:1px solid #f0f0f0;background:#fff;display:flex;gap:8px;align-items:flex-end}'
  +'#_mc_inp{flex:1;border:1px solid #e5e5e5;border-radius:10px;padding:9px 12px;font-size:13px;outline:none;resize:none;height:36px;line-height:18px;transition:border-color .2s;font-family:inherit}'
  +'#_mc_inp:focus{border-color:${c}}'
  +'#_mc_send{background:${c};color:#fff;border:none;border-radius:10px;padding:0 16px;height:36px;font-size:13px;cursor:pointer;font-weight:600;flex-shrink:0;transition:opacity .2s}'
  +'#_mc_send:disabled{opacity:.4;cursor:default}'
  +'#_mc_footer{padding:6px 12px;text-align:center;border-top:1px solid #f5f5f5;background:#fff}'
  +'#_mc_footer a{font-size:10px;color:#bbb;text-decoration:none;letter-spacing:.3px}'
  +'#_mc_footer a:hover{color:#888}';
  document.head.appendChild(s);

  /* ── HTML ── */
  var w=document.createElement('div');
  w.id='_mc_w';
  w.innerHTML='<button id="_mc_btn" aria-label="Chat"><svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg></button>'
  +'<div id="_mc_panel">'
  +'<div id="_mc_hdr"><div id="_mc_hdr_info"><div id="_mc_avatar">&#x1F4AC;</div><div id="_mc_hdr_text"><span id="_mc_hdr_name">'+BIZ+'</span><span id="_mc_hdr_status">Online</span></div></div><button id="_mc_close">&#xD7;</button></div>'
  +'<div id="_mc_msgs"></div>'
  +(CAPTURE?'<div id="_mc_lead"><p>Please share your name and email to get started.</p><input id="_mc_lname" placeholder="Your name"/><input id="_mc_lemail" type="email" placeholder="your@email.com"/><button id="_mc_lsub">Start chatting</button></div>':'')
  +'<div id="_mc_inp_row"><textarea id="_mc_inp" placeholder="Type a message..." rows="1"></textarea><button id="_mc_send">Send</button></div>'
  +'<div id="_mc_footer"><a href="https://mojucrew.com" target="_blank">Powered by MojuCrew</a></div>'
  +'</div>';
  document.body.appendChild(w);

  /* ── Helpers ── */
  var msgsEl=document.getElementById('_mc_msgs');
  var inpEl=document.getElementById('_mc_inp');
  var sendBtn=document.getElementById('_mc_send');
  var panel=document.getElementById('_mc_panel');
  var leadEl=document.getElementById('_mc_lead');
  var inpRow=document.getElementById('_mc_inp_row');

  function addMsg(role,text){
    var d=document.createElement('div');
    d.className='mc_msg '+(role==='assistant'?'mc_bot':'mc_usr');
    d.textContent=text;
    msgsEl.appendChild(d);
    msgsEl.scrollTop=msgsEl.scrollHeight;
    return d;
  }

  function showTyping(){
    var d=document.createElement('div');
    d.className='mc_typing';d.id='_mc_typing';d.textContent='Typing…';
    msgsEl.appendChild(d);msgsEl.scrollTop=msgsEl.scrollHeight;
  }

  function removeTyping(){var t=document.getElementById('_mc_typing');if(t)t.remove();}

  function send(text){
    if(!text.trim())return;
    addMsg('user',text);
    msgs.push({role:'user',content:text});
    inpEl.value='';
    sendBtn.disabled=true;
    showTyping();
    fetch(API+'/api/chat',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({key:KEY,messages:msgs,leadInfo:leadInfo})
    }).then(function(r){return r.json();}).then(function(d){
      removeTyping();
      var reply=d.reply||'Sorry, something went wrong.';
      addMsg('assistant',reply);
      msgs.push({role:'assistant',content:reply});
      sendBtn.disabled=false;
    }).catch(function(){
      removeTyping();
      addMsg('assistant','Sorry, unable to connect. Please try again.');
      sendBtn.disabled=false;
    });
  }

  /* ── Events ── */
  document.getElementById('_mc_btn').addEventListener('click',function(){
    open=!open;
    panel.style.display=open?'flex':'none';
    if(open&&msgs.length===0){
      if(CAPTURE){
        addMsg('assistant',GREETING);
        msgs.push({role:'assistant',content:GREETING});
        leadEl.style.display='flex';
        inpRow.style.display='none';
      } else {
        addMsg('assistant',GREETING);
        msgs.push({role:'assistant',content:GREETING});
      }
    }
  });

  document.getElementById('_mc_close').addEventListener('click',function(){
    open=false;panel.style.display='none';
  });

  if(CAPTURE){
    document.getElementById('_mc_lsub').addEventListener('click',function(){
      var name=document.getElementById('_mc_lname').value.trim();
      var email=document.getElementById('_mc_lemail').value.trim();
      if(!name||!email){alert('Please enter your name and email.');return;}
      leadInfo={name:name,email:email};
      leadEl.style.display='none';
      inpRow.style.display='flex';
      addMsg('assistant','Nice to meet you, '+name+'! How can I help you today?');
      msgs.push({role:'assistant',content:'Nice to meet you, '+name+'! How can I help you today?'});
    });
  }

  sendBtn.addEventListener('click',function(){send(inpEl.value);});
  inpEl.addEventListener('keydown',function(e){
    if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send(inpEl.value);}
  });
})();`;
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");

  if (!key) {
    return new Response("// Missing key", {
      status: 400,
      headers: { "Content-Type": "application/javascript" },
    });
  }

  const supabase = createServerSupabase();
  const { data: rows } = await supabase
    .from("bot_configs")
    .select("config")
    .eq("bot_id", "chat");

  const row = rows?.find(
    (r) => (r.config as Record<string, unknown>).chatKey === key
  );

  if (!row) {
    return new Response(`console.error('[MojuChat] Widget key not found: ${key}');`, {
      status: 200,
      headers: { "Content-Type": "application/javascript", "Cache-Control": "no-cache" },
    });
  }

  const config = row.config as Record<string, unknown>;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const bizName = (config.businessName as string) ?? "Chat";
  const greeting = (config.greeting as string) || `Hi! This is the assistant for ${bizName}. How can I help you today?`;
  const captureLeads = !!(config.captureLeads as boolean);
  const brandColor = (config.brandColor as string) || "#111111";

  const js = generateWidget(key, appUrl, bizName, greeting, captureLeads, brandColor);

  return new Response(js, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
