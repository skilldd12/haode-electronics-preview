(()=>{
    const base="/haode-electronics-preview";
    const en=document.documentElement.lang==='en';
    document.querySelectorAll('[data-preview-inquiry]').forEach(f=>f.addEventListener('submit',e=>e.preventDefault()));
    const form=document.querySelector('.filter-bar'),table=document.querySelector('.part-table');
    if(!form||!table)return;
    fetch(base+'/catalogue.json').then(r=>r.json()).then(data=>{
      const rows=data[en?'en':'zh']; const params=new URLSearchParams(location.search);
      for(const key of ['q','brand','category'])if(form.elements[key])form.elements[key].value=params.get(key)||'';
      function render(){
        const q=(form.elements.q.value||'').trim().toLowerCase(),b=form.elements.brand.value,c=form.elements.category.value;
        const selected=rows.filter(p=>(!b||p.brand===b)&&(!c||p.category===c)&&(!q||[p.mpn,p.series,p.brand,p.summary_zh,p.summary_en,p.category].join(' ').toLowerCase().includes(q)));
        table.querySelectorAll('.part-row,.preview-empty').forEach(e=>e.remove());
        for(const p of selected)table.insertAdjacentHTML('beforeend',p.html);
        if(!selected.length){const p=document.createElement('p');p.className='preview-empty';p.textContent=en?'No matching reference part.':'没有匹配的资料型号。';table.appendChild(p);}
        const label=document.querySelector('.result-count');if(label)label.textContent=en?selected.length+' reference parts':selected.length+' 个资料型号';
        document.querySelector('.pager')?.remove();
      }
      form.addEventListener('submit',e=>{e.preventDefault();const p=new URLSearchParams();for(const k of ['q','brand','category'])if(form.elements[k].value)p.set(k,form.elements[k].value);history.replaceState(null,'',location.pathname+(p.size?'?'+p:''));render();});
      render();
    }).catch(()=>{});
  })();