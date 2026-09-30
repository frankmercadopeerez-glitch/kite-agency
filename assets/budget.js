const form=document.querySelector('[data-budget]');
if(form){
 const english=form.dataset.locale==='en';
 const money=new Intl.NumberFormat(english?'en-US':'es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0});
 const calculate=()=>{
  const values=['people','transport','extras'].map(name=>Number(form.elements[name].value));
  const [people,transport,extras]=values;
  const output=form.querySelector('output');
  if(values.some(n=>!Number.isFinite(n)||n<0)||!Number.isInteger(people)||people<1||people>20){output.textContent=english?'Enter 1 to 20 participants and non-negative expenses.':'Introduce entre 1 y 20 personas y gastos no negativos.';return;}
  const base=Number(form.elements.program.value)*people;
  output.textContent=english?`Activity: ${money.format(base)} · Group expenses: ${money.format(transport+extras)} · Estimated total: ${money.format(base+transport+extras)} · Per person: ${money.format((base+transport+extras)/people)}.`:`Actividad: ${money.format(base)} · Gastos del grupo: ${money.format(transport+extras)} · Total estimado: ${money.format(base+transport+extras)} · Por persona: ${money.format((base+transport+extras)/people)}.`;
 };
 form.addEventListener('input',calculate);calculate();
}
