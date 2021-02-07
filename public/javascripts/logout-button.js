const button = document.querySelector('#logout-button');

button.addEventListener('click',()=>{
    fetch(`/session/current`,{method:'DELETE'}).then(()=>{
        window.location = '/';
    })
})