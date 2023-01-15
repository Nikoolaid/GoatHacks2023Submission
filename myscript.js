let token = 'get your own !!!'

let responsey;
let userID;
let numChecked=0;
let numBoxes=0;


// let headers = new Headers();
// headers.set('Authorization', 'Bearer ' + token);
// first, get this https://canvas.instructure.com/api/v1/users/self
fetch('https://canvas.instructure.com/api/v1/users/self',
    {
        headers:
        {
            Authorization: "Bearer " + token,
            AccessControlAllowOrigin: true
        }
    })
    .then((response) => responsey = response.json())
    .then((data) => {
        //get user
        userID = data.id;
        // console.log(data);
    })
    .then((data) => { //get courses
        fetch('https://canvas.instructure.com/api/v1/users/self/courses/?enrollment_state=active',
            {
                headers: { Authorization: "Bearer " + token }
            })
            .then((response) => responsey = response.text())
            .then((data) => {
                return JSON.parse(data.replace(/("[^"]*"\s*:\s*)(\d{16,})/g, '$1"$2"'))
                // console.log(data)
            })
            .then((data) => {
                // console.log(data);
                for (let course in data) { //look through each course
                    // console.log(data[course].name);
                    // console.log(data[course].id);
                    //THEY WERE HERE !!!
                    var divvy = document.createElement("div")
                    divvy.setAttribute("id", (data[course].id).slice(-5))
                    document.body.appendChild(divvy)
                    var h3 = document.createElement("h3");
                    h3.innerHTML = data[course].name;
                    divvy.appendChild(h3)
                    //get assignments!
                    fetch('https://canvas.instructure.com/api/v1/users/self/courses/' + data[course].id + '/assignments/', {
                        headers: { Authorization: "Bearer " + token }
                    })
                        .then((response) => responsey = response.text())
                        .then((datas) => JSON.parse(datas.replace(/("[^"]*"\s*:\s*)(\d{16,})/g, '$1"$2"')))
                        .then((datas) => {
                            // console.log(data)
                            for (let assignment in datas) { //for each assignment
                                // console.log(datas[assignment].name)
                                // console.log(datas[assignment].due_at)
                                //get submissions!
                                fetch('https://canvas.instructure.com/api/v1/users/self/courses/' + data[course].id + '/assignments/' + datas[assignment].id.toString() + '/?include[can_submit]', {
                                    headers: { Authorization: "Bearer " + token }
                                })
                                    .then((sub_data) => {
                                        console.log(datas[assignment]);
                                        // console.log(sub_data);
                                    })
                                //NOW HERE!!!!!!!!
                                //update html with all assignment info!
                                //date calculations
                                var due = new Date(datas[assignment].due_at);
                                var current = new Date(Date.now());
                                var cansubmit = datas[assignment].can_submit;
                                console.log("can submit: " + cansubmit) 

                                
                                var THEdiv = document.getElementById(datas[assignment].course_id);
                                // var x = document.createElement("INPUT");
                                // x.setAttribute("type", "checkbox"); 
                                // x.setAttribute("id", datas[assignment].id); //id 12345
                                // THEdiv.appendChild(checkholder)
                                // checkholder.appendChild(x)
                                // if(cansubmit){
                                    THEdiv.innerHTML = //adding up each ONE
                                        THEdiv.innerHTML + '<label id="checkclick" for="'+datas[assignment].id+'"> <div class="THEholder"><div class="leeft">'+
                                        '<input type="checkbox" id="'+ datas[assignment].id +'">' +
                                        datas[assignment].name + 
                                        '</div><span class="dueTime" id=due'+ 
                                        datas[assignment].id +'>'+ timeToDue(due,current) +'</span>'+'</div>'+'</label>'+"<br>";
                                // }
                            }

                            document.getElementById("totalbox").textContent=document.querySelectorAll('input[type="checkbox"]').length;
                        })
                }
            })
    })

function timeToDue(due, current) {
    due = new Date(due).getTime()
    current = new Date(current).getTime()
    let difference = due - current;
    let day = Math.floor(difference/86400000);
    let hours = Math.floor((difference%86400000)/3600000);
    let minutes = Math.floor(((difference%86400000)%3600)/60);
    // let day = difference.getDay();
    // let hours = difference.getHours();
    // let minutes = difference.getMinutes();
    // console.log("due date: " + due);
    // console.log("current time: " + current);
    // console.log("difference... "+ due +"-"+current+"=" + difference)
    if (minutes <= 0) {
        return "past due"
    } else if (hours <= 0) {
        return "due in " + minutes + " Minutes."
    } else if (day <= 0) {
        return "due in " + hours +" Hours and " + minutes + " Minutes."
    } else {
        return "due in " + day +" Day(s), "+ hours +" Hour(s), and " + minutes + " Minute(s)."
    }
}



function clik() {
    numChecked = document.querySelectorAll('input[type="checkbox"]:checked').length
    document.getElementById("boxesdone").textContent=numChecked;
    console.log(numChecked)
    console.log("All boxes: " + document.querySelectorAll('input[type="checkbox"]').length)
}

function fetchData(apiURL) { // not used.. LOL ! >:)
    fetch(apiURL)
        .then(result => result.json())
        .then(data => {
            console.log(data);
            apiURL = data['next_page'];
            // Check next API url is empty or not, if not empty call the above function 
            if (apiURL != '' && apiURL != null) {
                fetchData(apiURL);
            }
        })
}