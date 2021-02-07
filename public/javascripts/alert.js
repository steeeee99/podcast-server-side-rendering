class Alert{
    constructor(){
        
    }
    static createAlert(color,message){
        const alertContainer = document.querySelector('#alert-message');
        const alertNode = `<div class="alert alert-${color} alert-position" alert-dismissible fade show" role="success">
                        <span>${message}</span> 
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                      </div>`;
    alertContainer.innerHTML = alertNode;
    }

    }

