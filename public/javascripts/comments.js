
function noCommentsNode(commentsList){
    if(!commentsList.querySelector('.list-group-item')){
        commentsList.insertAdjacentHTML('afterbegin',`<li class="list-group-item noComments">
        <p class="mb-0">Nessun commento</p>
    </li>`);
    }
}

function deleteButtonClick(event){

    const btn = event.target.parentNode;
    const idComment = btn.dataset.id;

    const confirmButton = document.querySelector('#confirm-delete-comments-button'); 
    confirmButton.addEventListener('click',()=>{
    
        fetch(`/episodes/comments/${idComment}`,{method:'DELETE'}).then((response)=>{
        if(response.ok){
            let listItem = btn.parentNode;
            while(!listItem.classList.contains('list-group-item')) listItem = listItem.parentNode;
            
            const commentsList = listItem.parentNode;
            
            listItem.parentNode.removeChild(listItem); 
               
            noCommentsNode(commentsList);    

            Alert.createAlert('success','Commento cancellato!');
        }
        else{
            response.json().then((responseJson)=>{
                const error = responseJson.error;
                Alert.createAlert('danger',error);
            });
        }
        confirmButton.parentNode.querySelector('[data-dismiss="modal"]').click();    
            
        });   
    });
}


function resetForm(form){
    form.elements['comment'].value = '';
}

function createCommentNode(idComment,author,comment){
    return `<li class="list-group-item mb-2" id="${idComment}">
    <container class="d-flex justify-content-between">
        <p><strong>${author}</strong></p>
        
        <button  type="button" id="delete-comments-${idComment}" data-id="${idComment}" data-toggle="modal" data-target="#confirm-delete-comments" class="delete-comments btn btn-sm mt-n3 mr-n3" ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
          </svg></button>
    </container>

    <hr class="mt-n2 mb-1">
    <p class="mb-0">${comment}</p>
</li>`;
}

function addCommentNode(newCommentNode,idComment,commentsList){

    commentsList.insertAdjacentHTML('beforeend',newCommentNode);

    commentsList.querySelector('#delete-comments-'+idComment).addEventListener('click',deleteButtonClick);

}

function removeNoCommentsNode(commentsList){

    const noCommentsNode = commentsList.querySelector('.noComments');
    
    if(noCommentsNode) noCommentsNode.parentNode.removeChild(noCommentsNode);
}

async function submitForm(event){
    event.preventDefault();
    
    const form = event.target;

    const episodeId = form.dataset.id;
    const comment = form.elements['comment'].value;
    const series = form.elements['series'].value;

    const commentObj = {};
    
    commentObj.comment = comment;
    commentObj.series = series;

    const response = await fetch(`/episodes/${episodeId}/comments`,{method:'POST',headers: {
        'Content-Type': 'application/json',
    },body: JSON.stringify(commentObj)});

    if(response.ok){
        const obj = await response.json();
    
        const idComment = obj.lastID;
        const author = obj.author;

        const commentsList = document.querySelector('#comments-list-'+episodeId);

        addCommentNode(createCommentNode(idComment,author,comment),idComment,commentsList);

        removeNoCommentsNode(commentsList);

        resetForm(form);

        Alert.createAlert('success','Commento aggiunto!')
    }else{
        response.json().then((responseJson)=>{
            const error = responseJson.error;
            Alert.createAlert('danger',error);
        });
    }

}

const deleteCommentButton = document.querySelectorAll('.delete-comments');

deleteCommentButton.forEach((btn)=>{ 

    btn.addEventListener('click',deleteButtonClick);
    });





const addCommentForms = document.querySelectorAll('.add-comments-form');

addCommentForms.forEach((f)=>{
    f.addEventListener('submit',submitForm)
})

