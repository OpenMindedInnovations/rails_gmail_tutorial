chrome.extension.sendMessage({}, function(response) {

    InboxSDK.load('1', 'Hello World!').then(function(sdk){

        var array_of_todos = []; //object type {thread_id, item, checked}
        var array_of_navitems = []; // object type{navItem, item, description, checked}

        var todoItem = sdk.NavMenu.addNavItem({
            name: "Todos",
            iconUrl: "https://i.imgur.com/52FWtfw.png"
        });

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

       function shouldUpdateNavItem(array_of_navItems,todo_object){
           // we are going to iterate through the array of NavItem given to us
           // check if the property of the NavItem todo is the same as the todo object given to us
           // if it is not the same, we delete the navItem and return true
            if(array_of_navItems.length > 0){

               for(var item = 0; item < array_of_navitems.length; item++){

                   if(array_of_navItems[item].description == todo_object.description){
                       if(array_of_navItems[item].checked != todo_object.checked){
                           console.log(array_of_navItems[item]);
                           array_of_navItems[item].navItem.remove();
                           return true;
                       }
                   } else if(array_of_navItems[item].description != todo_object.description){
                       // this condition also checks if the item is not even in the list of navItem and return true
                       console.log("its a new item all together");
                       return true;
                   }
               }
           } else {
               return true;
           }

       }

       // fetch all the todos from the api and add to array of todos
        $.ajax({
            url:"https://afternoon-ocean-92308.herokuapp.com/todos/",
            type:"GET",
            success:function(response){

                for(var i = 0; i < response.length; i++){
                    array_of_todos.push(response[i])
                    var newItem = todoItem.addNavItem({
                        name:response[i].item,
                        iconUrl:(!response[i].checked ? "http://www.dotnetcart.com/demov4/Styles/images/icons/icon-pricetable-false.png" : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLOGxjHDWICicw_XZ5mvtyu-h9_W7QcrB131SQsG453Y-zzlT2")
                    })
                    array_of_navitems.push({
                        navItem:newItem,
                        item:response[i].item,
                        description:response[i].description,
                        checked:response[i].checked
                    })
                }


            }
        });

        // observe the array of todos and when it changes
        // we add new todo items to the list of todos
        Array.observe(array_of_todos, function(changes){
            // the SDK has been loaded, now do something with it!
                console.log(changes);
            for(var i = 0; i < array_of_todos.length; i++){
                var shouldUpdate = shouldUpdateNavItem(array_of_navitems,array_of_todos[i]);
                if(shouldUpdate){
                    var newItem = todoItem.addNavItem({
                        name:array_of_todos[array_of_todos.length - 1].item,
                        iconUrl:(!array_of_todos[array_of_todos.length - 1].checked ? "http://www.dotnetcart.com/demov4/Styles/images/icons/icon-pricetable-false.png" : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLOGxjHDWICicw_XZ5mvtyu-h9_W7QcrB131SQsG453Y-zzlT2")
                    });
                    array_of_navitems.push({
                        navItem:newItem,
                        item:array_of_todos[array_of_todos.length - 1].item,
                        description:array_of_todos[array_of_todos.length - 1].description,
                        checked:array_of_todos[array_of_todos.length - 1].checked
                    });
                    break;
                }

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
                            });

                        }

                    } else {

                        // delete from todo list when we uncheck by
                        // send ajax request to server to update todo
                        for(var i = 0; i < array_of_todos.length; i++){
                            if(array_of_todos[i].description == _threadID){
                                var cache_item = array_of_todos[i];
                                cache_item.checked = !array_of_todos[i].checked;
                                array_of_todos.splice(i,1);
                                array_of_todos.push(cache_item)
                                break;
                            }
                        }
                    }

                }
            });

            var emitter; //variable name to hoist the emitter to
            var stream = Kefir.stream(function(inEmitter){
                emitter = inEmitter;
                return function(){}; //we need to return a function that gets called when the stream ends
            });
            threadRowView.addLabel(stream);


            Array.observe(array_of_todos, function(changes){
                console.log(changes);
                for(var i = 0; i < array_of_todos.length; i++){
                    var _threadID = threadRowView._threadRowViewDriver._cachedThreadID;
                    if(_threadID == array_of_todos[i].description){
                        if(array_of_todos[i].checked == true){
                            emitter.emit(null);
                            emitter.emit({
                                title:"Todo Completed",
                                foregroundColor:"#fff",
                                backgroundColor:"#91c661"
                            })


                        } else {
                            emitter.emit({
                                title:"Todo Item",
                                foregroundColor:"#fff",
                                backgroundColor:"#bdbdbd"
                            })
                        }
                    }
                }
            })

        })





  });

});
