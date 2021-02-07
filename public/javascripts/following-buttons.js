function createAlert(responseJson){
    const error = responseJson.error;
                    const alertContainer = document.querySelector('#alert-message');
                                        const message = `<div class="alert alert-danger alert-position" alert-dismissible fade show" role="success">
                                        <span>${error}</span> 
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                      </div>`;
                    alertContainer.innerHTML = message;
}

function followButtonClick(event){
    
    const btn = event.target;
    const title = btn.dataset.id;
    
        const titleObj = {};
        titleObj.title = title;
        
        fetch(`/followed`,{method:'POST',headers: {
            'Content-Type': 'application/json',
        },body:JSON.stringify(titleObj)}).then((response)=>{
            
            if(response.ok){
                btn.classList.add('btn-light');
                btn.classList.add('unfollow-buttons');
                btn.classList.remove("button-color");
                btn.innerText = 'Non seguire';
                btn.setAttribute('data-target','#confirm-unfollow');
                btn.setAttribute('data-toggle','modal');
                btn.removeEventListener('click',followButtonClick);
                btn.addEventListener('click',unfollowButtonClick);

                Alert.createAlert('success','Hai iniziato a seguire ' + title);
            }else{
                response.json().then((responseJson)=>{
                    const error = responseJson.error;
                    Alert.createAlert('danger',error);
                })
            }
}).catch();}


function unfollowButtonClick(event){

    const btn = event.target;
    const title = btn.dataset.id;
    const url = self.location.href;

    const confirmButton = document.querySelector('#confirm-unfollow-button'); 
    confirmButton.addEventListener('click',()=>{

        fetch(`/followed/${title}`,{method:'DELETE'}).then((response)=>{
        if(response.ok){
            if(url.endsWith('/followed')){
                let listItem = btn.parentNode;
                while(!listItem.classList.contains('list-group-item')) listItem = listItem.parentNode;
                
                listItem.parentNode.removeChild(listItem);
            }else{
                btn.classList.remove('btn-light');
                btn.classList.remove('unfollow-buttons');
                btn.classList.add("button-color");
                btn.innerText = 'Seguire';
                btn.removeAttribute('data-target');
                btn.removeAttribute('data-toggle');
                btn.removeEventListener('click',unfollowButtonClick);
                btn.addEventListener('click',followButtonClick);
            }              
            Alert.createAlert('success','Hai smesso di seguire '+title);      
        }else{
            response.json().then((responseJson)=>{
                const error = responseJson.error;
                Alert.createAlert('danger',error);
            })
        }
            confirmButton.parentNode.querySelector('[data-dismiss="modal"]').click();
      }).catch();
});
}


const followButtons = document.querySelectorAll('.follow-buttons');

followButtons.forEach((btn) => 
{
    btn.addEventListener('click',followButtonClick);
});


const unfollowButtons = document.querySelectorAll('.unfollow-buttons');
               
unfollowButtons.forEach((btn) => 
{
    btn.addEventListener('click',unfollowButtonClick);
});