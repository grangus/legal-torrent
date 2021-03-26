import NativejsSelect from 'nativejs-select';
import { Modal, Tooltip, Toast } from 'bootstrap';

// Short aliases for JS selectors
const query = document.querySelector.bind(document);
const queryAll = document.querySelectorAll.bind(document);
// const fromId = document.getElementById.bind(document);
// const fromClass = document.getElementsByClassName.bind(document);
// const fromTag = document.getElementsByTagName.bind(document);

// Custom Select Init
new NativejsSelect({
  selector: '.custom-select',
  // enableSearch: true
});

// Bootstrap Tooltips Init
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new Tooltip(tooltipTriggerEl)
})

// Bootstrap Toasts Init
var toastElList = [].slice.call(document.querySelectorAll('.toast'))
toastElList.map(function (toastEl) {
  // show toasts
  new Toast(toastEl).show()

  return new Toast(toastEl)
})

// #dev / show toast
// const testToast = query('.toast');
// if(testToast){
//   new Toast(testToast).show();
// }

// #dev / show modal
// const modalSignUp = new Modal(document.getElementById('modal-sign-up'));
// modalSignUp.show();


// Mobile Nav Toggle
queryAll('.mobile-nav-toggle').forEach(item => {
  item.addEventListener('click', event => {
    event.preventDefault();
    query('body').classList.toggle('locked');
    query('.mobile-nav').classList.toggle('hidden');
  }, false);
})


// Category Select Nav
queryAll('.category-list-item__group').forEach(item => {
  item.addEventListener('click', event => {
    event.stopPropagation();
    event.preventDefault();
    const target = event.target;
    const parent = target.parentNode;
    const parent2 = parent.parentNode;
    const sub = parent2.querySelector('.category-list-item-sub');
    const subHeight = sub.querySelector('ul').offsetHeight;
    const active = query('.category-list-item.active');

    query('.category-list').classList.add('selected');

    if(active){
      active.classList.remove('active');
    }

    parent.classList.add('active');

    queryAll('.category-list-item-sub').forEach(item => {
      item.style.height='0px';
      // item.classList.add('hidden');
    })

    // console.log(subHeight);
    // sub.classList.remove('hidden');
    sub.style.height=subHeight+'px';
  }, false);
})

// Set sub-categories wrapper height
queryAll('.category-list-item-sub.active').forEach(item => {
  const subHeight = item.querySelector('ul').offsetHeight;
  item.style.height=subHeight+'px';
})

// Mobile categories expand
query('.category-list-wrapper__show').addEventListener('click', event => {
  const target = event.target;
  const wrapper = target.parentNode;
  const catHeight = wrapper.querySelector('nav').offsetHeight;

  console.log(catHeight);

  wrapper.style.height=catHeight+'px';
  wrapper.classList.remove('not-expanded-lg');

  setTimeout(function(){
    wrapper.style.height='auto';
  }, 500);
}, false);
