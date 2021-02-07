function addFavoriteButtonsClick(event){
    
    const btn = event.target;
    const id = btn.dataset.id;
    

    const idObj = {};
    idObj.id = `${id}`;
        
    fetch(`/episodes/favorite`,{method:'POST',headers:{
        'Content-Type': 'application/json',
    },body:JSON.stringify(idObj)}).then((response)=>{
        if(response.ok){
            btn.classList.add('btn-light');
            btn.classList.add('delete-favorite-buttons');
            btn.classList.remove("button-color");
            btn.innerText = 'Rimuovi dai preferiti';
            btn.setAttribute('data-target','#confirm-delete-favorites');
            btn.setAttribute('data-toggle','modal');
            btn.removeEventListener('click',addFavoriteButtonsClick);
            btn.addEventListener('click',deleteFavoriteButtonsClick);  
            Alert.createAlert('success','Aggiunto ai preferiti1!');
        }else{
            response.json().then((responseJson)=>{
                const error = responseJson.error;
                Alert.createAlert('danger',error);
            })
        }
    });        
};

function deleteFavoriteButtonsClick(event){

    const btn = event.target;
    const idEpisode = btn.dataset.id;
    const url = self.location.href;

    const confirmButton = document.querySelector('#confirm-delete-favorites-button');
    confirmButton.addEventListener('click',()=>{
    
            fetch(`/episodes/favorite/${idEpisode}`,{method:'DELETE'}).then((response)=>{   
            if(response.ok){
                if(url.endsWith('/episodes/favorite')){
                    const listItem = btn.parentNode;
                    listItem.parentNode.removeChild(listItem);
                }else{
                    btn.classList.remove('btn-light');
                    btn.classList.remove('delete-favorite-buttons');
                    btn.classList.add("button-color");
                    btn.innerText = 'Aggiungi ai preferiti';
                    btn.removeAttribute('data-target');
                    btn.removeAttribute('data-toggle');
                    btn.addEventListener('click',addFavoriteButtonsClick);
                    btn.removeEventListener('click',deleteFavoriteButtonsClick);
                }
                Alert.createAlert('success','Episodio cancellato dai preferiti')
            }else{
                response.json().then((responseJson)=>{
                    const error = responseJson.error;
                    Alert.createAlert('danger',error);
                })
            }
            
                confirmButton.parentNode.querySelector('[data-dismiss="modal"]').click();
            });
        });
    }
    



const addFavoriteButtons = document.querySelectorAll('.add-favorite-buttons');

addFavoriteButtons.forEach((btn) => 
{
    btn.addEventListener('click',addFavoriteButtonsClick);    
});


const deleteFavoriteButtons = document.querySelectorAll('.delete-favorite-buttons');
               
deleteFavoriteButtons.forEach((btn) => 
{
    btn.addEventListener('click', deleteFavoriteButtonsClick);
});
