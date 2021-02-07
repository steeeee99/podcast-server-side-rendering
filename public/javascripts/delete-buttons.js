
const deleteSeriesButtons = document.querySelectorAll('.delete-buttons');

                deleteSeriesButtons.forEach(btn => {
                    btn.addEventListener('click', ()=>{

                        const title = btn.dataset.id;
                        const url = self.location.href;

                        const confirmButton = document.querySelector('#confirm-delete-series-button'); 
                        confirmButton.addEventListener('click',()=>{
                        
                        fetch(`/created/${title}`,{method:'DELETE'}).then((response)=>{

                        if(response.ok){
                            
                            if(url.endsWith('/created')){
                                let listItem = btn.parentNode;
                                while(!listItem.classList.contains('list-group-item')) listItem = listItem.parentNode;

                                listItem.parentNode.removeChild(listItem);
                                Alert.createAlert('success','Serie cancellata!');
                                confirmButton.parentNode.querySelector('[data-dismiss="modal"]').click();
                            }else{  
                                window.location = '/created';
                            }

                        }else{
                            response.json().then((responseJson)=>{
                                const error = responseJson.error;
                               Alert.createAlert('danger',error);
                            })
                            confirmButton.parentNode.querySelector('[data-dismiss="modal"]').click();                            
                        }   
                            });
                        });

                    });
                });


const deleteEpisodeButtons = document.querySelectorAll('.delete-episode-buttons');
                
deleteEpisodeButtons.forEach(btn => {
                   
    btn.addEventListener('click', () => {

                        const id = btn.dataset.id;

                        const confirmButton = document.querySelector('#confirm-delete-episodes-button'); 
                        confirmButton.addEventListener('click',()=>{

                            fetch(`/episodes/${id}`,{method:'DELETE'}).then((response)=>{
                                if(response.ok){
                                    let listItem = btn.parentNode;
                                    while(!listItem.classList.contains('list-group-item')) listItem = listItem.parentNode;


                                    listItem.parentNode.removeChild(listItem);
                                    Alert.createAlert('success','Episodio cancellato');
                                }else{
                                    response.json().then((responseJson)=>{
                                        const error = responseJson.error;
                                        Alert.createAlert('danger',error);
                                    });
                                };
                                confirmButton.parentNode.querySelector('[data-dismiss="modal"]').click();
                            });
                          
                        });

                    });
                });
                
            