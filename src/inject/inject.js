chrome.extension.sendMessage({}, function(response) {

    InboxSDK.load('1', 'Hello World!').then(function(sdk){

        var array_of_todos = [];
        //object type {thread_id, todoItem, checked}

        function checkIfIsTodo(array,thread_id){
          if(array.length == 0){
            return false;
          } else {
            for(var i = 0; i < array.length; i++){
              if(array[i].description == thread_id){
                return true;
              }
            }
          }
        }

       // fetch all the todos from the api and add to array of todos
        $.ajax({
            url:"https://afternoon-ocean-92308.herokuapp.com/todos/",
            type:"GET",
            success:function(response){

                for(var i = 0; i < response.length; i++){
                    array_of_todos.push(response[i])
                }


            }
        });

        // observe the array of todos and when it changes
        // we add new todo items to the list of todos
        Array.observe(array_of_todos, function(changes){
            // the SDK has been loaded, now do something with it!
            
            var todoItem = sdk.NavMenu.addNavItem({
                name: "Todos",
                iconUrl: "https://i.imgur.com/52FWtfw.png"
            });
            for(var i = 0; i < array_of_todos.length; i++){
                todoItem.addNavItem({
                    name:array_of_todos[i].item,
                    iconUrl:(!array_of_todos[i].checked ? "http://www.dotnetcart.com/demov4/Styles/images/icons/icon-pricetable-false.png" : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLOGxjHDWICicw_XZ5mvtyu-h9_W7QcrB131SQsG453Y-zzlT2")
                })
            }


        })

        sdk.Lists.registerThreadRowViewHandler(function(threadRowView){

            threadRowView.addButton({
                iconUrl:"https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcR6t41ErQxx0y1rApv207bM3LznQVdvOILrYy-XTUVg3JpxGvRn",
                onClick:function(event){

                    var _threadID = event.threadRowView._threadRowViewDriver._cachedThreadID;
                    var isTodo = checkIfIsTodo(array_of_todos,threadRowView.getThreadID());

                    if(!isTodo){
                        if(threadRowView.getThreadID() == _threadID){

                            $.ajax({
                                url:"https://afternoon-ocean-92308.herokuapp.com/todos/",
                                type:"POST",
                                data:{
                                    todo : { item:threadRowView.getSubject(), checked:false, description:_threadID}
                                },
                                success:function(response){

                                    sdk.Widgets.showModalView({
                                        el:"<h3>New todo Item Created</h3>",
                                        title:"Add Todo"
                                    });
                                    array_of_todos.push(response)
                                }
                            })

                        }

                    } else {

                        // delete from todo list when we uncheck by
                        // send ajax request to server to update todo
                        for(var i = 0; i < array_of_todos.length; i++){
                            if(array_of_todos[i].description == _threadID){
                                var cache_item = array_of_todos[i];
                                cache_item.checked = true;
                                array_of_todos.splice(i,1);
                                array_of_todos.push(cache_item)
                                break;
                            }
                        }
                    }

                }
            });


        })



  });

});
