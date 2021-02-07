const updatePhotoForm = document.getElementById('update-photo-form');


updatePhotoForm.addEventListener('submit',(event)=>{
    event.preventDefault();
    
    const form = event.target;

    const file = form.elements['update-photo'].files;
    
    const formData = new FormData();

    formData.append('img', file[0]);
    
    fetch(`/users/account/photo`,{method:'PUT', body : formData}).then(()=>{
        window.location = '/users/account';
    });
});  