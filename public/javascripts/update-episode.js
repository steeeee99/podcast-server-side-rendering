document.querySelector('#edit-episode-form').addEventListener('submit',(event)=>{

    event.preventDefault();

    const form = event.target;
    const idEpisode = form.dataset.id;
    const description = form.elements['description'].value;
    const sponsor = form.elements['sponsor'].value;
    const price = form.elements['price'].value;
    const series = form.elements['series'].value;

    const formObj = {};
    formObj.description = description;
    formObj.sponsor = sponsor;
    formObj.price = price;

    fetch(`/episodes/${idEpisode}`,{method:'put',headers: {
        'Content-Type': 'application/json',
    }, body : JSON.stringify(formObj)}).then(()=>{
        window.location = `/${series}/info`;
    });
});