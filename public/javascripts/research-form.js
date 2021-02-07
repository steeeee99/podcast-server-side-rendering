const researchForm = document.querySelector('#research-form');

researchForm.querySelector("#type-research").addEventListener('change', (event) => {

    const selectCategory = researchForm.querySelector("#category");
    const typeResearch = event.target.value;
    const mainTitle = document.querySelector('#main-title');
    
    if (typeResearch === "series"){
        window.location = '/';
    }
    else{
        selectCategory.classList.add('d-none');
        mainTitle.innerText = 'Cerca episodi';
        researchForm.action='/episodes';
}});



 