import './scss/blog.scss';
import { renderBlog } from './modules/blog';
import { userSignOut } from './modules/login';
import { searchArt } from './modules/blog';

renderBlog();


if (document.querySelector('.blog__div')){

    document.querySelector('.blog__div').addEventListener('click', (e) => {
        console.log(e.currentTarget);
    })
}

if (document.querySelector('#singOut')){
    const signOut = document.querySelector('#singOut')
    signOut.addEventListener('click', (e) => userSignOut(e))
}

if(document.querySelector('#offcanvasOpen') && document.querySelector('#offcanvasClose')){
    const offcanvasOpenBtn = document.querySelector('#offcanvasOpen');
    const offcanvasCloseBtn = document.querySelector('#offcanvasClose')

    offcanvasOpenBtn.addEventListener('click', () => document.querySelector('#offcanvas').classList.add('show'))
    offcanvasCloseBtn.addEventListener('click', () => document.querySelector('#offcanvas').classList.remove('show'))
    
}

if(document.querySelector('#search')){
    const searchBtn = document.querySelector('#search');

    searchBtn.addEventListener('click', (e) => searchArt(e));
}