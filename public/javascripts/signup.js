function invalid(formElement){
    const classList = formElement.classList;
    if(!classList.contains('is-invalid')){
        classList.add('is-invalid');
    }
}

function resetAllFormError(form){ 
    resetInvalid(form.elements['username']);
    resetInvalid(form.elements['password']);
    resetInvalid(form.elements['confirm-password']);
}

function resetInvalid(formElement){
    const classList = formElement.classList;
    if(classList.contains('is-invalid')){
        classList.remove('is-invalid');
    }
}

document.querySelector('#signup-form').addEventListener('submit',async (event)=>{

    event.preventDefault();

    const form = event.target;

    resetAllFormError(form);

    const username = form.elements['username'];
    const password = form.elements['password'];
    const confirmPassword = form.elements['confirm-password'];
    const creator = form.elements['type_account'].checked;
    
    let usernameOk = false;
    let userJson;
    try{
        const response = await fetch('/users/'+username.value+'/data');

        if(response.ok){
            userJson = await response.json();

            if(userJson.user.error)     usernameOk = true;
            else    invalid(username);
        }
    } catch(err){
        Alert.createAlert('danger',err);
    }

    let passwordOk = true;
    if(password.value!==confirmPassword.value){
        invalid(password);
        invalid(confirmPassword);
        passwordOk = false;
    }
    
    if(usernameOk && passwordOk){    
        
        const user = {
            username : username.value,
            password : password.value,
            creator : creator
        };


        fetch(`/signup`,{method:'POST',headers: {
            'Content-Type': 'application/json',
        },body:JSON.stringify(user)}).then((response)=>{

            if(response.ok){
                window.location = '/login';
                Alert.createAlert('success','Iscrizione avvenuta con successo');
            }else{
                Alert.createAlert('danger',"Errore durante l'iscrizione");
            }

        }).catch((err)=>{
            
            Alert.createAlert('danger',err);
        })
    }

})