'use strict';
document.addEventListener('DOMContentLoaded',()=>{
  const menuButton=document.getElementById('menuButton');
  const nav=document.getElementById('siteNav');
  const year=document.getElementById('year');
  const form=document.getElementById('leadForm');
  const status=document.getElementById('formStatus');
  if(year)year.textContent=new Date().getFullYear();
  if(menuButton&&nav){menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');}));}
  document.querySelectorAll('details').forEach(item=>item.addEventListener('toggle',()=>{if(item.open){document.querySelectorAll('details').forEach(other=>{if(other!==item)other.open=false;});}}));
  if(form){form.addEventListener('submit',event=>{event.preventDefault();if(!form.checkValidity()){form.reportValidity();return;}const data={};new FormData(form).forEach((value,key)=>{if(value instanceof File){if(value.name)(data[key]??=[]).push(value.name);return;}if(data[key])data[key]=Array.isArray(data[key])?[...data[key],value]:[data[key],value];else data[key]=value;});data.createdAt=new Date().toISOString();const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download='mobile-welding-job-request.json';link.click();setTimeout(()=>URL.revokeObjectURL(link.href),500);status.textContent='Request prepared. Attach the selected photos when you send the downloaded request.';});}
});
