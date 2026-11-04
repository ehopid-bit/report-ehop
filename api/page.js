import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
const SUPABASE='https://ssppgsvvehlnnkldbfzb.supabase.co';
const KEY='sb_publishable_eYZb8F-5UYt36I9dKc3ZLg_VTV-rmAg';
const SITE='https://report.ehopindonesia.com';
const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export async function GET(request){
  const url=new URL(request.url);
  const requested=url.searchParams.get('edition') || url.pathname.split('/').filter(Boolean).find(p=>/^[a-z]+-\d{4}$/.test(p));
  let row=null,failed=false;
  try{
    const endpoint=new URL('/rest/v1/newsletter_editions',SUPABASE);
    endpoint.searchParams.set('select','slug,title,theme,cover_path,edition_month,edition_year,updated_at');
    endpoint.searchParams.set('is_published','eq.true');
    endpoint.searchParams.set('limit','1');
    if(requested)endpoint.searchParams.set('slug','eq.'+requested);
    else endpoint.searchParams.set('order','edition_year.desc,edition_month.desc');
    const response=await fetch(endpoint,{headers:{apikey:KEY},signal:AbortSignal.timeout(7000)});
    if(!response.ok)throw new Error('Catalog HTTP '+response.status);
    [row]=await response.json();
  }catch(error){failed=true;console.error('Newsletter metadata unavailable',error.message);}
  const title=requested?(row?.title||'Newsletter Yayasan EHOP'):'NEWSLETTER YAYASAN EHOP';
  const description=requested?(row?.theme||'Laporan Bulanan Yayasan EHOP Indonesia'):'Laporan Bulanan Yayasan EHOP Indonesia';
  const canonical=SITE+(requested?'/'+requested:'/');
  const image=!requested?SITE+'/assets/home-preview.png':row?.cover_path?SUPABASE+'/storage/v1/object/public/report-publik/'+row.cover_path.split('/').map(encodeURIComponent).join('/') : SITE+'/assets/logo-ehop-hitam.png';
  const tags=`<meta property="og:type" content="website" />
<meta property="og:site_name" content="Newsletter Yayasan EHOP" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:url" content="${escapeHtml(canonical)}" />
<meta property="og:image" content="${escapeHtml(image)}" />
<meta property="og:image:alt" content="${escapeHtml(title)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(title)}" />
<meta name="twitter:image" content="${escapeHtml(image)}" />
<link rel="canonical" href="${escapeHtml(canonical)}" />`;
  let html=await readFile(join(process.cwd(),'index.html'),'utf8');
  html=html.replace(/<title>.*?<\/title>/,`<title>${escapeHtml(title)}</title>`).replace(/<meta name="description"[^>]*>/,`<meta name="description" content="${escapeHtml(description)}" />`).replace('</head>',tags+'\n</head>');
  return new Response(html,{headers:{'content-type':'text/html; charset=utf-8','cache-control':failed?'no-store':'public, max-age=0, s-maxage=60'}});
}
