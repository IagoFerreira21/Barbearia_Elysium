const $=s=>document.querySelector(s),L=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}},W=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
const R=n=>'R$ '+Number(n).toFixed(2).replace('.',','),pad=n=>String(n).padStart(2,'0');
const ymd=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()),today=()=>ymd(new Date());
const tm=m=>pad(Math.floor(m/60))+':'+pad(m%60),mn=t=>t.split(':')[0]*60+ +t.split(':')[1];
const SL=[];for(let m=480;m<1110;m+=30)SL.push(tm(m));
let D=L('bb',null)||{shop:{name:'Minha Barbearia',wa:'',addr:'',about:'Corte, barba e estilo. Agende seu horário online.',photos:[]},services:[{id:1,n:'Corte',p:40,m:30},{id:2,n:'Barba',p:30,m:30},{id:3,n:'Corte + Barba',p:65,m:60}],pros:[{id:1,n:'Barbeiro 1'}],clients:[],appts:[],blocks:[]};
let U=L('bbu',[]),ses=L('bbs',null),view=ses?'app':'home',tab='painel',day=today(),P=0,am='in',inst=null;
if(!U.length){U=[{m:'demo@barbearia.com',p:'1234'}];W('bbu',U)}
D.shop.logo=D.shop.logo||'';D.cuts=D.cuts||[];D.shop.ig=D.shop.ig||'';
if(D.shop.name=='Minha Barbearia'){Object.assign(D.shop,{name:'Barbearia Elysium',wa:'5579998172709',addr:'Largo Tobias Barreto, nº 8, Centro, Itabaianinha/SE (ao lado do Colégio Criativo)',about:'Cuide do seu visual. Ambiente climatizado e atendimento com hora marcada.',logo:'logo.png',ig:'barbeariaelysium'});if(!D.cuts.length)D.cuts=[{id:1,img:'cut1.jpg',t:'Degradê'},{id:2,img:'cut2.jpg',t:'Degradê com barba'}];W('bb',D)}
if(D.shop.wa=='557998172709'){D.shop.wa='5579998172709';W('bb',D)}
const save=()=>W('bb',D),svc=id=>D.services.find(s=>s.id==id)||{n:'(removido)',p:0,m:30},pr=id=>(D.pros.find(s=>s.id==id)||{n:'(removido)'}).n,nid=a=>a.reduce((m,x)=>Math.max(m,x.id),0)+1;
function taken(d,p){let s={};D.appts.filter(a=>a.d==d&&a.pid==p&&a.st!='cancelado').forEach(a=>{for(let i=0;i<Math.ceil(svc(a.sid).m/30);i++)s[tm(mn(a.t)+i*30)]=a});D.blocks.filter(b=>b.d==d&&b.pid==p).forEach(b=>{s[b.t]=s[b.t]||'B'});return s}
function free(d,p,sid){let s=taken(d,p),n=Math.ceil(svc(sid).m/30),now=new Date();return SL.filter(t=>{for(let i=0;i<n;i++){let x=tm(mn(t)+i*30);if(!SL.includes(x)||s[x])return false}return !(d==today()&&mn(t)<=now.getHours()*60+now.getMinutes())})}
function mk(d,t,pid,sid,c,ph,st){D.appts.push({id:nid(D.appts),d,t,pid:+pid,sid:+sid,c,ph,v:svc(sid).p,st:st||'agendado'});if(!D.clients.some(x=>x.n.toLowerCase()==c.toLowerCase()))D.clients.push({id:nid(D.clients),n:c,ph:ph||''});save()}
function wa(m){let n=(D.shop.wa||'').replace(/\D/g,'');if(!n){alert('WhatsApp da barbearia não configurado. Entre no painel > Perfil e informe o número.');return false}window.open('https://wa.me/'+(n.length<=11?'55'+n:n)+'?text='+encodeURIComponent(m),'_blank');return false}
function go(){$('#app').innerHTML=view=='home'?home():view=='auth'?auth():appv();if(view=='home')fillT();if(inst&&$('#ins'))$('#ins').hidden=false}
/* ---------- site público ---------- */
function home(){let s=D.shop,o=a=>a.map(x=>`<option value=${x.id}>${esc(x.n)}</option>`).join('');return `<div class=w style="max-width:520px">
<div class=r>${ses?`<button class="b s m" onclick="view='app';go()">Painel</button>`:`<button class="b s m" onclick="view='auth';go()">Área do barbeiro</button>`}<span></span></div>
<div class=hero><div class=logo>${s.logo?`<img src="${s.logo}" alt="Logo">`:'✂'}</div><h1>${esc(s.name)}</h1><p>${esc(s.about)}</p>${s.addr?`<p><span class=tag>${esc(s.addr)}</span></p>`:''}<div class=acts><a class=b href="#bk">Agendar horário</a>${s.ig?`<a class="b s" target=_blank rel=noopener href="https://instagram.com/${esc(s.ig)}">Instagram</a>`:''}${s.addr?`<a class="b s" target=_blank rel=noopener href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(s.addr)}">Como chegar</a>`:''}</div></div>
<h2>Serviços</h2><div class=c>${D.services.map(x=>`<div class=r><span>${x.img?`<img class=th src="${x.img}" alt="">`:''}${esc(x.n)} <small class=tag>${x.m} min</small></span><b>${R(x.p)}</b></div>`).join('')}</div>
${D.cuts.length?`<h2>Nossos cortes</h2><div class=ph>${D.cuts.map(c=>`<figure><img src="${c.img}" alt="${esc(c.t)}">${c.t?`<figcaption>${esc(c.t)}</figcaption>`:''}</figure>`).join('')}</div>`:''}
${s.photos.length?`<h2>Nosso espaço</h2><div class=ph>${s.photos.map(p=>`<figure><img src="${p}" alt="Foto da barbearia"></figure>`).join('')}</div>`:''}
<h2 id=bk>Agendar horário</h2><form class=c onsubmit="return book(event)">
<label>Serviço<select id=bs onchange=fillT()>${o(D.services)}</select></label>
<label>Profissional<select id=bp onchange=fillT()>${o(D.pros)}</select></label>
<label>Data<input id=bd type=date min=${today()} value=${today()} onchange=fillT() required></label>
<label>Horário<select id=bt required></select></label>
<label>Seu nome<input id=bn required></label><label>Seu WhatsApp<input id=bph type=tel required></label>
<button class=b>Agendar e avisar no WhatsApp</button></form><div style="height:70px"></div></div>
<a class=wa href="#" onclick="return wa('Olá! Gostaria de agendar um horário.')">WhatsApp</a>`}
function fillT(){if(!$('#bt'))return;let f=free($('#bd').value,$('#bp').value,$('#bs').value);$('#bt').innerHTML=f.length?f.map(t=>`<option>${t}</option>`).join(''):'<option value="">Sem horários neste dia</option>'}
function book(e){e.preventDefault();let sid=+$('#bs').value,pid=+$('#bp').value,d=$('#bd').value,t=$('#bt').value,n=$('#bn').value;if(!t){alert('Sem horários neste dia. Escolha outra data.');return false}mk(d,t,pid,sid,n,$('#bph').value);wa(`Olá! Sou ${n}. Agendei ${svc(sid).n} com ${pr(pid)} no dia ${d.split('-').reverse().join('/')} às ${t}.`);alert('Agendamento salvo!');fillT();return false}
/* ---------- login fictício ---------- */
function auth(){return `<div class=w style="max-width:400px"><h1>${am=='in'?'Entrar':'Criar conta'}</h1><form class=c onsubmit="return doAuth(event)">${am=='up'?'<label>Nome da barbearia<input id=an required></label><label>WhatsApp com DDD<input id=aw type=tel required></label>':''}
<label>E-mail<input id=ae type=email required></label><label>Senha<input id=ap type=password minlength=4 required></label><button class=b>${am=='in'?'Entrar':'Cadastrar'}</button></form>
<p><a href="#" onclick="am=am=='in'?'up':'in';go();return false">${am=='in'?'Criar conta':'Já tenho conta'}</a> &nbsp; <a href="#" onclick="view='home';go();return false">Voltar ao site</a></p></div>`}
function doAuth(e){e.preventDefault();let m=$('#ae').value.toLowerCase(),p=$('#ap').value;if(am=='up'){if(U.some(u=>u.m==m)){alert('Este e-mail já está cadastrado.');return false}U.push({m,p});W('bbu',U);D.shop.name=$('#an').value;D.shop.wa=$('#aw').value;save()}else if(!U.some(u=>u.m==m&&u.p==p)){alert('E-mail ou senha incorretos.');return false}ses=m;W('bbs',m);view='app';tab='painel';go();return false}
/* ---------- painel ---------- */
const T=[['painel','Painel'],['agenda','Agenda'],['servicos','Serviços'],['pros','Profissionais'],['clientes','Clientes'],['fat','Faturamento'],['perfil','Perfil']];
function appv(){return `<nav>${T.map(t=>`<button class="b m ${tab==t[0]?'':'s'}" onclick="tab='${t[0]}';go()">${t[1]}</button>`).join('')}<button class="b s m" onclick="view='home';go()">Ver site</button><button class="b s m" onclick="ses=null;localStorage.removeItem('bbs');view='home';go()">Sair</button><button id=ins class="b m" hidden onclick="inst&&inst.prompt()">Instalar app</button></nav><div class=w>${V[tab]()}</div>`}
const rv=a=>a.reduce((s,x)=>s+x.v,0);
function painel(){let t=today(),ap=D.appts.filter(a=>a.d==t&&a.st!='cancelado').sort((a,b)=>a.t<b.t?-1:1),dn=D.appts.filter(a=>a.st=='concluido');return `<h2>Painel</h2>${linkCard()}<div class=g>
<div class=c>Hoje<div class=k>${ap.length}</div>agendamentos</div><div class=c>Faturado hoje<div class=k>${R(rv(dn.filter(a=>a.d==t)))}</div></div>
<div class=c>Faturado no mês<div class=k>${R(rv(dn.filter(a=>a.d.slice(0,7)==t.slice(0,7))))}</div></div><div class=c>Clientes<div class=k>${D.clients.length}</div></div></div>
<h3>Hoje</h3><div class=c>${ap.map(a=>`<div class=r><span><b>${a.t}</b> ${esc(a.c)}, ${esc(svc(a.sid).n)}</span><span class=tag>${esc(pr(a.pid))}</span></div>`).join('')||'Nenhum agendamento para hoje. Compartilhe o link do site para receber reservas.'}</div>`}
/* link do site */
const siteUrl=()=>location.href.split('#')[0].split('?')[0].replace(/index\.html$/,'');
function linkCard(){if(location.protocol=='file:')return `<div class=c><b>Link do seu site</b><p>O link só existe depois de publicar o site (hospedagem). Depois de publicar, abra o endereço no celular e este botão passa a copiar o link certo.</p></div>`;return `<div class=c><b>Link do seu site</b><p class=tag style="word-break:break-all">${esc(siteUrl())}</p><div class=acts><button class="b m" onclick="cpLink()">Copiar link</button><button class="b s m" onclick="shLink()">Compartilhar</button></div><small style="color:var(--mut)">Cole na bio do Instagram, no status ou na conversa do WhatsApp.</small></div>`}
function cpLink(){let u=siteUrl();(navigator.clipboard?navigator.clipboard.writeText(u):Promise.reject()).then(()=>alert('Link copiado!'),()=>prompt('Copie o link:',u))}
function shLink(){let u=siteUrl(),t='Agende seu horário na '+D.shop.name;if(navigator.share)navigator.share({title:D.shop.name,text:t,url:u}).catch(()=>{});else window.open('https://wa.me/?text='+encodeURIComponent(t+': '+u),'_blank')}
/* agenda */
function agenda(){if(!D.pros.some(p=>p.id==P))P=D.pros[0]?.id;if(!P)return '<div class=c>Cadastre um profissional para usar a agenda.</div>';let s=taken(day,P);return `<h2>Agenda</h2><div class=g>
<label>Data<input type=date value=${day} onchange="day=this.value;go()"></label>
<label>Profissional<select onchange="P=+this.value;go()">${D.pros.map(p=>`<option value=${p.id} ${p.id==P?'selected':''}>${esc(p.n)}</option>`).join('')}</select></label></div>
<button class="b s m" onclick="blkR()">Bloquear intervalo</button> <button class="b s m" onclick="blkAll()">Bloquear o dia inteiro</button><div class=c>${SL.map(t=>{let a=s[t],h;
if(!a)h=`<span class=ok>Livre</span><span><button class="b m" onclick="addAp('${t}')">Agendar</button> <button class="b s m" onclick="blk('${t}')">Bloquear</button></span>`;
else if(a=='B')h=`<span class=no>Bloqueado</span><button class="b s m" onclick="unb('${t}')">Liberar</button>`;
else if(a.t!=t)h=`<span class=tag>continua: ${esc(a.c)}</span>`;
else h=`<span><b>${esc(a.c)}</b> ${esc(svc(a.sid).n)} <i class=tag>${a.st}</i></span><span>${a.st=='agendado'?`<button class="b m" onclick="fin(${a.id})">Concluir</button> `:''}<button class="b x m" onclick="canc(${a.id})">Cancelar</button></span>`;
return `<div class=r><b>${t}</b>${h}</div>`}).join('')}</div>`}
function addAp(t){modal('Agendar às '+t,[{k:'c',l:'Cliente',r:1},{k:'ph',l:'WhatsApp',t:'tel'},{k:'sid',l:'Serviço',o:D.services.map(s=>[s.id,s.n+' ('+R(s.p)+')'])}],{},o=>{let n=Math.ceil(svc(o.sid).m/30),s=taken(day,P);if(![...Array(n)].every((_,i)=>{let x=tm(mn(t)+i*30);return SL.includes(x)&&!s[x]})){alert('Este serviço não cabe neste horário: há outro agendamento ou bloqueio logo depois.');return}mk(day,t,P,o.sid,o.c,o.ph);go()})}
function blk(t){D.blocks.push({d:day,t,pid:P});save();go()}
function unb(t){D.blocks=D.blocks.filter(b=>!(b.d==day&&b.t==t&&b.pid==P));save();go()}
function blkR(){modal('Bloquear intervalo',[{k:'a',l:'De',o:SL.map(t=>[t,t])},{k:'z',l:'Até o horário (inclusive)',o:SL.map(t=>[t,t])}],{a:'12:00',z:'13:00'},o=>{let s=taken(day,P);SL.filter(t=>t>=o.a&&t<=o.z&&!s[t]).forEach(t=>D.blocks.push({d:day,t,pid:P}));save();go()})}
function blkAll(){let s=taken(day,P);SL.forEach(t=>{if(!s[t])D.blocks.push({d:day,t,pid:P})});save();go()}
function fin(id){D.appts.find(a=>a.id==id).st='concluido';save();go()}
function canc(id){D.appts.find(a=>a.id==id).st='cancelado';save();go()}
/* cadastros */
const F={services:[{k:'n',l:'Nome',r:1},{k:'p',l:'Preço (R$)',t:'number',r:1,s:'0.01'},{k:'m',l:'Duração (min)',t:'number',r:1,s:'30'}],pros:[{k:'n',l:'Nome',r:1}],clients:[{k:'n',l:'Nome',r:1},{k:'ph',l:'WhatsApp',t:'tel'}]};
function crud(k,lbl,title,row){return `<div class=r><h2>${title}</h2><button class=b onclick="ed('${k}','${lbl}',0)">Novo</button></div><div class=c>${D[k].map(x=>`<div class=r><span>${row(x)}</span><span><button class="b s m" onclick="ed('${k}','${lbl}',${x.id})">Editar</button> <button class="b x m" onclick="del('${k}',${x.id})">Excluir</button></span></div>`).join('')||'Nada cadastrado ainda.'}</div>`}
function ed(k,l,id){let x=id?D[k].find(y=>y.id==id):{};modal((id?'Editar ':'Novo ')+l,F[k],x,o=>{['p','m'].forEach(f=>{if(o[f]!=null)o[f]=+o[f]});if(id)Object.assign(x,o);else D[k].push({id:nid(D[k]),...o});save();go()})}
function del(k,id){if(confirm('Excluir este item?')){D[k]=D[k].filter(x=>x.id!=id);save();go()}}
/* faturamento */
function fat(){let dn=D.appts.filter(a=>a.st=='concluido'),days=[...Array(7)].map((_,i)=>{let d=new Date();d.setDate(d.getDate()-6+i);let k=ymd(d);return [k,rv(dn.filter(a=>a.d==k))]}),mx=Math.max(1,...days.map(x=>x[1])),mo=today().slice(0,7);return `<h2>Faturamento</h2><div class=g><div class=c>Total no mês<div class=k>${R(rv(dn.filter(a=>a.d.slice(0,7)==mo)))}</div></div><div class=c>Total geral<div class=k>${R(rv(dn))}</div></div><div class=c>Atendimentos concluídos<div class=k>${dn.length}</div></div></div>
<h3>Últimos 7 dias</h3><div class=c><div class=bar>${days.map(d=>`<div style="height:${d[1]/mx*100}%" title="${R(d[1])}"><span>${d[0].slice(8)}/${d[0].slice(5,7)}</span></div>`).join('')}</div></div>
<h3>Por profissional</h3><div class=c>${D.pros.map(p=>`<div class=r><span>${esc(p.n)}</span><b>${R(rv(dn.filter(a=>a.pid==p.id)))}</b></div>`).join('')}</div>`}
/* perfil */
function perfil(){let s=D.shop;return `<h2>Perfil da barbearia</h2><div class=c><div class=r><b>${esc(s.name)}</b><button class="b m" onclick="editShop()">Editar dados</button></div><p>WhatsApp: ${esc(s.wa)||'não informado'}</p><p>Endereço: ${esc(s.addr)||'não informado'}</p><p>${esc(s.about)}</p></div>
<h3>Logo do site</h3><div class=c><div class=logo>${s.logo?`<img src="${s.logo}" alt="Logo">`:'✂'}</div><label>Enviar logo<input type=file accept="image/*" onchange="setLogo(this.files)"></label>${s.logo?`<button class="b x m" onclick="D.shop.logo='';save();go()">Remover logo</button>`:''}</div>
<h3>Fotos dos cortes</h3><div class=c><label>Adicionar fotos de cortes<input type=file accept="image/*" multiple onchange="addCut(this.files)"></label><div class=ph>${D.cuts.map(c=>`<figure><img src="${c.img}" alt=""><figcaption>${esc(c.t)||'Sem nome'}</figcaption><button class="b s m" onclick="nameCut(${c.id})">Nome</button> <button class="b x m" onclick="rmCut(${c.id})">Remover</button></figure>`).join('')}</div></div>
<h3>Fotos do espaço</h3><div class=c><label>Adicionar fotos da barbearia<input type=file accept="image/*" multiple onchange="addPh(this.files)"></label><div class=ph>${s.photos.map((p,i)=>`<figure><img src="${p}" alt=""><button class="b x m" onclick="rmPh(${i})">Remover</button></figure>`).join('')}</div></div>`}
function editShop(){modal('Dados da barbearia',[{k:'name',l:'Nome',r:1},{k:'wa',l:'WhatsApp com DDD',t:'tel',r:1},{k:'addr',l:'Endereço'},{k:'ig',l:'Instagram (sem @)'},{k:'about',l:'Descrição'}],D.shop,o=>{Object.assign(D.shop,o);save();go()})}
function shrink(f,mx,cb){let r=new FileReader();r.onload=()=>{let i=new Image();i.onload=()=>{let k=Math.min(1,mx/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=i.width*k;c.height=i.height*k;c.getContext('2d').drawImage(i,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',.75))};i.src=r.result};r.readAsDataURL(f)}
function tryS(undo){try{save()}catch(e){undo();alert('Sem espaço no armazenamento do aparelho. Remova alguma foto.')}go()}
function addPh(fs){[...fs].forEach(f=>shrink(f,800,u=>{D.shop.photos.push(u);tryS(()=>D.shop.photos.pop())}))}
function addCut(fs){[...fs].forEach(f=>shrink(f,800,u=>{D.cuts.push({id:nid(D.cuts),img:u,t:''});tryS(()=>D.cuts.pop())}))}
function setLogo(fs){if(!fs[0])return;shrink(fs[0],256,u=>{let o=D.shop.logo;D.shop.logo=u;tryS(()=>D.shop.logo=o)})}
function nameCut(id){let c=D.cuts.find(x=>x.id==id);modal('Nome do corte',[{k:'t',l:'Nome (ex.: Degradê, Social)'}],c,o=>{c.t=o.t;save();go()})}
function svPh(id,fs){if(!fs[0])return;let x=D.services.find(y=>y.id==id);shrink(fs[0],600,u=>{let o=x.img;x.img=u;tryS(()=>x.img=o)})}
function svRm(id){D.services.find(y=>y.id==id).img='';save();go()}
function rmCut(id){D.cuts=D.cuts.filter(x=>x.id!=id);save();go()}
function rmPh(i){D.shop.photos.splice(i,1);save();go()}
const V={painel,agenda,servicos:()=>crud('services','serviço','Serviços',x=>`${x.img?`<img class=th src="${x.img}" alt="">`:''}${esc(x.n)}, ${R(x.p)}, ${x.m} min <label class="b s m">${x.img?'Trocar foto':'Foto'}<input type=file accept="image/*" hidden onchange="svPh(${x.id},this.files)"></label>${x.img?` <button class="b x m" onclick="svRm(${x.id})">Tirar foto</button>`:''}`),pros:()=>crud('pros','profissional','Profissionais',x=>esc(x.n)),clientes:()=>crud('clients','cliente','Clientes',x=>`${esc(x.n)} ${esc(x.ph)} <small class=tag>${D.appts.filter(a=>a.c==x.n&&a.st=='concluido').length} visitas</small>`),fat,perfil};
/* modal genérico */
function modal(t,f,v,cb){let d=document.createElement('dialog');d.innerHTML=`<form method=dialog><h3>${t}</h3>${f.map(x=>`<label>${x.l}${x.o?`<select name=${x.k}>${x.o.map(o=>`<option value="${o[0]}" ${o[0]==v[x.k]?'selected':''}>${esc(o[1])}</option>`).join('')}</select>`:`<input name=${x.k} type=${x.t||'text'} ${x.s?'step='+x.s:''} value="${esc(v[x.k])}" ${x.r?'required':''}>`}</label>`).join('')}<button class=b value=ok>Salvar</button> <button class="b s" value=no formnovalidate>Cancelar</button></form>`;d.addEventListener('close',()=>{if(d.returnValue=='ok'){let o={};new FormData(d.querySelector('form')).forEach((a,k)=>o[k]=a);cb(o)}d.remove()});document.body.append(d);d.showModal()}
/* PWA */
addEventListener('beforeinstallprompt',e=>{e.preventDefault();inst=e;if($('#ins'))$('#ins').hidden=false});
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
go();
