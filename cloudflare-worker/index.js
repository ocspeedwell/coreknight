const SERVICES = new Set(['Software Engineering','AI & Analytics','Enterprise SaaS','Digital Infrastructure','NARDTOPUS','Other Enquiry']);
const json = (data,status=200,origin='https://coreknight.com') => new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Access-Control-Allow-Origin':origin,'Vary':'Origin','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const clean = (v,max) => typeof v==='string' ? v.trim().slice(0,max+1) : '';
const escapeHtml = s => s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export default {
  async fetch(request,env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = new Set(['https://coreknight.com','https://www.coreknight.com']);
    if (request.method==='OPTIONS') {
      if (!allowed.has(origin)) return new Response(null,{status:403});
      return new Response(null,{status:204,headers:{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'86400','Vary':'Origin'}});
    }
    if (request.method!=='POST') return json({ok:false,error:'Method not allowed'},405);
    if (!allowed.has(origin)) return json({ok:false,error:'Origin not allowed'},403);
    const ct=request.headers.get('Content-Type')||'';
    if (!ct.startsWith('application/json')) return json({ok:false,error:'JSON required'},415,origin);
    const length=Number(request.headers.get('Content-Length')||0);
    if(length>12000) return json({ok:false,error:'Payload too large'},413,origin);
    let body;try {const raw=await request.text(); if(raw.length>12000) return json({ok:false,error:'Payload too large'},413,origin); body=JSON.parse(raw)}catch{return json({ok:false,error:'Invalid JSON'},400,origin)}
    if(!body || typeof body!=='object' || Array.isArray(body)) return json({ok:false,error:'Invalid data'},400,origin);
    const name=clean(body.name,120),email=clean(body.email,254),organisation=clean(body.organisation,150),service=clean(body.service,100),message=clean(body.message,5000),token=clean(body.turnstileToken,4096);
    if(body.website) return json({ok:true},200,origin);
    if(name.length<2||name.length>120||!/^\S+@\S+\.\S+$/.test(email)||email.length>254||organisation.length>150||!SERVICES.has(service)||message.length<10||message.length>5000||!token) return json({ok:false,error:'Please check the form fields'},400,origin);
    if(!env.TURNSTILE_SECRET_KEY||!env.RESEND_API_KEY) return json({ok:false,error:'Server not configured'},503,origin);
    const ip=request.headers.get('CF-Connecting-IP')||'';
    const verifyBody=new FormData();verifyBody.append('secret',env.TURNSTILE_SECRET_KEY);verifyBody.append('response',token);if(ip)verifyBody.append('remoteip',ip);
    let verify; try {verify=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:verifyBody})} catch {return json({ok:false,error:'Verification unavailable'},503,origin)}
    if(!verify.ok) return json({ok:false,error:'Verification unavailable'},503,origin);
    const result=await verify.json();
    if(!result.success || !['coreknight.com','www.coreknight.com'].includes(result.hostname)) return json({ok:false,error:'Security verification failed'},403,origin);
    const html=`<h2>New CoreKnight Website Enquiry</h2><p><b>Name:</b> ${escapeHtml(name)}</p><p><b>Email:</b> ${escapeHtml(email)}</p><p><b>Organisation:</b> ${escapeHtml(organisation)}</p><p><b>Service:</b> ${escapeHtml(service)}</p><p><b>Message:</b></p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`;
    let sent; try {sent=await fetch('https://api.resend.com/emails',{method:'POST',headers:{'Authorization':`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:'CoreKnight Website <contact@mail.coreknight.com>',to:['hello@coreknight.com'],reply_to:email,subject:`Website enquiry: ${service}`,html})})} catch {return json({ok:false,error:'Email service unavailable'},502,origin)}
    if(!sent.ok){console.error('Email provider rejected request',sent.status);return json({ok:false,error:'Email delivery failed'},502,origin)}
    return json({ok:true},200,origin);
  }
};
