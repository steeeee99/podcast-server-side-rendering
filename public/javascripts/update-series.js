const updateSeriesForm = document.getElementById('edit-series-form');


updateSeriesForm.addEventListener('submit',(event)=>{
    event.preventDefault();
    
    const form = event.target;

    const title = form.elements['title'].value;
    const description = form.elements['description'].value;

    const formData = new FormData();

    formData.append('description',description);

    fetch(`/created/${title}/edit`,{method:'PUT', body : formData}).then(()=>{
        window.location = '/created';
    });
});