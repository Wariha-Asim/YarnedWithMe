
function getCart(){ return JSON.parse(localStorage.getItem('ywm_cart')||'[]'); }
function setCart(c){ localStorage.setItem('ywm_cart', JSON.stringify(c)); updateCartCount(); }

function updateCartCount(){
  const count = getCart().reduce((s,i)=>s+i.qty,0);
  const el1 = document.getElementById('cart-count');
  const el2 = document.getElementById('cart-count-mobile');
  if (el1) el1.textContent = count;
  if (el2) el2.textContent = count;
}


function addToCart(item, qty){
  const cart = getCart();
  const existing = cart.find(x=>x.id===item.id);
  if (existing) existing.qty += qty;
  else cart.push({id:item.id, name:item.name, price:item.price, image:item.images[0], qty});
  setCart(cart);
  alert('Added to cart: ' + item.name);
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();

  const itemsWrap = document.getElementById('cart-items');
  if (itemsWrap){
    const empty = document.getElementById('cart-empty');
    const content = document.getElementById('cart-content');
    function renderCart(){
      const cart = getCart();
      if (!cart.length){
        empty.classList.remove('hidden');
        content.classList.add('hidden');
        return;
      }
      empty.classList.add('hidden');
      content.classList.remove('hidden');
      itemsWrap.innerHTML = '';
      let subtotal = 0;
      for (const it of cart){
        subtotal += it.price * it.qty;
        const row = document.createElement('div');
        row.className = 'flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-[#140f19] border border-white/10';

        row.innerHTML = `
          <img src="${it.image}" alt="${it.name}" class="h-20 w-20 rounded-xl object-cover">
          <div class="flex-1">
            <div class="font-semibold text-white">${it.name}</div>
            <div class="text-sm text-slate-300/85">${(it.price).toFixed(2)} each</div>
            <button class="text-xs text-rose-300 underline mt-1" data-remove="${it.id}">Remove</button>
          </div>
          <div class="flex items-center gap-2">
            <input type="number" min="1" value="${it.qty}" 
  class="qty-input bg-gray-700 text-white border border-gray-600 rounded-md p-2 w-16 text-center" 
  data-qty="${it.id}">
            <div class="price w-24 text-right">${('$'+(it.price*it.qty).toFixed(2))}</div>
          </div>`;
        itemsWrap.appendChild(row);
      }
      const shipping = subtotal > 60 ? 0 : 5;
      document.getElementById('subtotal').textContent = '$' + subtotal.toFixed(2);
      document.getElementById('shipping').textContent = '$' + shipping.toFixed(2);
      document.getElementById('total').textContent = '$' + (subtotal + shipping).toFixed(2);
    }
    renderCart();

    itemsWrap.addEventListener('input', e=>{
      const id = e.target?.dataset?.qty;
      if (!id) return;
      const cart = getCart();
      const it = cart.find(x=>x.id===id);
      it.qty = Math.max(1, parseInt(e.target.value||'1',10));
      setCart(cart);
      renderCart();
    });

    itemsWrap.addEventListener('click', e=>{
      const id = e.target?.dataset?.remove;
      if (!id) return;
      let cart = getCart().filter(x=>x.id!==id);
      setCart(cart);
      renderCart();
    });
  }
});
